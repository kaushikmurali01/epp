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
            hme.facility_id, 
            fmd.meter_type AS meter_type, 
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
            hme.facility_meter_detail_id = fmd.id
        WHERE
            hme.facility_id = {facility_id} AND
            fmd.is_active = 1;
        '''
        self.df = dbtest(query)

    def fetch_data(self):
        for _, row in self.df.iterrows():
            url = row['media_url']
            purchased_from_grid = row['purchased_from_the_grid']
            df = download_excel(url)
            df['Purchased From Grid'] = purchased_from_grid
            self.combined_df = pd.concat([self.combined_df, df], ignore_index=True)
        df = self.combined_df.copy()
        df['Start Date (Required)'] = pd.to_datetime(df['Start Date (Required)'], format='%m/%d/%Y %H:%M')
        df['End Date (Required)'] = pd.to_datetime(df['End Date (Required)'], format='%m/%d/%Y %H:%M')

        # Extract the hour from the start date for grouping
        df['Hour'] = df['Start Date (Required)'].dt.floor('H')
        df['Meter Reading (Required)'] = pd.to_numeric(df['Meter Reading (Required)'], errors='coerce')

        # Group by hour and 'Purchased From Grid', then calculate the mean meter reading
        # hourly_mean = df.groupby(['Hour', 'Purchased From Grid'])['Meter Reading (Required)'].mean().round(
        #     2).reset_index()
        hourly_mean = df.groupby(['Hour', 'Purchased From Grid'])['Meter Reading (Required)'].mean().round(
            2).reset_index()

        # Rename columns
        hourly_mean.columns = ['Start Date (Required)', 'Purchased From Grid', 'Mean Meter Reading']

        # Calculate the end date for each hourly interval
        hourly_mean['End Date (Required)'] = hourly_mean['Start Date (Required)'] + pd.Timedelta(hours=1)

        # Convert the datetime columns to strings
        hourly_mean['Start Date (Required)'] = hourly_mean['Start Date (Required)'].dt.strftime('%m/%d/%Y %H:%M')
        hourly_mean['End Date (Required)'] = hourly_mean['End Date (Required)'].dt.strftime('%m/%d/%Y %H:%M')
        json_data = hourly_mean.to_dict(orient='records')
        return json_data