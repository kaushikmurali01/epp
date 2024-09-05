import numpy as np
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
from dbconnection import dbtest, execute_query, \
    optimized_bulk_insert_df
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

    def add_update_workflow(self):
        if self.iv:
            query = "UPDATE epp.workflow SET weather_iv= true WHERE facility_id={}".format(self.facility_id)
        else:
            query = "UPDATE epp.workflow SET ew= true WHERE facility_id={}".format(self.facility_id)
        execute_query(query)

    @staticmethod
    def is_float_or_int(val):
        return isinstance(val, (float, int))

    def prepare_data_for_insertion(self, df):
        # Display the updated DataFrame with the new columns
        df.rename(columns={'Start Date (Required)': 'start_date', 'End Date (Required)': 'end_date',
                           'Meter Reading (Required)': 'reading'}, inplace=True)
        df['start_date_og'] = df['start_date']
        df['end_date_og'] = df['end_date']
        df['reading_og'] = df['reading']
        df['reading'] = pd.to_numeric(df['reading'], errors='coerce')

        # df['reading'] = df['reading'].astype(int, errors='coerce')
        # Convert dates and handle potential invalid datetime formats gracefully
        df['start_date'] = pd.to_datetime(df['start_date'], errors='coerce')
        df['end_date'] = pd.to_datetime(df['end_date'], errors='coerce')

        df['start_year'] = df['start_date'].dt.year
        df['start_month'] = df['start_date'].dt.month
        df['end_year'] = df['end_date'].dt.year
        df['end_month'] = df['end_date'].dt.month

        int_columns = ['start_year', 'start_month', 'end_year', 'end_month']
        for col in int_columns:
            df[col] = df[col].fillna(-1).astype(int)

        # Mark missing or zero readings
        if self.iv:
            df['missing'] = (
                    df[['start_date', 'end_date']].isna().any(axis=1) |
                    df['reading'].isna()
            )
        else:
            df['missing'] = (
                    df[['start_date', 'end_date']].isna().any(axis=1) |
                    df['reading'].isna() |
                    (df['reading'] == 0)
            )

        # Filter to get only clean data
        clean_data = df[~df['missing']].copy()
        # Calculate Q1 and Q3 for 'Meter Reading (Required)' on clean data
        Q1 = clean_data['reading'].quantile(0.25)
        Q3 = clean_data['reading'].quantile(0.75)
        IQR = Q3 - Q1

        # Define outliers
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR

        # Add 'Outliers' column on clean data based on outlier definition
        clean_data['outliers'] = (
                (clean_data['reading'] < lower_bound) |
                (clean_data['reading'] > upper_bound)
        )
        # # Convert year and month columns to integers
        for col in ['start_year', 'start_month', 'end_year', 'end_month']:
            clean_data[col] = clean_data[col].astype(int)

        for col in ['start_date_og', 'end_date_og', 'reading_og']:
            clean_data[col] = clean_data[col].astype(str)
        # Merge back the 'Outliers' flags to the original DataFrame
        df = df.join(clean_data['outliers'], how='left')
        df['outliers'].fillna(False, inplace=True)  # Assume non-clean data has no outliers

        df['start_date'] = df['start_date'].astype(object).where(df['start_date'].notnull(), None)
        df['end_date'] = df['end_date'].astype(object).where(df['end_date'].notnull(), None)

        return df

    def process_file(self, row):
        try:
            print("File Process Started")
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
            df = df.dropna(how='all')
            df = self.prepare_data_for_insertion(df)
            df['meter_id'] = meter_detail_id
            df['meter_type'] = meter_type
            df['is_independent_variable'] = self.iv
            df['purchased_from_grid'] = purchased_from_grid
            df['meter_name'] = meter_name
            df['facility_id'] = self.facility_id
            df['independent_variable_id'] = iv_id if self.iv else None
            df['reading'] = df['reading'].apply(lambda x: float(x) if self.is_float_or_int(x) else np.nan)
            required_columns = ['start_date', 'end_date', 'reading', 'start_date_og', 'end_date_og', 'reading_og',
                                'outliers', 'missing',
                                'meter_id', 'meter_type', 'is_independent_variable',
                                'purchased_from_grid', 'meter_name', 'facility_id',
                                'independent_variable_id', 'start_year', 'start_month', 'end_year',
                                'end_month']
            df = df[required_columns]
            print("File Process End")
            print("DB Insert Started:{}".format(self.iv))
            optimized_bulk_insert_df(
                df,
                'meter_hourly_entries',
                record_id,
                'independent_variable_file' if self.iv else 'facility_meter_hourly_entries'
            )
            # bulk_insert_df(df, 'epp.meter_hourly_entries', record_id,
            #                'epp.independent_variable_file' if self.iv else 'epp.facility_meter_hourly_entries')
            print("DB Insert End")
            return f"Successfully processed record ID: {record_id}"
        except Exception as e:
            raise
            return f"Failed to process record ID: {record_id}. Error: {str(e)}"

    def process_files(self):
        with ThreadPoolExecutor(max_workers=500) as executor:  # Adjust max_workers as needed
            futures = [executor.submit(self.process_file, row) for _, row in self.raw_df.iterrows()]

            for future in as_completed(futures):
                print(future.result())

    def process(self):
        self.process_files()
        self.add_update_workflow()

