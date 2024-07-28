import pandas as pd

from dbconnection import dbtest, bulk_insert_df
from fetch_data_from_hourly_api import download_excel
from sql_queries.file_uploader import meter_file_processing_query, iv_file_processing_query


class AddMeterData:
    def __init__(self, facility_id, iv=False):
        self.iv = iv
        self.facility_id = facility_id
        self.raw_data_query = meter_file_processing_query.format(self.facility_id)
        self.iv_data_query = iv_file_processing_query.format(self.facility_id)
        self.raw_df = dbtest(self.raw_data_query) if not self.iv else dbtest(self.iv_data_query)

    def initiate_meter_download(self):
        for _, row in self.raw_df.iterrows():
            record_id = row.get('file_record_id')
            meter_name = row.get('meter_name')
            meter_detail_id = row.get('facility_meter_detail_id')
            url = row.get('media_url')
            purchased_from_grid = row.get('purchased_from_the_grid')
            meter_type = row.get('meter_type')
            df = download_excel(url)
            df['meter_id'] = meter_detail_id
            df['meter_type'] = meter_type
            df['is_independent_variable'] = False
            df['purchased_from_grid'] = purchased_from_grid
            df['meter_name'] = meter_name
            df['facility_id'] = self.facility_id
            df['start_year'] = None
            df['end_year'] = None
            df['start_month'] = None
            df['end_month'] = None
            df = df.rename(columns={
                'Meter Reading (Required)': 'reading',
                'Start Date (Required)': 'start_date',
                'End Date (Required)': 'end_date'
            })
            # Convert start_date and end_date to datetime
            df['start_date'] = pd.to_datetime(df['start_date'])
            df['end_date'] = pd.to_datetime(df['end_date'])

            # Extract year and month from start_date and end_date
            df['start_year'] = df['start_date'].dt.year
            df['start_month'] = df['start_date'].dt.month
            df['end_year'] = df['end_date'].dt.year
            df['end_month'] = df['end_date'].dt.month
            bulk_insert_df(df, 'meter_hourly_entries', record_id, 'facility_meter_hourly_entries')
            # bulk_insert_df(df, 'meter_hourly_entries')

    def initiate_iv_download(self):
        for _, row in self.raw_df.iterrows():
            record_id = row.get('file_record_id')
            meter_name = row.get('independent_variable_name')
            iv_id = row.get('independent_variable_id')
            url = row.get('media_url')
            purchased_from_grid = row.get('purchased_from_the_grid')
            meter_type = None
            df = download_excel(url)
            # df['meter_id'] = meter_detail_id
            df['meter_type'] = meter_type
            df['is_independent_variable'] = True
            df['purchased_from_grid'] = purchased_from_grid
            df['meter_name'] = meter_name
            df['facility_id'] = self.facility_id
            df['start_year'] = None
            df['end_year'] = None
            df['start_month'] = None
            df['end_month'] = None
            df['independent_variable_id'] = iv_id
            df = df.rename(columns={
                'Meter Reading (Required)': 'reading',
                'Start Date (Required)': 'start_date',
                'End Date (Required)': 'end_date'
            })
            # Convert start_date and end_date to datetime
            df['start_date'] = pd.to_datetime(df['start_date'])
            df['end_date'] = pd.to_datetime(df['end_date'])

            # Extract year and month from start_date and end_date
            df['start_year'] = df['start_date'].dt.year
            df['start_month'] = df['start_date'].dt.month
            df['end_year'] = df['end_date'].dt.year
            df['end_month'] = df['end_date'].dt.month
            # df, table_name, record_id, file_table
            bulk_insert_df(df, 'meter_hourly_entries', record_id, 'independent_variable_file')

    def process(self):
        if self.iv:
            self.initiate_iv_download()
        self.initiate_meter_download()
