from dbconnection import dbtest
from fetch_data_from_hourly_api import download_excel
import pandas as pd
import numpy as np


class ProcessDataframe:
    @staticmethod
    def process_missing_data_by_meter_type(df, meter):
        # Ensure 'ReadingDate' is in datetime format
        df['ReadingDate'] = pd.to_datetime(df['ReadingDate'])
        # Create a new column with the formatted date (hourly format)
        df['FormattedDate'] = df['ReadingDate'].dt.strftime('%d-%m-%Y %H')
        # Group by the new formatted date column and calculate the mean of the 'kW' column
        grouped_by_df = df.groupby('FormattedDate')['kW'].mean().round(2).reset_index()
        # Generate a complete range of hourly dates within the range of the data
        start_date = df['ReadingDate'].min().floor('H')
        end_date = df['ReadingDate'].max().ceil('H')
        all_hours = pd.date_range(start=start_date, end=end_date, freq='H')
        # Create a DataFrame to ensure all hours are included
        all_hours_df = pd.DataFrame({'FormattedDate': all_hours.strftime('%d-%m-%Y %H')})
        # Merge with the grouped DataFrame to include all hours
        merged_df = pd.merge(all_hours_df, grouped_by_df, on='FormattedDate', how='left')
        # Fill missing values with NaN or a specified fill value (e.g., 0)
        merged_df['kW'].fillna(np.nan, inplace=True)
        return merged_df, start_date, end_date


class DataExplorationSummary(ProcessDataframe):
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
        meter_map = {1: 'Electricity', 2: 'Water', 3: 'Natural Gas'}
        for _, row in self.df.iterrows():
            url = row['media_url']
            meter_type = row['meter_type']
            df = self.download_files_with_url(url)
            df['MeterType'] = meter_type
            self.combined_df = pd.concat([self.combined_df, df], ignore_index=True)
        distinct_meter_types = self.combined_df['MeterType'].unique()
        mapped_data = {}
        for meter_type in distinct_meter_types:
            filtered_df = self.combined_df[self.combined_df['MeterType'] == meter_type][:]
            returned_data_frame, start_date, end_date = self.process_missing_data_by_meter_type(filtered_df, meter_type)
            mapped_data[int(meter_type)] = {
                "meter_type": meter_map.get(meter_type),
                "time_stamp_start": start_date.strftime('%Y-%m-%d %H:%M'),
                "time_stamp_end": end_date.strftime('%Y-%m-%d %H:%M'),
                "total_records": int(returned_data_frame.isna().sum().sum()),
                # 'dataset': returned_data_frame.to_json(orient='records')
            }
        return mapped_data, None

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
                # 'dataset': data.to_json(orient='records')
            }

        return as_per_meter_configuration, None