#
# import numpy as np
# import pandas as pd
# from concurrent.futures import ThreadPoolExecutor, as_completed
# from dbconnection import dbtest, bulk_insert_df, refresh_materialised_view, update_workflow
# from openpyxl import load_workbook
# import io
# import requests
# from sql_queries.file_uploader import meter_file_processing_query, iv_file_processing_query
#
#
# def download_excel(url):
#     response = requests.get(url)
#     response.raise_for_status()  # Raise an exception for bad status codes
#     return response.content
#
#
# class AddMeterData:
#     def __init__(self, facility_id, record_id, iv=False):
#         self.record_id = record_id
#         self.iv = iv
#         self.facility_id = facility_id
#         self.raw_data_query = meter_file_processing_query.format(self.facility_id, self.record_id)
#         self.iv_data_query = iv_file_processing_query.format(self.facility_id, self.record_id)
#         self.raw_df = dbtest(self.raw_data_query) if not self.iv else dbtest(self.iv_data_query)
#
#     @staticmethod
#     def is_float_or_int(val):
#         return isinstance(val, (float, int))
#
#     @staticmethod
#     def prepare_data_for_insertion(df):
#         # Rename columns for consistency
#         df.rename(columns={
#             'Start Date (Required)': 'start_date',
#             'End Date (Required)': 'end_date',
#             'Meter Reading (Required)': 'reading'
#         }, inplace=True)
#
#         # Handle dates and reading for potential format issues
#         df['start_date'] = pd.to_datetime(df['start_date'], errors='coerce')
#         df['end_date'] = pd.to_datetime(df['end_date'], errors='coerce')
#         df['reading'] = pd.to_numeric(df['reading'], errors='coerce')
#
#         # Mark missing or zero readings
#         df['missing'] = df[['start_date', 'end_date', 'reading']].isna().any(axis=1) | (df['reading'] == 0)
#
#         # Handling clean data separately for outlier analysis
#         clean_data = df.dropna(subset=['start_date', 'end_date', 'reading'])
#         clean_data = clean_data[clean_data['reading'] != 0]
#
#         # Calculate Q1, Q3 and IQR for 'reading'
#         Q1 = clean_data['reading'].quantile(0.25)
#         Q3 = clean_data['reading'].quantile(0.75)
#         IQR = Q3 - Q1
#
#         # Define outliers
#         lower_bound = Q1 - 1.5 * IQR
#         upper_bound = Q3 + 1.5 * IQR
#         clean_data['outliers'] = (clean_data['reading'] < lower_bound) | (clean_data['reading'] > upper_bound)
#
#         # Merge back the 'Outliers' flags to the original DataFrame
#         df = df.join(clean_data['outliers'], how='left')
#         df['outliers'].fillna(False, inplace=True)  # Assume non-clean data has no outliers
#         # Explicitly convert NaT to None for database compatibility
#         # df['start_date'] = df['start_date'].apply(lambda x: None if pd.isna(x) else x)
#         # df['end_date'] = df['end_date'].apply(lambda x: None if pd.isna(x) else x)
#         df['start_date'] = df['start_date'].astype(object).where(df['start_date'].notnull(), None)
#         df['end_date'] = df['end_date'].astype(object).where(df['end_date'].notnull(), None)
#
#         return df
#
#     def process_file(self, row):
#         try:
#             # Data handling and URL fetching logic remains
#             excel_data = download_excel(row['media_url'])
#             excel_io = io.BytesIO(excel_data)
#             wb = load_workbook(excel_io, read_only=True)
#             visible_sheets = [sheet.title for sheet in wb.worksheets if sheet.sheet_state == 'visible']
#             excel_io.seek(0)
#
#             # Loading visible sheets directly to DataFrame list
#             with pd.ExcelFile(excel_io) as xls:
#                 df_list = [pd.read_excel(xls, sheet_name) for sheet_name in visible_sheets if
#                            sheet_name in xls.sheet_names]
#
#             if not df_list:
#                 raise ValueError("No visible sheets found in the Excel file.")
#
#             df = pd.concat(df_list, ignore_index=True).dropna(how='all')
#             df = self.prepare_data_for_insertion(df)
#             bulk_insert_df(df, 'epp.meter_hourly_entries', self.record_id,
#                            'epp.independent_variable_file' if self.iv else 'epp.facility_meter_hourly_entries')
#
#             return f"Successfully processed record ID: {self.record_id}"
#         except Exception as e:
#             return f"Failed to process record ID: {self.record_id}. Error: {str(e)}"
#
#     def process_files(self):
#         with ThreadPoolExecutor(max_workers=10) as executor:
#             futures = [executor.submit(self.process_file, row) for _, row in self.raw_df.iterrows()]
#             results = [future.result() for future in as_completed(futures)]
#             print("\n".join(results))
#
#     def process(self):
#         self.process_files()
