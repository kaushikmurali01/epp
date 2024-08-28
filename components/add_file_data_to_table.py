import numpy as np
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
from dbconnection import dbtest, bulk_insert_df, refresh_materialised_view, update_workflow
from openpyxl import load_workbook
import io
import requests
from sql_queries.file_uploader import meter_file_processing_query, iv_file_processing_query


def download_excel(url):
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

    @staticmethod
    def is_float_or_int(val):
        return isinstance(val, (float, int))

    def process_file(self, row):
        try:
            record_id = row.get('file_record_id')
            meter_name = row.get('meter_name') if not self.iv else row.get('independent_variable_name')
            meter_detail_id = row.get('facility_meter_detail_id') if not self.iv else None
            url = row.get('media_url')
            purchased_from_grid = row.get('purchased_from_the_grid')
            meter_type = row.get('meter_type') if not self.iv else None
            iv_id = row.get('independent_variable_id') if self.iv else None

            excel_data = download_excel(url)
            excel_io = io.BytesIO(excel_data)

            # Load the workbook to check for visible sheets
            wb = load_workbook(excel_io, read_only=True)
            visible_sheets = [sheet.title for sheet in wb.worksheets if sheet.sheet_state == 'visible']

            # Reset the BytesIO object for pandas to read
            excel_io.seek(0)

            # Read only visible sheets
            df_list = []
            with pd.ExcelFile(excel_io) as xls:
                for sheet_name in visible_sheets:
                    df = pd.read_excel(xls, sheet_name)
                    df_list.append(df)

            # Combine all dataframes
            if not df_list:
                raise ValueError("No visible sheets found in the Excel file.")

            df = pd.concat(df_list, ignore_index=True)

            required_columns = ['Meter Reading (Required)', 'Start Date (Required)', 'End Date (Required)']
            if not all(col in df.columns for col in required_columns):
                raise ValueError(f"Missing required columns. Expected: {required_columns}")

            df['meter_id'] = meter_detail_id
            df['meter_type'] = meter_type
            df['is_independent_variable'] = self.iv
            df['purchased_from_grid'] = purchased_from_grid
            df['meter_name'] = meter_name
            df['facility_id'] = self.facility_id
            df['independent_variable_id'] = iv_id if self.iv else None

            df = df.rename(columns={
                'Meter Reading (Required)': 'reading',
                'Start Date (Required)': 'start_date',
                'End Date (Required)': 'end_date'
            })
            df['reading'] = df['reading'].apply(lambda x: float(x) if self.is_float_or_int(x) else np.nan)

            # df['start_date'] = pd.to_datetime(df['start_date'])
            # df['end_date'] = pd.to_datetime(df['end_date'])
            # df['start_date'] = df['start_date'].dt.floor('H')  # 'T' or 'min' for minute precision
            # df['end_date'] = df['end_date'].dt.floor('H')

            df['start_year'] = df['start_date'].dt.year
            df['start_month'] = df['start_date'].dt.month
            df['end_year'] = df['end_date'].dt.year
            df['end_month'] = df['end_date'].dt.month
            required_columns = ['start_date', 'end_date', 'reading',
                                'meter_id', 'meter_type', 'is_independent_variable',
                                'purchased_from_grid', 'meter_name', 'facility_id',
                                'independent_variable_id', 'start_year', 'start_month', 'end_year',
                                'end_month']
            df = df[required_columns]
            bulk_insert_df(df, 'epp.meter_hourly_entries', record_id,
                           'epp.independent_variable_file' if self.iv else 'epp.facility_meter_hourly_entries')
            field = 'weather_iv' if self.iv else 'ew'
            update_workflow(field, self.facility_id)
            return f"Successfully processed record ID: {record_id}"
        except Exception as e:
            return f"Failed to process record ID: {record_id}. Error: {str(e)}"

    def process_files(self):
        with ThreadPoolExecutor(max_workers=500) as executor:  # Adjust max_workers as needed
            futures = [executor.submit(self.process_file, row) for _, row in self.raw_df.iterrows()]

            for future in as_completed(futures):
                print(future.result())

    def process(self):
        self.process_files()
        # refresh_materialised_view()
