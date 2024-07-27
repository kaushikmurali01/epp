import pandas as pd

from dbconnection import dbtest
from fetch_data_from_hourly_api import download_excel


class DataExplorationVisualisation:
    def __init__(self, facility_id):
        """
        Initialize DataExplorationSummary object.

        Args:
        - facility_id (int): Facility ID to fetch data for.
        """
        self.combined_df = pd.DataFrame()
        self.facility_id = facility_id
        query = f'''
        SELECT DISTINCT 
            start_date,
            end_date,
            facility_id, 
            meter_type, 
            meter_id,
            purchased_from_grid, 
            is_active,
            reading
        FROM 
            epp.meter_hourly_entries hme 
        WHERE
            facility_id = {facility_id} AND
            is_active = true AND
            is_independent_variable=false;
        '''
        self.df = dbtest(query)

    def fetch_data(self):
        # for _, row in self.df.iterrows():
        #     url = row['media_url']
        #     purchased_from_grid = row['purchased_from_the_grid']
        #     df = download_excel(url)
        #     df['Purchased From Grid'] = purchased_from_grid
        #     self.combined_df = pd.concat([self.combined_df, df], ignore_index=True)
        df = self.df
        start_date = 'start_date'
        end_date = 'end_date'
        reading = 'reading'
        purchased_from_grid = 'purchased_from_grid'
        df[start_date] = pd.to_datetime(df[start_date], format='%m/%d/%Y %H:%M')
        df[end_date] = pd.to_datetime(df[end_date], format='%m/%d/%Y %H:%M')

        # Extract the hour from the start date for grouping
        df['Hour'] = df[start_date].dt.floor('H')
        df[reading] = pd.to_numeric(df[reading], errors='coerce')

        # Group by hour and 'Purchased From Grid', then calculate the mean meter reading
        # hourly_mean = df.groupby(['Hour', 'Purchased From Grid'])['Meter Reading (Required)'].mean().round(
        #     2).reset_index()
        hourly_mean = df.groupby(['Hour', purchased_from_grid])[reading].mean().round(
            2).reset_index()

        # Rename columns
        hourly_mean.columns = [start_date, purchased_from_grid, reading]

        # Calculate the end date for each hourly interval
        hourly_mean[end_date] = hourly_mean[start_date] + pd.Timedelta(hours=1)

        # Convert the datetime columns to strings
        hourly_mean[start_date] = hourly_mean[start_date].dt.strftime('%m/%d/%Y %H:%M')
        hourly_mean[end_date] = hourly_mean[end_date].dt.strftime('%m/%d/%Y %H:%M')
        json_data = hourly_mean.to_dict(orient='records')
        return json_data
