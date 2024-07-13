from dbconnection import dbtest
from fetch_data_from_hourly_api import download_excel
import pandas as pd


class DataExplorationSummary:
    def __init__(self, facility_id):
        self.facility_id = facility_id
        query = f'''
        SELECT DISTINCT 
            hme.facility_id, 
            hme.facility_meter_detail_id AS meter_type, 
            hme.meter_id,
            hme.created_by, 
            hme.media_url, 
            fmd.purchased_from_the_grid, 
            fmd.is_active
        FROM 
            epp.facility_meter_hourly_entries hme 
        JOIN 
            epp.facility_meter_detail fmd
        ON 
            hme.facility_meter_detail_id = fmd.meter_type
        WHERE
            hme.facility_id = {facility_id} AND
            fmd.is_active = 1;
        '''
        self.df = dbtest(query)  # Assuming dbtest is defined elsewhere and returns a DataFrame
        self.combined_df = pd.DataFrame()

    def download_files_with_url(self, url):
        return download_excel(url)  # Assuming download_excel is defined elsewhere and returns a DataFrame

    def get_outlier_summary(self):
        for _, row in self.df.iterrows():
            url = row['media_url']
            meter_type = row['meter_type']
            df = self.download_files_with_url(url)
            df['MeterType'] = meter_type
            self.combined_df = pd.concat([self.combined_df, df], ignore_index=True)
        return self.combined_df

    def get_missing_data_summary(self):
        for _, row in self.df.iterrows():
            url = row['media_url']
            meter_type = row['meter_type']
            df = self.download_files_with_url(url)
            df['MeterType'] = meter_type
            self.combined_df = pd.concat([self.combined_df, df], ignore_index=True)
        return self.combined_df

    def get_observe_data_summary(self):
        for _, row in self.df.iterrows():
            url = row['media_url']
            meter_type = row['meter_type']
            df = self.download_files_with_url(url)
            df['MeterType'] = meter_type
            self.combined_df = pd.concat([self.combined_df, df], ignore_index=True)
        observed_summary = self.combined_df
        # Getting distinct meter types
        distinct_meter_types = observed_summary['MeterType'].unique()
        # Creating a dictionary to store meter configurations
        as_per_meter_configuration = {}

        # Defining a meter type mapping
        meter_map = {1: 'Electricity', 2: 'Water', 3: 'Natural Gas'}

        # Looping through each distinct meter type to create the configuration
        for meter_type in distinct_meter_types:
            meter_type = int(meter_type)
            data = observed_summary[observed_summary['MeterType'] == meter_type]
            total_records = data.shape[0]

            # Ensuring the ReadingDate column is in datetime format
            data['ReadingDate'] = pd.to_datetime(data['ReadingDate'])

            # Finding the maximum and minimum dates
            max_date = data['ReadingDate'].max()
            min_date = data['ReadingDate'].min()
            data['ReadingDate'] = data['ReadingDate'].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S'))

            # Converting min_date and max_date to string format
            min_date_str = min_date.strftime('%Y-%m-%d %H:%M:%S')
            max_date_str = max_date.strftime('%Y-%m-%d %H:%M:%S')

            as_per_meter_configuration[meter_type] = {
                "meter_type": meter_map.get(meter_type),
                "time_stamp_start": min_date_str,
                "time_stamp_end": max_date_str,
                "total_records": total_records,
                #'dataset': data.to_json(orient='records')
            }

        return as_per_meter_configuration, data
