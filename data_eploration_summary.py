from dbconnection import dbtest
from fetch_data_from_hourly_api import download_excel
import pandas as pd
import numpy as np


class ProcessDataframe:
    @staticmethod
    def process_missing_data_by_meter_type(df, meter):
        """
        Process missing data by meter type.

        Args:
        - df (DataFrame): Input DataFrame containing meter data.
        - meter (str): Meter type identifier.

        Returns:
        - DataFrame: Processed DataFrame with hourly kW means, start date, and end date.
        - Timestamp: Start date of data.
        - Timestamp: End date of data.
        """
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

    @staticmethod
    def process_observe_data_by_meter_type(df, meter):
        """
        Process observed data by meter type.

        Args:
        - df (DataFrame): Input DataFrame containing meter data.
        - meter (str): Meter type identifier.

        Returns:
        - dict: Dictionary containing start date, end date, and total records.
        """
        meter_type = int(meter)
        data = df[df['MeterType'] == meter_type]
        total_records = data.shape[0]

        # Ensure 'ReadingDate' column is in datetime format
        data['ReadingDate'] = pd.to_datetime(data['ReadingDate'])

        # Finding the maximum and minimum dates
        max_date = data['ReadingDate'].max()
        min_date = data['ReadingDate'].min()

        # Convert dates to string format
        min_date_str = min_date.strftime('%Y-%m-%d %H:%M:%S')
        max_date_str = max_date.strftime('%Y-%m-%d %H:%M:%S')

        # Prepare mapped data
        mapped_data = {
            "time_stamp_start": min_date_str,
            "time_stamp_end": max_date_str,
            "total_records": total_records,
        }
        return mapped_data


class DataExplorationSummary(ProcessDataframe):
    def __init__(self, facility_id):
        """
        Initialize DataExplorationSummary object.

        Args:
        - facility_id (int): Facility ID to fetch data for.
        """
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
        """
        Download Excel files from URL.

        Args:
        - url (str): URL to download Excel file from.

        Returns:
        - DataFrame: DataFrame containing downloaded data.
        """
        return download_excel(url)  # Assuming download_excel is defined elsewhere and returns a DataFrame

    def get_outlier_summary(self):
        """
        Get outlier summary for all meter types.

        Returns:
        - DataFrame: Combined DataFrame of outlier data.
        """
        for _, row in self.df.iterrows():
            url = row['media_url']
            meter_type = row['meter_type']
            df = self.download_files_with_url(url)
            df['MeterType'] = meter_type
            self.combined_df = pd.concat([self.combined_df, df], ignore_index=True)
        return self.combined_df

    def get_missing_data_summary(self):
        """
        Get missing data summary for all meter types.

        Returns:
        - dict: Dictionary containing missing data summaries for each meter type.
        """
        for _, row in self.df.iterrows():
            url = row['media_url']
            meter_type = row['meter_type']
            df = self.download_files_with_url(url)
            df['MeterType'] = meter_type
            self.combined_df = pd.concat([self.combined_df, df], ignore_index=True)

        # Process missing data summaries for each distinct meter type
        distinct_meter_types = self.combined_df['MeterType'].unique()
        mapped_data = {}
        for meter_type in distinct_meter_types:
            filtered_df = self.combined_df[self.combined_df['MeterType'] == meter_type][:]
            returned_data_frame, start_date, end_date = self.process_missing_data_by_meter_type(filtered_df, meter_type)
            mapped_data[int(meter_type)] = {
                "time_stamp_start": start_date.strftime('%Y-%m-%d %H:%M'),
                "time_stamp_end": end_date.strftime('%Y-%m-%d %H:%M'),
                "total_records": int(returned_data_frame.isna().sum().sum()),
            }
        return mapped_data

    def get_observe_data_summary(self):
        """
        Get observe data summary for all meter types.

        Returns:
        - dict: Dictionary containing observe data summaries for each meter type.
        """
        for _, row in self.df.iterrows():
            url = row['media_url']
            meter_type = row['meter_type']
            df = self.download_files_with_url(url)
            df['MeterType'] = meter_type
            self.combined_df = pd.concat([self.combined_df, df], ignore_index=True)

        # Process observe data summaries for each distinct meter type
        combined_df = self.combined_df
        meter_types = combined_df['MeterType'].unique()
        response_map = {}
        for meter_type in meter_types:
            meter_type = int(meter_type)
            filtered_df = combined_df[combined_df['MeterType'] == meter_type][:]

            # Convert 'End Date (Required)' and 'Start Date (Required)' columns to datetime if they are not already
            filtered_df['End Date (Required)'] = pd.to_datetime(filtered_df['End Date (Required)'])
            filtered_df['Start Date (Required)'] = pd.to_datetime(filtered_df['Start Date (Required)'])

            end_date = filtered_df['End Date (Required)'].max()
            start_date = filtered_df['Start Date (Required)'].min()
            response = {
                "time_stamp_end": end_date.strftime('%Y-%m-%d  %H:%M') if isinstance(end_date, pd.Timestamp) else '',
                "time_stamp_start": start_date.strftime('%Y-%m-%d  %H:%M') if isinstance(start_date,
                                                                                         pd.Timestamp) else '',
                "total_records": filtered_df.shape[0],
            }
            response_map[meter_type] = response
        return response_map
