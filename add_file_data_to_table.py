import pandas as pd

from dbconnection import dbtest#, bulk_insert_df
from fetch_data_from_hourly_api import download_excel


class AddMeterData:
    def __init__(self, facility_id):
        self.facility_id = facility_id
        self.raw_data_query = f'''
                SELECT DISTINCT 
                    hme.facility_id, 
                    hme.facility_meter_detail_id, 
                    hme.meter_id,
                    hme.created_by, 
                    hme.media_url, 
                    fmd.purchased_from_the_grid, 
                    fmd.is_active,
                    fmd.meter_type,
                    fmd.meter_name
                FROM 
                    epp.facility_meter_hourly_entries hme 
                JOIN 
                    epp.facility_meter_detail fmd
                ON 
                    hme.facility_meter_detail_id = fmd.id
                WHERE
                    hme.facility_id = {self.facility_id} AND
                    fmd.is_active = 1;
                '''

        self.iv_data_query = f'''
                SELECT 
                    iv.id AS independent_variable_id,
                    iv.name AS independent_variable_name,
                    ivf.file_path AS media_url                 
                FROM 
                    independent_variable AS iv                
                JOIN 
                    independent_variable_file AS ivf          
                ON 
                    iv.id = ivf.independent_variable_id where facility_id={self.facility_id};
                '''
        self.raw_df = dbtest(self.raw_data_query)
        self.iv_df = dbtest(self.iv_data_query)

    def initiate_meter_download(self):
        for _, row in self.raw_df.iterrows():
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

            # bulk_insert_df(df, 'meter_hourly_entries')

    def initiate_iv_download(self):
        for _, row in self.iv_df.iterrows():
            meter_name = row.get('independent_variable_name')
            meter_detail_id = row.get('independent_variable_id')
            url = row.get('media_url')
            purchased_from_grid = row.get('purchased_from_the_grid')
            meter_type = row.get('meter_type')
            df = download_excel(url)
            df['meter_id'] = meter_detail_id
            df['meter_type'] = meter_type
            df['is_independent_variable'] = True
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
            # bulk_insert_df(df, 'meter_hourly_entries')

    def process(self):
        # self.initiate_meter_download()
        self.initiate_iv_download()


# amd = AddMeterData(336)
# amd.process()
