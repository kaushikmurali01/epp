import numpy as np
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
from dbconnection import dbtest, execute_query, optimized_bulk_insert_df
from openpyxl import load_workbook
import io
import requests
from sql_queries.file_uploader import meter_file_processing_query, iv_file_processing_query, \
    ERROR_UPLOADER_INTIMATION_IV, ERROR_UPLOADER_INTIMATION_METER
import logging


# Setup logging
# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


def download_file(url):
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception for bad status codes
    return response.content


class AddMeterData:
    def __init__(self, facility_id, record_id, iv=False):
        self.record_id = record_id
        self.iv = iv
        self.facility_id = facility_id
        self.raw_data_query = meter_file_processing_query.format(self.facility_id, self.record_id)
        self.iv_data_query = iv_file_processing_query.format(self.facility_id, self.record_id)
        self.raw_df = dbtest(self.raw_data_query) if not self.iv else dbtest(self.iv_data_query)
        self.is_workflow_updated = False

    def add_update_workflow(self):
        if self.iv:
            query = "UPDATE epp.workflow SET weather_iv= true WHERE facility_id={}".format(self.facility_id)
        else:
            query = "UPDATE epp.workflow SET ew= true WHERE facility_id={}".format(self.facility_id)
        execute_query(query)

    @staticmethod
    def is_float_or_int(val):
        return isinstance(val, (float, int))

    def prepare_data_for_insertion(self, df):
        df.rename(columns={'Start Date (Required)': 'start_date', 'End Date (Required)': 'end_date',
                           'Meter Reading (Required)': 'reading'}, inplace=True)
        df['start_date_og'] = df['start_date']
        df['end_date_og'] = df['end_date']
        df['reading_og'] = df['reading']
        df['reading'] = pd.to_numeric(df['reading'], errors='coerce')
        df['start_date'] = pd.to_datetime(df['start_date'], errors='coerce')
        df['end_date'] = pd.to_datetime(df['end_date'], errors='coerce')
        df['start_year'] = df['start_date'].dt.year
        df['start_month'] = df['start_date'].dt.month
        df['end_year'] = df['end_date'].dt.year
        df['end_month'] = df['end_date'].dt.month

        int_columns = ['start_year', 'start_month', 'end_year', 'end_month']
        for col in int_columns:
            df[col] = df[col].fillna(-1).astype(int)

        if self.iv:
            df['missing'] = df[['start_date', 'end_date']].isna().any(axis=1) | df['reading'].isna()
        else:
            df['missing'] = df[['start_date', 'end_date']].isna().any(axis=1) | df['reading'].isna() | (
                    df['reading'] == 0)

        clean_data = df[~df['missing']].copy()
        Q1 = clean_data['reading'].quantile(0.25)
        Q3 = clean_data['reading'].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR

        clean_data['outliers'] = (clean_data['reading'] < lower_bound) | (clean_data['reading'] > upper_bound)
        for col in ['start_year', 'start_month', 'end_year', 'end_month']:
            clean_data[col] = clean_data[col].astype(int)
        for col in ['start_date_og', 'end_date_og', 'reading_og']:
            clean_data[col] = clean_data[col].astype(str)

        df = df.join(clean_data['outliers'], how='left')
        df['outliers'].fillna(False, inplace=True)
        df['start_date'] = df['start_date'].astype(object).where(df['start_date'].notnull(), None)
        df['end_date'] = df['end_date'].astype(object).where(df['end_date'].notnull(), None)

        return df

    def process_file(self, row):
        logging.debug("File Process Started")
        try:
            record_id = row.get('file_record_id')
            meter_name = row.get('meter_name') if not self.iv else row.get('independent_variable_name')
            meter_detail_id = row.get('facility_meter_detail_id') if not self.iv else None
            url = row.get('media_url')
            purchased_from_grid = row.get('purchased_from_the_grid')
            meter_type = row.get('meter_type') if not self.iv else None
            iv_id = row.get('independent_variable_id') if self.iv else None

            csv_data = download_file(url)
            csv_io = io.BytesIO(csv_data)
            df = pd.read_csv(csv_io)
            df = self.prepare_data_for_insertion(df)
            df['meter_id'] = meter_detail_id
            df['meter_type'] = meter_type
            df['is_independent_variable'] = self.iv
            df['purchased_from_grid'] = purchased_from_grid
            df['meter_name'] = meter_name
            df['facility_id'] = self.facility_id
            df['independent_variable_id'] = iv_id if self.iv else None
            df['reading'] = df['reading'].apply(lambda x: float(x) if self.is_float_or_int(x) else np.nan)
            required_columns = ['start_date', 'end_date', 'reading', 'start_date_og', 'end_date_og', 'reading_og',
                                'outliers', 'missing',
                                'meter_id', 'meter_type', 'is_independent_variable',
                                'purchased_from_grid', 'meter_name', 'facility_id',
                                'independent_variable_id', 'start_year', 'start_month', 'end_year',
                                'end_month', 'is_active']
            df = df[required_columns]
            logging.debug("DB Insert Started:{}".format(self.iv))
            optimized_bulk_insert_df(
                df,
                'meter_hourly_entries',
                record_id,
                'independent_variable_file' if self.iv else 'facility_meter_hourly_entries'
            )
            execute_query("DELETE FROM meter_hourly_entries where is_active = false")
            if not df.empty:
                if not self.is_workflow_updated:
                    self.is_workflow_updated = True
                    self.add_update_workflow()
            logging.debug("DB Insert End")
            return f"Successfully processed record ID: {record_id}"
        except Exception as e:
            if self.iv:
                query = ERROR_UPLOADER_INTIMATION_IV.format(self.record_id)
            else:
                query = ERROR_UPLOADER_INTIMATION_METER.format(self.record_id)
            execute_query(query)
            logging.error(f"Failed to process record ID: {record_id}. Error: {str(e)}")

    def process_files(self):
        with ThreadPoolExecutor(max_workers=500) as executor:
            futures = [executor.submit(self.process_file, row) for _, row in self.raw_df.iterrows()]
            for future in as_completed(futures):
                logging.debug(future.result())

    def process(self):
        # self.add_update_workflow()
        self.process_files()

