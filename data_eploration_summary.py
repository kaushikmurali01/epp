from dbconnection import dbtest
from fetch_data_from_hourly_api import download_excel
import pandas as pd
import numpy as np

from paginator import Paginator


class ProcessDataframe:
    @staticmethod
    def process_missing_data_by_meter_type(df, meter):
        if 'Unnamed: 0' in df.columns:
            df = df.drop("Unnamed: 0", axis=1)

        filtered_df = df[df['MeterType'] == meter][:]
        filtered_df['Start Date (Required)'] = pd.to_datetime(filtered_df['Start Date (Required)'])
        filtered_df['End Date (Required)'] = pd.to_datetime(filtered_df['End Date (Required)'])
        filtered_df['FormattedDate'] = filtered_df['Start Date (Required)'].dt.strftime('%d-%m-%Y %H')
        grouped_by_df = filtered_df.groupby('FormattedDate')['Meter Reading (Required)'].mean().round(2).reset_index()
        start_date = filtered_df['Start Date (Required)'].min().floor('H')
        end_date = filtered_df['Start Date (Required)'].max().floor('H')
        all_hours = pd.date_range(start=start_date, end=end_date, freq='H')
        all_hours_df = pd.DataFrame({'FormattedDate': all_hours.strftime('%d-%m-%Y %H')})
        merged_df = pd.merge(all_hours_df, grouped_by_df, on='FormattedDate', how='left')
        merged_df['Meter Reading (Required)'].fillna(np.nan, inplace=True)

        nan_values_df = merged_df[merged_df['Meter Reading (Required)'].isna()]
        return nan_values_df.shape[0], filtered_df['Start Date (Required)'].min(), filtered_df[
            'End Date (Required)'].max()

    @staticmethod
    def process_outlier_data_by_meter_type(df, meter):

        if 'Unnamed: 0' in df.columns:
            df = df.drop("Unnamed: 0", axis=1)

        filtered_df = df[df['MeterType'] == meter][:]

        filtered_df['Meter Reading (Required)'] = pd.to_numeric(filtered_df['Meter Reading (Required)'],
                                                                errors='coerce')

        # Describe the filtered data
        description = filtered_df.describe()

        filtered_df['Start Date (Required)'] = pd.to_datetime(filtered_df['Start Date (Required)'])
        filtered_df['End Date (Required)'] = pd.to_datetime(filtered_df['End Date (Required)'])

        # Extract relevant statistics
        Q1 = description.loc['25%']
        Q3 = description.loc['75%']
        IQR = Q3 - Q1

        factor = 3  # Example factor for outlier detection, adjust as needed

        lower_limit = Q1['Meter Reading (Required)'] - factor * IQR['Meter Reading (Required)']
        upper_limit = Q3['Meter Reading (Required)'] + factor * IQR['Meter Reading (Required)']

        # Filter outliers based on the calculated limits
        outliers_df = filtered_df[(filtered_df['Meter Reading (Required)'] < lower_limit) | (
                filtered_df['Meter Reading (Required)'] > upper_limit)]

        # Print or further process outliers_df as needed
        return outliers_df.shape[0], Q1, Q3, IQR, upper_limit, lower_limit, filtered_df['Start Date (Required)'].min(), \
            filtered_df['End Date (Required)'].max()

    @staticmethod
    def process_outlier_data_by_iv(df, iv):

        if 'Unnamed: 0' in df.columns:
            df = df.drop("Unnamed: 0", axis=1)

        filtered_df = df[df['IV Name'] == iv][:]

        filtered_df['Meter Reading (Required)'] = pd.to_numeric(filtered_df['Meter Reading (Required)'],
                                                                errors='coerce')

        # Describe the filtered data
        description = filtered_df.describe()

        filtered_df['Start Date (Required)'] = pd.to_datetime(filtered_df['Start Date (Required)'])
        filtered_df['End Date (Required)'] = pd.to_datetime(filtered_df['End Date (Required)'])

        # Extract relevant statistics
        Q1 = description.loc['25%']
        Q3 = description.loc['75%']
        IQR = Q3 - Q1

        factor = 1.5  # Example factor for outlier detection, adjust as needed

        lower_limit = Q1['Meter Reading (Required)'] - factor * IQR['Meter Reading (Required)']
        upper_limit = Q3['Meter Reading (Required)'] + factor * IQR['Meter Reading (Required)']

        # Filter outliers based on the calculated limits
        outliers_df = filtered_df[(filtered_df['Meter Reading (Required)'] < lower_limit) | (
                filtered_df['Meter Reading (Required)'] > upper_limit)]
        outliers_df['IV ID'].unique()[0]
        # Print or further process outliers_df as needed
        return outliers_df.shape[0], Q1, Q3, IQR, upper_limit, lower_limit, filtered_df['Start Date (Required)'].min(), \
            filtered_df['End Date (Required)'].max(), outliers_df['IV ID'].unique()[0]


