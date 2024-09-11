import concurrent.futures
import io
from datetime import datetime
import pandas as pd
import openpyxl
from dbconnection import dbtest, db_execute_single
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
        self.meter_active, self.meter_inactive = self.get_meter_dates()

    def get_meter_dates(self):
        query = f"SELECT meter_active, meter_inactive FROM epp.facility_meter_detail WHERE id = {self.meter_id}"
        df = dbtest(query)
        if df.empty:
            raise ValueError(f"No meter details found for meter_id {self.meter_id}")
        return df.iloc[0]['meter_active'], df.iloc[0]['meter_inactive']


class Validators:
    def __init__(self, meter_active, meter_inactive,iv):
        self.iv = iv
        self.meter_active = meter_active
        self.meter_inactive = meter_inactive
        self.required_columns = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']

    def validate_chunk(self, chunk, iv, meter_id):
        self.validate_required_columns(chunk)
        self.validate_start_end_dates(chunk)
        self.validate_no_overlapping_dates(iv, meter_id, chunk)
        if not self.iv:
            self.validate_data_within_meter_active_range(chunk)
            minutes = 60
        else:
            minutes = 24*60

        self.validate_time_difference(chunk,minutes=minutes)

    def validate_no_overlapping_dates(self, iv, meter_id, data_chunk):
        min_start = data_chunk['Start Date (Required)'].min()
        max_end = data_chunk['End Date (Required)'].max()
        query = f"""
            SELECT 1 FROM epp.meter_hourly_entries 
            WHERE start_date <= '{max_end}' AND end_date >= '{min_start}' 
            AND {'independent_variable_id' if iv else 'meter_id'} = {meter_id}
            LIMIT 1
            """
        df = dbtest(query)
        if not df.empty:
            raise ValueError("Excel file contains entries that overlap with existing database records.")

    def validate_required_columns(self, data_chunk):
        missing_columns = set(self.required_columns) - set(data_chunk.columns)
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")

    def validate_start_end_dates(self, data_chunk):
        if (data_chunk['Start Date (Required)'] > data_chunk['End Date (Required)']).any():
            raise ValueError("There are rows where the Start Date is greater than the End Date.")

    @staticmethod
    def validate_time_difference(data_chunk, minutes=60):
        time_difference = (data_chunk['End Date (Required)'] - data_chunk[
            'Start Date (Required)']).dt.total_seconds() / minutes
        if (time_difference > 60).any():
            raise ValueError(
                "Some rows have a time difference between Start Date and End Date greater than 60 minutes.")

    def validate_data_within_meter_active_range(self, data_chunk):
        current_date = datetime.now().replace(minute=0, second=0, microsecond=0)
        max_date = min(self.meter_inactive, current_date) if self.meter_inactive else current_date
        if not self.meter_active:
            return
        invalid_dates = data_chunk[
            (data_chunk['Start Date (Required)'] < self.meter_active) |
            (data_chunk['End Date (Required)'] > max_date)
            ]
        if not invalid_dates.empty:
            raise ValueError(
                f"Excel contains {len(invalid_dates)} entries outside the allowed date range. "
                f"Allowed range: {self.meter_active.strftime('%Y-%m-%d %H:%M')} to {max_date.strftime('%Y-%m-%d %H:%M')}."
            )


def read_excel_sheets(file):
    required_columns = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']
    excel_io = io.BytesIO(file.read())
    wb = openpyxl.load_workbook(excel_io, read_only=True)
    sheets_data = []
    invalid_sheets = []
    missing_columns = False  # Flag to indicate if any sheets are missing required columns

    for sheet in wb.worksheets:
        if sheet.sheet_state != 'visible':
            continue

        rows = list(sheet.iter_rows(values_only=True))
        if not rows:
            continue  # Skip empty sheets

        header = rows[0]
        if not all(col in header for col in required_columns):
            # Log or handle missing required columns
            print(f"Warning: Sheet '{sheet.title}' is missing required columns and will be skipped.")
            missing_columns = True
            invalid_sheets.append(sheet.title)
            continue
        if not invalid_sheets:
            data = rows[1:]
            sheets_data.append((header, data))

    wb.close()
    if missing_columns:
        raise ValueError("Required Columns are missing in Sheet(s):{}".format(','.join(invalid_sheets)))
        # print("Some sheets were skipped due to missing required columns.")

    return sheets_data


def process_chunk(chunk_data, header, validator, iv, meter_id):
    df = pd.DataFrame(chunk_data, columns=header)
    df['Start Date (Required)'] = pd.to_datetime(df['Start Date (Required)'], errors='coerce')
    df['End Date (Required)'] = pd.to_datetime(df['End Date (Required)'], errors='coerce')
    validator.validate_chunk(df, iv, meter_id)


class DataUploader(BaseDataUploader):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.validator = Validators(self.meter_active, self.meter_inactive,self.iv)

    def create_file_record_in_table(self, file_path):
        insert_query = insert_query_facility_iv_files_table if self.iv else insert_query_facility_meter_hourly_entries
        values = [self.meter_id, file_path] if self.iv else [self.facility_id, self.meter_id, self.meter_serial_no,
                                                             self.created_by, file_path]
        return db_execute_single(insert_query, values)

    def process(self):
        try:
            sheets_data = read_excel_sheets(self.excel_file)
            with concurrent.futures.ThreadPoolExecutor() as executor:
                futures = []
                chunk_set = 10000
                for header, data in sheets_data:
                    for i in range(0, len(data), chunk_set):
                        chunk = data[i:i + chunk_set]
                        futures.append(
                            executor.submit(process_chunk, chunk, header, self.validator, self.iv, self.meter_id))

                concurrent.futures.wait(futures)
                for future in futures:
                    future.result()  # This will raise any exceptions that occurred during processing

            blob_name = generate_blob_name()
            file_path = save_file_to_blob(blob_name, self.excel_file)
            record_id = self.create_file_record_in_table(file_path)
            return {
                "success": True,
                "message": "File Uploaded Successfully",
                "path": file_path,
                "record_id": record_id
            }
        except Exception as error:
            raise
            return {
                "success": False,
                "error": str(error)
            }