import io
from datetime import datetime

import pandas as pd
from openpyxl.reader.excel import load_workbook

from dbconnection import dbtest, db_execute_single
from sql_queries.file_uploader import insert_query_facility_meter_hourly_entries, insert_query_facility_iv_files_table
from utils import generate_blob_name, save_file_to_blob


class BaseDataUploader:
    def get_meter_dates(self):
        query = f"SELECT meter_active, meter_inactive FROM epp.facility_meter_detail WHERE id = {self.meter_id}"
        df = dbtest(query)
        if df.empty:
            raise ValueError(f"No meter details found for meter_id {self.meter_id}")
        meter_active, meter_inactive = df.iloc[0]['meter_active'], df.iloc[0]['meter_inactive']
        return meter_active, meter_inactive

    def __init__(self, file, facility_id, meter_id, iv, created_by=None, meter_serial_no=None):
        self.facility_id = facility_id
        self.iv = iv
        self.excel_file = file
        self.meter_id = meter_id
        self.created_by = created_by
        self.meter_serial_no = meter_serial_no
        self.meter_active, self.meter_inactive = self.get_meter_dates()


class Validators:
    """
    This will have the validation below:
    1: Start Date (Required) cannot be greater than End Date (Required)
    2: Difference between Start Date (Required) and End Date (Required) cannot be more than 60 minutes
    3: There should be no overlapping of the dates.
    4: Should Have Required Columns
    """

    def __init__(self, data_frame, meter_active, meter_inactive):
        self.df = data_frame
        self.meter_active = meter_active
        self.meter_inactive = meter_inactive
        self.required_columns = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']

    def validate_and_read_excel_sheets(self, excel_file):
        try:
            excel_io = io.BytesIO(excel_file.read())
            wb = load_workbook(excel_io, read_only=True)
            visible_sheets = [sheet.title for sheet in wb.worksheets if sheet.sheet_state == 'visible']
            excel_io.seek(0)
            with pd.ExcelFile(excel_io) as xls:
                all_sheets = {}
                for sheet_name in visible_sheets:
                    dataframe = pd.read_excel(xls, sheet_name)
                    dataframe.dropna(how='all', inplace=True)
                    # Convert 'Start Date (Required)' to datetime, setting invalid values to NaN
                    dataframe['Start Date (Required)'] = pd.to_datetime(dataframe['Start Date (Required)'],
                                                                        errors='coerce')

                    # Convert 'End Date (Required)' to datetime, setting invalid values to NaN
                    dataframe['End Date (Required)'] = pd.to_datetime(dataframe['End Date (Required)'], errors='coerce')

                    all_sheets[sheet_name] = dataframe

                # all_sheets = {sheet_name: pd.read_excel(xls, sheet_name) for sheet_name in visible_sheets}
        except Exception as e:
            raise ValueError(f"Error reading Excel file: {str(e)}")

        if not all_sheets:
            raise ValueError("The Excel file appears to be empty or unreadable.")

        valid_sheets = []
        invalid_sheets = []
        merged_df = pd.DataFrame()
        for sheet_name, df in all_sheets.items():

            if isinstance(df, pd.DataFrame) and not df.empty and all(
                    column in df.columns for column in self.required_columns):
                valid_sheets.append(sheet_name)
                df_filtered = df[self.required_columns]
                merged_df = pd.concat([merged_df, df_filtered], ignore_index=True)
            else:
                invalid_sheets.append(sheet_name)
        if invalid_sheets:
            raise ValueError("Invalid Sheet(s):{}".format(','.join(invalid_sheets)))
        if merged_df.empty:
            raise ValueError("No valid data found in the Excel file.")



        self.df = merged_df

    def validate_no_overlapping_dates(self, iv, meter_id):
        min_start = self.df['Start Date (Required)'].min()
        max_end = self.df['End Date (Required)'].max()
        if iv:
            query = f"""
                SELECT start_date, end_date 
                FROM epp.meter_hourly_entries 
                WHERE start_date <= '{max_end}' AND end_date >= '{min_start}' AND independent_variable_id = {meter_id}
                """
        else:
            query = f"""
                SELECT start_date, end_date 
                FROM epp.meter_hourly_entries 
                WHERE start_date <= '{max_end}' AND end_date >= '{min_start}' AND meter_id = {meter_id}
                """
        df = dbtest(query)
        if not df.empty:
            raise ValueError("Excel file contains entries that overlap with existing database records.")

    def validate_required_columns(self):
        missing_columns = [col for col in self.required_columns if col not in self.df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")

    def validate_start_end_dates(self):
        if (self.df['Start Date (Required)'] > self.df['End Date (Required)']).any():
            raise ValueError("There are rows where the Start Date is greater than the End Date.")

    def validate_time_difference(self):
        time_difference = (self.df['End Date (Required)'] - self.df['Start Date (Required)']).dt.total_seconds() / 60
        if (time_difference > 60).any():
            raise ValueError(
                "Some rows have a time difference between Start Date and End Date greater than 60 minutes.")

    def validate_data_within_meter_active_range(self):
        current_date = datetime.now().replace(minute=0, second=0, microsecond=0)
        max_date = min(self.meter_inactive, current_date) if self.meter_inactive else current_date
        invalid_dates = self.df[
            (self.df['Start Date (Required)'] < self.meter_active) |
            (self.df['End Date (Required)'] > max_date)
            ]

        if not invalid_dates.empty:
            raise ValueError(
                f"Excel contains {len(invalid_dates)} entries outside the allowed date range. "
                f"Allowed range: {self.meter_active.strftime('%Y-%m-%d %H:%M')} to {max_date.strftime('%Y-%m-%d %H:%M')}."
            )


class MeterDataUploader(BaseDataUploader):
    def __init__(self, file, facility_id, meter_id, iv, created_by=None, meter_serial_no=None):
        super().__init__(file, facility_id, meter_id, iv, created_by, meter_serial_no)

    def create_file_record_in_table(self, file_path):
        values = [self.facility_id, self.meter_id, self.meter_serial_no, self.created_by, file_path]
        return db_execute_single(insert_query_facility_meter_hourly_entries, values)

    def process(self):
        try:
            validator = Validators(self.excel_file, self.meter_active, self.meter_inactive)
            validator.validate_and_read_excel_sheets(self.excel_file)
            validator.validate_time_difference()
            validator.validate_required_columns()
            validator.validate_start_end_dates()
            validator.validate_no_overlapping_dates(self.iv, self.meter_id)
            validator.validate_data_within_meter_active_range()
            excel_data = io.BytesIO()
            validator.df.to_excel(excel_data, index=False, engine='openpyxl')  # Convert DataFrame to Excel format
            excel_data.seek(0)  # Move pointer to the beginning of the buffer

            blob_name = generate_blob_name()
            file_path = save_file_to_blob(blob_name, excel_data)
            record_id = self.create_file_record_in_table(file_path)
            return {
                "success": True,
                "message": "File Uploaded Successfully",
                "path": file_path,
                "record_id": record_id
            }
        except Exception as error:
            return {'success': False, 'error': f"{error}"}


class MeterDataUploaderIV(MeterDataUploader):
    def __init__(self, file, facility_id, meter_id, iv, created_by=None, meter_serial_no=None):
        super().__init__(file, facility_id, meter_id, iv, created_by, meter_serial_no)

    def create_file_record_in_table(self, file_path):
        values = [self.meter_id, file_path]
        return db_execute_single(insert_query_facility_iv_files_table, values)

    def process(self):
        try:
            validator = Validators(self.excel_file, self.meter_active, self.meter_inactive)
            validator.validate_and_read_excel_sheets(self.excel_file)
            # validator.validate_time_difference()
            validator.validate_required_columns()
            # validator.validate_start_end_dates()
            validator.validate_no_overlapping_dates(self.iv, self.meter_id)
            validator.validate_data_within_meter_active_range()
            excel_data = io.BytesIO()
            validator.df.to_excel(excel_data, index=False, engine='openpyxl')  # Convert DataFrame to Excel format
            excel_data.seek(0)  # Move pointer to the beginning of the buffer

            blob_name = generate_blob_name()
            file_path = save_file_to_blob(blob_name, excel_data)
            record_id = self.create_file_record_in_table(file_path)
            return {
                "success": True,
                "message": "File Uploaded Successfully",
                "path": file_path,
                "record_id": record_id
            }
        except Exception as error:
            return {'success': False, 'error': f"{error}"}