class DataExplorationSummary(ProcessDataframe):
    def __init__(self, facility_id, meter, detail, page_no, page_size, detail_setting):
        """
        Initialize DataExplorationSummary object.

        Args:
        - facility_id (int): Facility ID to fetch data for.
        """
        self.meter = int(meter) if meter else None
        self.detail = detail
        self.facility_id = facility_id
        self.page_no = int(page_no)
        self.page_size = int(page_size)
        self.detail_setting = detail_setting
        query = f'''
        SELECT DISTINCT 
            hme.facility_id, 
            hme.facility_meter_detail_id, 
            hme.meter_id,
            hme.created_by, 
            hme.media_url, 
            fmd.purchased_from_the_grid, 
            fmd.is_active,
            fmd.meter_type
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
        self.combined_df = pd.DataFrame()
        self.meter_map = {1: "ELECTRICITY",
                          2: "WATER",
                          3: "NATURAL GAS"}

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
        if len(self.combined_df) == 0:
            return {}
        distinct_meter_types = self.combined_df['MeterType'].unique()
        mapped_data = []
        summary_pop_up_data = []
        outlier_factor = []
        for meter_type in distinct_meter_types:
            outliers_df, Q1, Q3, IQR, upper_limit, lower_limit, start_date, end_date = self.process_outlier_data_by_meter_type(
                self.combined_df,
                meter_type)
            outlier_factor.append(
                {"meter_type": int(meter_type), "meter_name": self.meter_map.get(int(meter_type)), 'range_factor': 3})
            summary_data = {
                "meter_type": int(meter_type),
                "meter_name": self.meter_map.get(int(meter_type)),
                "first_quartile": float(Q1.iloc[0]),
                "third_quartile": float(Q3.iloc[0]),
                "inter_quartile": float(IQR.iloc[0]),
                "lower_limit": "{:.2f}".format(lower_limit),
                "upper_limit": "{:.2f}".format(upper_limit)

            }
            summary_pop_up_data.append(summary_data)
            outlier_data = {
                "threshold": "Upper limit",
                "type": "Global/Local",
                "meter_type": int(meter_type),
                "meter_name": self.meter_map.get(int(meter_type)),
                "time_stamp_start": start_date.strftime('%Y-%m-%d %H:%M'),
                "time_stamp_end": end_date.strftime('%Y-%m-%d %H:%M'),
                "total_records": int(outliers_df),
            }
            mapped_data.append(outlier_data)
        outlier_factor.append({"meter_type": 100001, "meter_name": "Independent Variable", 'range_factor': 1.5})
        iv_query = f"""
        SELECT 
            iv.id,
            iv.name,                                 
            iv.description,                          
            ivf.file_path                            
        FROM 
            independent_variable AS iv                
        JOIN 
            independent_variable_file AS ivf          
        ON 
            iv.id = ivf.independent_variable_id where facility_id={self.facility_id};
        """
        iv_df = dbtest(iv_query)
        iv_combined = pd.DataFrame()
        for _, row in iv_df.iterrows():
            url = row['file_path']
            name = row['name']
            iv_id = row['id']
            df = self.download_files_with_url(url)
            df['IV Name'] = name
            df['IV ID'] = iv_id
            iv_combined = pd.concat([iv_combined, df], ignore_index=True)
        distinct_variable_types = iv_combined['IV Name'].unique()
        for independent_variable in distinct_variable_types:
            outliers_df, Q1, Q3, IQR, upper_limit, lower_limit, start_date, end_date, df_iv_id = self.process_outlier_data_by_iv(
                iv_combined,
                independent_variable)
            if not outliers_df:
                continue
            summary_data = {
                "iv_id": int(df_iv_id),
                "iv_name": independent_variable,
                "first_quartile": float(Q1.iloc[0]),
                "third_quartile": float(Q3.iloc[0]),
                "inter_quartile": float(IQR.iloc[0]),
                "lower_limit": "{:.2f}".format(lower_limit),
                "upper_limit": "{:.2f}".format(upper_limit)

            }
            summary_pop_up_data.append(summary_data)
        column_name = [rec.get('meter_name') if rec.get('meter_name') else rec.get('iv_name') for rec in
                       summary_pop_up_data]
        iv_combined.to_excel('/Users/varunpratap/Desktop/enerva/iv_combined.xlsx', index=False)
        return {'data': mapped_data, 'popup': {"columns": column_name, "data": summary_pop_up_data},
                "outlier_settings": outlier_factor}

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
        if len(self.combined_df) == 0:
            return {}
        # Process missing data summaries for each distinct meter type
        distinct_meter_types = self.combined_df['MeterType'].unique()
        mapped_data = []
        for meter_type in distinct_meter_types:
            total_records, start_date, end_date = self.process_missing_data_by_meter_type(self.combined_df,
                                                                                          meter_type)
            missing_data = {
                "meter_type": int(meter_type),
                "meter_name": self.meter_map.get(int(meter_type)),
                "time_stamp_start": start_date.strftime('%Y-%m-%d %H:%M'),
                "time_stamp_end": end_date.strftime('%Y-%m-%d %H:%M'),
                "total_records": int(total_records),
            }
            mapped_data.append(missing_data)
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
            if self.meter and meter_type != self.meter:
                continue
            df = self.download_files_with_url(url)
            df['MeterType'] = meter_type
            self.combined_df = pd.concat([self.combined_df, df], ignore_index=True)
        if len(self.combined_df) == 0:
            return {}
        # Process observe data summaries for each distinct meter type
        combined_df = self.combined_df
        meter_types = combined_df['MeterType'].unique()
        mapped_data = []
        for meter_type in meter_types:
            meter_type = int(meter_type)
            filtered_df = combined_df[combined_df['MeterType'] == meter_type][:]

            # Convert 'End Date (Required)' and 'Start Date (Required)' columns to datetime if they are not already
            filtered_df['End Date (Required)'] = pd.to_datetime(filtered_df['End Date (Required)'])
            filtered_df['Start Date (Required)'] = pd.to_datetime(filtered_df['Start Date (Required)'])

            end_date = filtered_df['End Date (Required)'].max()
            start_date = filtered_df['Start Date (Required)'].min()
            observed_data = {
                "meter_type": int(meter_type),
                "meter_name": self.meter_map.get(int(meter_type)),
                "time_stamp_end": end_date.strftime('%Y-%m-%d  %H:%M') if isinstance(end_date, pd.Timestamp) else '',
                "time_stamp_start": start_date.strftime('%Y-%m-%d  %H:%M') if isinstance(start_date,
                                                                                         pd.Timestamp) else '',
                "total_records": filtered_df.shape[0],
            }
            mapped_data.append(observed_data)
        if self.detail:
            columns_to_keep = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']

            # Create a new DataFrame with only the selected columns
            new_df = self.combined_df[columns_to_keep].copy()
            new_df = new_df.rename(columns={
                'Meter Reading (Required)': 'Usage (Required)',
            })
            paginator = Paginator(self.page_no, self.page_size)
            summary_df = paginator.paginate_df(new_df)
            return summary_df
        return mapped_data
