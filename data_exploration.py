import pandas as pd

from constants import METER_FACTOR, IV_FACTOR
from dbconnection import dbtest
from fetch_data_from_hourly_api import download_excel

import random


class QuerySetup:
    def __init__(self, facility_id, target):
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
            fmd.meter_type
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
        '''
        self.temperature_query = f"""
            SELECT 
                ROUND(AVG(temp), 2) AS meter_reading, 
                date_time AS start_date,
                date_time + INTERVAL '1 hour' AS end_date
            FROM weather_data
            WHERE facility_id = {facility_id}
            GROUP BY date_time
            ORDER BY date_time;
        """
        self.combined_raw_df = pd.DataFrame()
        self.combined_iv_df = pd.DataFrame()

        self.data_exploration_summary_response = None
        self.target = target
        self.selected_columns = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']
        self.iv_key = 'IV Name'
        self.meter_key = 'MeterType'
        self.iv_data_mapping = {}
        self.raw_data_mapping = {}
        self.meter_type_map = {1: "ELECTRICITY", 2: "WATER", 3: "NG"}
        self.reverse_meter_type_map = {"ELECTRICITY": 1, "WATER": 2, "NG": 3, "TEMPERATURE": 102}
        self.data_exploration_response = []


class DataExploration(QuerySetup):
    def __init__(self, facility_id, target, meter, bound):
        super().__init__(facility_id, target)
        self.meter = int(meter) if meter else None
        self.bound = bound
        self.df_type = ['Raw Data']
        self.raw_df = dbtest(self.raw_data_query)
        self.temperature_df = dbtest(self.temperature_query)

    def process_raw_data(self):
        if self.raw_df.shape[0]:
            meter_types = self.raw_df[self.meter_key].unique()
            for meter_type in meter_types:
                self.raw_data_mapping[self.meter_type_map.get(int(meter_type))] = \
                    self.raw_df[self.raw_df[self.meter_key] == meter_type][
                        self.selected_columns].copy()
            return self.raw_data_mapping
        return []

    def process_iv(self):
        if len(self.iv_df):
            iv_names = self.iv_df[self.iv_key].unique()
            for iv_name in iv_names:
                self.iv_data_mapping[iv_name] = self.iv_df[self.iv_df[self.iv_key] == iv_name][
                    self.selected_columns].copy()
            return self.iv_data_mapping
        return []

    def process_temperature(self):
        self.temperature_df = self.temperature_df.rename(columns={
            'meter_reading': 'Meter Reading (Required)',
            'start_date': 'Start Date (Required)',
            'end_date': 'End Date (Required)'
        })
        desired_order = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']
        self.temperature_df = self.temperature_df[desired_order]
        return self.temperature_df

    @staticmethod
    def outlier_detection(df, remove=True):
        try:
            desc = df.describe()
            Q1 = desc.loc['25%', 'Meter Reading (Required)']
            Q3 = desc.loc['75%', 'Meter Reading (Required)']
            IQR = Q3 - Q1
            FACTOR = 3
            LOWER = Q1 - FACTOR * IQR
            HIGHER = Q3 + FACTOR * IQR

            if remove:
                return df[(df['Meter Reading (Required)'] < HIGHER) & (df['Meter Reading (Required)'] > LOWER)]
            else:
                upper_df = df[(df['Meter Reading (Required)'] > HIGHER)]
                lower_df = df[(df['Meter Reading (Required)'] < LOWER)]
                filtered_df = df[(df['Meter Reading (Required)'] > HIGHER) | (df['Meter Reading (Required)'] < LOWER)]
                return filtered_df, upper_df, lower_df, HIGHER, LOWER
        except:
            pass

    @staticmethod
    def missing_data_detection(df, remove=True, consider_zero=True):
        # Convert 'Meter Reading (Required)' to numeric, coercing errors to NaN
        df['Meter Reading (Required)'] = pd.to_numeric(df['Meter Reading (Required)'], errors='coerce')

        # Identify rows with missing or zero values
        missing_condition = df['Meter Reading (Required)'].isna()

        if consider_zero:
            missing_condition |= (df['Meter Reading (Required)'] == 0)

        if remove:
            # Drop rows where 'Meter Reading (Required)' is NaN or 0
            return df[~missing_condition]
        else:
            # Return rows where 'Meter Reading (Required)' is NaN or 0
            return df[missing_condition]

    def initiate_download(self):
        if self.target in ['observed', 'missing']:
            self.df_type = ['Raw Data']
        for df_type in self.df_type:
            if df_type == 'Raw Data':
                set_df = self.raw_df.copy()
                url_key = 'media_url'
            else:
                set_df = self.iv_df.copy()
                url_key = 'file_path'
            for _, row in set_df.iterrows():
                if self.meter and self.meter != row['meter_type']:
                    continue
                url = row[url_key]
                print(url)
                df = download_excel(url)
                if df_type == 'Raw Data':
                    df[self.meter_key] = row['meter_type']
                    self.combined_raw_df = pd.concat([self.combined_raw_df, df], ignore_index=True)
                else:
                    df[self.iv_key] = row['name']
                    self.combined_iv_df = pd.concat([self.combined_iv_df, df], ignore_index=True)
        self.raw_df = self.combined_raw_df.copy()
        self.iv_df = self.combined_iv_df.copy()

    def process_observed_data(self):
        self.process_raw_data()
        self.process_temperature()
        if not self.meter or self.meter == 102:
            self.raw_data_mapping['TEMPERATURE'] = self.temperature_df
        for meter_type, df in self.raw_data_mapping.items():
            filtered_df = self.missing_data_detection(df)
            filtered_df = self.outlier_detection(filtered_df)
            meter_id = self.reverse_meter_type_map.get(meter_type)
            if self.meter and self.meter == meter_id:
                self.data_exploration_summary_response = filtered_df
            if filtered_df.shape[0]:
                data_to_append = {
                    "meter_type": self.reverse_meter_type_map.get(meter_type),
                    "meter_name": meter_type,
                    "time_stamp_end": filtered_df['Start Date (Required)'].max(),
                    "time_stamp_start": filtered_df['Start Date (Required)'].min(),
                    "total_records": filtered_df.shape[0],
                }
                self.data_exploration_response.append(data_to_append)
        return

    def process_missing_data(self):
        self.process_raw_data()
        self.process_temperature()
        if not self.meter or self.meter == 102:
            self.raw_data_mapping['TEMPERATURE'] = self.temperature_df
        for meter_type, df in self.raw_data_mapping.items():
            filtered_df = self.missing_data_detection(df, remove=False, consider_zero=True)
            meter_id = self.reverse_meter_type_map.get(meter_type)
            if self.meter and self.meter == meter_id:
                self.data_exploration_summary_response = filtered_df
                return self.data_exploration_summary_response
            if filtered_df.shape[0]:
                data_to_append = {
                    "meter_type": meter_id,
                    "meter_name": meter_type,
                    "time_stamp_end": filtered_df['Start Date (Required)'].max(),
                    "time_stamp_start": filtered_df['Start Date (Required)'].min(),
                    "total_records": filtered_df.shape[0],
                }
                self.data_exploration_response.append(data_to_append)
        return self.data_exploration_response

    def outlier_batch_processing(self, meter_type, df):
        filtered_df = self.missing_data_detection(df)
        filtered_df, upper_df, lower_df, HIGHER, LOWER = self.outlier_detection(filtered_df, remove=False)
        if self.meter and self.meter == self.reverse_meter_type_map.get(meter_type):
            if self.bound == "UPPER":
                self.data_exploration_summary_response = upper_df
            else:
                self.data_exploration_summary_response = lower_df
            return
        if filtered_df.shape[0]:
            for threshold in ["HIGHER", "LOWER"]:
                if threshold == "HIGHER":
                    threshold_value = HIGHER
                    total_records = upper_df.shape[0]
                else:
                    threshold_value = LOWER
                    total_records = lower_df.shape[0]
                data_to_append = {
                    "meter_type": self.reverse_meter_type_map.get(meter_type),
                    "meter_name": meter_type,
                    "time_stamp_end": filtered_df['Start Date (Required)'].max(),
                    "time_stamp_start": filtered_df['Start Date (Required)'].min(),
                    "total_records": total_records,
                    "threshold": "{:.2f}".format(threshold_value),
                    "threshold_type": threshold,
                    "type": "Local"
                }
                self.data_exploration_response.append(data_to_append)
        return

    def process_outliers(self):
        self.process_raw_data()
        self.process_temperature()

        # ToDo Need to have a condition here
        self.raw_data_mapping['TEMPERATURE'] = self.temperature_df
        for meter_type, df in self.raw_data_mapping.items():
            self.outlier_batch_processing(meter_type, df)

    def process(self):
        self.initiate_download()
        if self.target == 'missing_data':
            return self.process_missing_data()
        elif self.target == 'outliers':
            return self.process_outliers()
        else:
            return self.process_observed_data()


class OutlierSettings(DataExploration):
    def __init__(self, facility_id):
        super().__init__(facility_id, None, None, None)
        self.iv_df = dbtest(self.iv_data_query)
        self.factor = METER_FACTOR
        self.df_type = ['Raw Data', 'Independent Variable']

    def outlier_detection(self, df):
        desc = df.describe()
        Q1 = desc.loc['25%', 'Meter Reading (Required)']
        Q3 = desc.loc['75%', 'Meter Reading (Required)']
        IQR = Q3 - Q1
        FACTOR = self.factor
        LOWER = Q1 - FACTOR * IQR
        HIGHER = Q3 + FACTOR * IQR
        data = {
            "first_quartile": "{:.2f}".format(Q1),
            "third_quartile": "{:.2f}".format(Q3),
            "inter_quartile": "{:.2f}".format(IQR),
            "lower_limit": "{:.2f}".format(LOWER),
            "upper_limit": "{:.2f}".format(HIGHER)
        }

        return data

    def outlier_batch_processing(self, meter_type, df, iv=False):
        self.factor = IV_FACTOR
        filtered_df = self.missing_data_detection(df)
        response = self.outlier_detection(filtered_df)
        response['meter_name'] = meter_type if not iv else "Independent Variable"
        response['meter_type'] = self.reverse_meter_type_map.get(meter_type, random.randint(1000, 10000))
        self.data_exploration_response.append(response)

    def process_outliers(self):
        self.process_raw_data()
        self.process_temperature()
        self.process_iv()

        # ToDo Need to have a condition here
        self.raw_data_mapping['TEMPERATURE'] = self.temperature_df
        for meter_type, df in self.raw_data_mapping.items():
            self.outlier_batch_processing(meter_type, df)
        for meter_type, df in self.iv_data_mapping.items():
            self.outlier_batch_processing(meter_type, df, iv=True)
            break

    def process(self):
        self.initiate_download()
        self.process_outliers()
