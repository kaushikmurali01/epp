from datetime import datetime
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
from openpyxl import load_workbook
import io
from dbconnection import db_execute_single, dbtest
from sql_queries.file_uploader import insert_query_facility_meter_hourly_entries, insert_query_facility_iv_files_table
from utils import generate_blob_name, save_file_to_blob


class BaseDataUploader:
    def __init__(self, file, facility_id, meter_id, iv, created_by=None, meter_serial_no=None):
        self.facility_id = facility_id
        self.iv = iv
        self.excel_file = file
        self.meter_id = meter_id
        self.created_by = created_by
        self.meter_serial_no = meter_serial_no
        self.required_columns = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']

    def get_meter_dates(self):
        query = f"SELECT meter_active, meter_inactive FROM epp.facility_meter_detail WHERE id = {self.meter_id}"
        df = dbtest(query)
        if df.empty:
            raise ValueError(f"No meter details found for meter_id {self.meter_id}")
        self.meter_active, self.meter_inactive = df.iloc[0]['meter_active'], df.iloc[0]['meter_inactive']

    def validate_date_range(self):
        self.get_meter_dates()
        current_date = datetime.now().replace(minute=0, second=0, microsecond=0)
        max_date = min(self.meter_inactive, current_date) if self.meter_inactive else current_date

        # Ensure dates are parsed before comparison
        self.merged_df['Start Date (Required)'] = pd.to_datetime(self.merged_df['Start Date (Required)'],
                                                                 errors='coerce')
        self.merged_df['End Date (Required)'] = pd.to_datetime(self.merged_df['End Date (Required)'], errors='coerce')

        invalid_dates = self.merged_df[
            (self.merged_df['Start Date (Required)'] < self.meter_active) |
            (self.merged_df['End Date (Required)'] > max_date)
            ]

        if not invalid_dates.empty:
            raise ValueError(
                f"Excel contains {len(invalid_dates)} entries outside the allowed date range. "
                f"Allowed range: {self.meter_active.strftime('%Y-%m-%d %H:%M')} to {max_date.strftime('%Y-%m-%d %H:%M')}. "
                f"Consider reviewing these entries."
            )

    def validate_and_read_excel_sheets(self):
        try:
            excel_io = io.BytesIO(self.excel_file.read())
            wb = load_workbook(excel_io, read_only=True)
            data_frames = []
            for sheet in wb:
                data = pd.DataFrame(sheet.iter_rows(values_only=True))
                headers = data.iloc[0]  # Assuming first row is headers
                data = data[1:]  # Skip headers
                data.columns = headers
                data = data[[col for col in self.required_columns if col in data.columns]]
                data['Start Date (Required)'] = pd.to_datetime(data['Start Date (Required)'])
                data['End Date (Required)'] = pd.to_datetime(data['End Date (Required)'])
                data_frames.append(data)
            self.merged_df = pd.concat(data_frames, ignore_index=True)
        except Exception as e:
            raise ValueError(f"Error processing Excel sheets: {e}")


    def validate_data(self):
        self.get_meter_dates()
        current_date = datetime.now().replace(minute=0, second=0, microsecond=0)
        max_date = min(self.meter_inactive, current_date) if self.meter_inactive else current_date
        meter_active_start = datetime.combine(self.meter_active, datetime.min.time())

        # Validate date ranges
        invalid_dates = self.merged_df[(self.merged_df['Start Date (Required)'] < meter_active_start) |
                                       (self.merged_df['End Date (Required)'] > max_date)]
        if not invalid_dates.empty:
            raise ValueError("Some entries are outside the allowed date range.")

        # Check for duplicates
        if self.merged_df.duplicated(subset=['Start Date (Required)', 'End Date (Required)']).any():
            raise ValueError("Duplicate entries found.")

    def process(self):
        try:
            self.validate_and_read_excel_sheets()
            self.validate_data()
            # Perform additional processing such as database inserts here
            # Example: db_execute_single(SQL_query, data_to_insert)
            blob_name = generate_blob_name()
            file_path = save_file_to_blob(blob_name, io.BytesIO(self.excel_file.read()))
            return {"success": True, "message": "File processed and uploaded successfully", "path": file_path}
        except Exception as e:
            return {"success": False, "message": str(e)}


# If using MeterDataUploader or MeterDataUploaderIV, define them similarly with any specific validations
class MeterDataUploader(BaseDataUploader):
    def __init__(self, file, facility_id, meter_id, iv, created_by=None, meter_serial_no=None):
        super().__init__(file, facility_id, meter_id, iv, created_by, meter_serial_no)

    def create_file_record_in_table(self, file_path):
        # Define the values to be inserted based on the class requirements
        values = [self.facility_id, self.meter_id, self.meter_serial_no, self.created_by, file_path]
        # Execute the database insertion
        return db_execute_single(insert_query_facility_meter_hourly_entries, values)

    def process(self):
        try:
            self.validate_and_read_excel_sheets()
            self.validate_data()
            # Additional logic before saving to database
            file_path = self.upload_file_and_save_record()
            return {"success": True, "message": "File uploaded and processed successfully", "path": file_path}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def upload_file_and_save_record(self):
        # Simulating the process of saving the file and creating a record
        blob_name = generate_blob_name()
        file_path = save_file_to_blob(blob_name, io.BytesIO(self.excel_file.read()))
        self.create_file_record_in_table(file_path)
        return file_path


class MeterDataUploaderIV(BaseDataUploader):
    def create_file_record_in_table(self, file_path):
        # Specific database insertion logic for IV-related data
        values = [self.meter_id, file_path]
        return db_execute_single(insert_query_facility_iv_files_table, values)

    def process(self):
        try:
            self.validate_and_read_excel_sheets()
            self.validate_date_range()  # Use the overridden validation method
            # Additional logic before saving to database
            file_path = self.upload_file_and_save_record()
            return {"success": True, "message": "IV data file uploaded and processed successfully", "path": file_path}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def upload_file_and_save_record(self):
        # Handles uploading the file to blob storage and creating a database record
        blob_name = generate_blob_name()
        file_path = save_file_to_blob(blob_name, io.BytesIO(self.excel_file.read()))
        self.create_file_record_in_table(file_path)
        return file_path
