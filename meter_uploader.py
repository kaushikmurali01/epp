import concurrent.futures
import io
from datetime import datetime

import openpyxl
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
        return df.iloc[0]['meter_active'], df.iloc[0]['meter_inactive']

    def __init__(self, file, facility_id, meter_id, iv, created_by=None, meter_serial_no=None):
        self.facility_id = facility_id
        self.iv = iv
        self.excel_file = file
        self.meter_id = meter_id
        self.created_by = created_by
        self.meter_serial_no = meter_serial_no
        self.meter_active, self.meter_inactive = self.get_meter_dates()


class Validators:
    def __init__(self, data_frame, meter_active, meter_inactive):
        self.df = data_frame
        self.meter_active = meter_active
        self.meter_inactive = meter_inactive
        self.required_columns = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']
        self.excel_io = None

    def validate_chunk(self, chunk, iv, meter_id):
        return {
            "time_diff": self.validate_time_difference(data_chunk=chunk),
            "required_cols": self.validate_required_columns(data_chunk=chunk),
            "start_end_dates": self.validate_start_end_dates(data_chunk=chunk),
            "no_overlap": self.validate_no_overlapping_dates(iv, meter_id, data_chunk=chunk),
            "active_range": self.validate_data_within_meter_active_range(data_chunk=chunk)
        }

    def validate_and_read_excel_sheets(self, excel_file, chunk_size=10000):
        excel_io = io.BytesIO(excel_file.read())
        wb = openpyxl.load_workbook(excel_io, read_only=True)
        visible_sheets = [sheet.title for sheet in wb.worksheets if sheet.sheet_state == 'visible']
        for sheet_name in visible_sheets:
            sheet = wb[sheet_name]
            rows = sheet.iter_rows(values_only=True)
            header = next(rows)
            chunk = []
            for row in rows:
                chunk.append(row)
                if len(chunk) == chunk_size:
                    df = pd.DataFrame(chunk, columns=header)
                    df = df[self.required_columns]
                    df['Start Date (Required)'] = pd.to_datetime(df['Start Date (Required)'], errors='coerce')
                    df['End Date (Required)'] = pd.to_datetime(df['End Date (Required)'], errors='coerce')
                    yield df
                    chunk = []
            if chunk:
                df = pd.DataFrame(chunk, columns=header)
                df = df[self.required_columns]
                df['Start Date (Required)'] = pd.to_datetime(df['Start Date (Required)'], errors='coerce')
                df['End Date (Required)'] = pd.to_datetime(df['End Date (Required)'], errors='coerce')
                yield df
        wb.close()
        # excel_io.close()
        self.excel_io = excel_io

    def validate_no_overlapping_dates(self, iv, meter_id, data_chunk=None):
        min_start = data_chunk['Start Date (Required)'].min()
        max_end = data_chunk['End Date (Required)'].max()
        query = f"""
            SELECT start_date, end_date 
            FROM epp.meter_hourly_entries 
            WHERE start_date <= '{max_end}' AND end_date >= '{min_start}' AND {'independent_variable_id' if iv else 'meter_id'} = {meter_id}
            """
        df = dbtest(query)
        if not df.empty:
            raise ValueError("Excel file contains entries that overlap with existing database records.")

    def validate_required_columns(self, data_chunk=None):
        missing_columns = [col for col in self.required_columns if col not in data_chunk.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")

    def validate_start_end_dates(self, data_chunk=None):
        if (data_chunk['Start Date (Required)'] > data_chunk['End Date (Required)']).any():
            raise ValueError("There are rows where the Start Date is greater than the End Date.")

    def validate_time_difference(self, data_chunk=None):
        time_difference = (data_chunk['End Date (Required)'] - data_chunk[
            'Start Date (Required)']).dt.total_seconds() / 60
        if (time_difference > 60).any():
            raise ValueError(
                "Some rows have a time difference between Start Date and End Date greater than 60 minutes.")

    def validate_data_within_meter_active_range(self, data_chunk=None):
        current_date = datetime.now().replace(minute=0, second=0, microsecond=0)
        max_date = min(self.meter_inactive, current_date) if self.meter_inactive else current_date
        invalid_dates = data_chunk[
            (data_chunk['Start Date (Required)'] < self.meter_active) |
            (data_chunk['End Date (Required)'] > max_date)
            ]
        if not invalid_dates.empty:
            raise ValueError(
                f"Excel contains {len(invalid_dates)} entries outside the allowed date range. Allowed range: {self.meter_active.strftime('%Y-%m-%d %H:%M')} to {max_date.strftime('%Y-%m-%d %H:%M')}."
            )


class MeterDataUploader(BaseDataUploader):

    def create_file_record_in_table(self, file_path):
        values = [self.facility_id, self.meter_id, self.meter_serial_no, self.created_by, file_path]
        return db_execute_single(insert_query_facility_meter_hourly_entries, values)

    def process(self):
        validator = Validators(self.excel_file, self.meter_active, self.meter_inactive)
        chunks = validator.validate_and_read_excel_sheets(self.excel_file)

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_to_chunk = {executor.submit(validator.validate_chunk, chunk, self.iv, self.meter_id): chunk for chunk
                               in chunks}
            for future in concurrent.futures.as_completed(future_to_chunk):
                try:
                    result = future.result()
                except Exception as exc:
                    return {'success': False, 'error': str(exc)}
        blob_name = generate_blob_name()
        file_path = save_file_to_blob(blob_name, self.excel_file)
        record_id = self.create_file_record_in_table(file_path)
        print(self.excel_file)
        return {
            "success": True,
            "message": "File Uploaded Successfully",
            "path": file_path,
            "record_id": record_id
        }


class MeterDataUploaderIV:
    pass
