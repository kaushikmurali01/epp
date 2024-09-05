import pandas as pd
from openpyxl import load_workbook
import io
from datetime import datetime, time
from concurrent.futures import ThreadPoolExecutor, as_completed
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
        self.chunk_size = 10000  # Number of rows to process at a time

    def get_meter_dates(self):
        query = f"""
        SELECT meter_active, meter_inactive 
        FROM epp.facility_meter_detail 
        WHERE id = {self.meter_id}
        """
        df = dbtest(query)
        if not df.empty:
            self.meter_active = df.iloc[0]['meter_active']
            self.meter_inactive = df.iloc[0]['meter_inactive']
        else:
            raise ValueError(f"No meter details found for meter_id {self.meter_id}")

    def validate_date_range(self, df_chunk):
        self.get_meter_dates()
        current_date = datetime.now().replace(minute=0, second=0, microsecond=0)
        max_date = min(self.meter_inactive, current_date) if self.meter_inactive else current_date
        meter_active_start = pd.to_datetime(datetime.combine(self.meter_active.date(), time.min))
        max_date = pd.to_datetime(max_date)
        invalid_dates = df_chunk[
            (df_chunk['Start Date (Required)'] < meter_active_start) |
            (df_chunk['End Date (Required)'] > max_date)
            ]
        return invalid_dates

    def process_excel_chunk(self, chunk):
        # Perform validations on the chunk
        invalid_dates = self.validate_date_range(chunk)
        if not invalid_dates.empty:
            raise ValueError(f"Excel contains entries outside the allowed date range.")

        # Check for duplicates within the chunk
        duplicates = chunk[chunk.duplicated(subset=['Start Date (Required)', 'End Date (Required)'], keep=False)]
        if not duplicates.empty:
            raise ValueError("Excel file contains duplicate entries")

        # Validate time intervals
        chunk['Interval'] = chunk['End Date (Required)'] - chunk['Start Date (Required)']
        chunk['Interval in Minutes'] = chunk['Interval'].dt.total_seconds() / 60
        invalid_intervals = chunk[(chunk['Interval in Minutes'] > 60) | (chunk['Interval in Minutes'] < 0)]
        if not invalid_intervals.empty:
            raise ValueError("Invalid Intervals Detected in Start Date (Required) and End Date (Required)")

        return chunk

    def check_overlaps(self, chunk):
        min_start = chunk['Start Date (Required)'].min()
        max_end = chunk['End Date (Required)'].max()
        if self.iv:
            query = f"""
                    SELECT start_date, end_date 
                    FROM epp.meter_hourly_entries 
                    WHERE start_date <= '{max_end}' AND end_date >= '{min_start}' AND independent_variable_id = {self.meter_id}
                    """
        else:
            query = f"""
            SELECT start_date, end_date 
            FROM epp.meter_hourly_entries 
            WHERE start_date <= '{max_end}' AND end_date >= '{min_start}' AND meter_id = {self.meter_id}
            """
        df = dbtest(query)

        overlaps = []
        for _, new_row in chunk.iterrows():
            overlap = df[
                (df['start_date'] < new_row['End Date (Required)']) &
                (df['end_date'] > new_row['Start Date (Required)'])
                ]
            if not overlap.empty:
                overlaps.append(new_row)
        return overlaps

    def save_to_database(self, chunk):
        # Implement the logic to save the processed chunk to the database
        # This method should be implemented in child classes
        raise NotImplementedError("This method should be implemented in child classes")

    def process_sheet(self, sheet):
        for start_row in range(1, sheet.max_row + 1, self.chunk_size):
            end_row = min(start_row + self.chunk_size - 1, sheet.max_row)
            chunk_data = []
            for row in sheet.iter_rows(min_row=start_row, max_row=end_row, values_only=True):
                chunk_data.append(row)

            df_chunk = pd.DataFrame(chunk_data[1:], columns=chunk_data[0])  # Assuming first row is header

            if all(column in df_chunk.columns for column in self.required_columns):
                df_chunk = df_chunk[self.required_columns]
                df_chunk['Start Date (Required)'] = pd.to_datetime(df_chunk['Start Date (Required)'], errors='coerce')
                df_chunk['End Date (Required)'] = pd.to_datetime(df_chunk['End Date (Required)'], errors='coerce')

                processed_chunk = self.process_excel_chunk(df_chunk)
                overlaps = self.check_overlaps(processed_chunk)
                if overlaps:
                    raise ValueError("Excel file contains entries that overlap with existing database records")
                self.save_to_database(processed_chunk)
            else:
                raise ValueError(f"Sheet is missing required columns")

    def validate_and_process_excel(self):
        try:
            excel_data = self.excel_file.read()
            excel_io = io.BytesIO(excel_data)
            wb = load_workbook(excel_io, read_only=True)
            visible_sheets = [sheet for sheet in wb.worksheets if sheet.sheet_state == 'visible']

            if not visible_sheets:
                raise ValueError("The Excel file appears to be empty or unreadable.")

            with ThreadPoolExecutor(max_workers=5) as executor:
                futures = [executor.submit(self.process_sheet, sheet) for sheet in visible_sheets]

                # Wait for all futures to complete
                for future in as_completed(futures):
                    future.result()  # This will raise an exception if there was an error

            return True, "File Processed Successfully"
        except Exception as e:
            return False, str(e)

    def create_file_record_in_table(self, file_path):
        raise NotImplementedError("This method should be implemented in child classes")

    def process(self):
        valid, error_message = self.validate_and_process_excel()
        if valid:
            self.excel_file.seek(0)
            excel_data = self.excel_file.read()
            blob_name = generate_blob_name()
            file_path = save_file_to_blob(blob_name, io.BytesIO(excel_data))
            record_id = self.create_file_record_in_table(file_path)
            return {
                "success": True,
                "message": "File Uploaded Successfully",
                "path": file_path,
                "record_id": record_id
            }
        return {"success": False, "message": error_message}


class MeterDataUploader(BaseDataUploader):
    def __init__(self, file, facility_id, meter_id, iv, created_by=None, meter_serial_no=None):
        super().__init__(file, facility_id, meter_id, iv, created_by, meter_serial_no)

    def save_to_database(self, chunk):
        # Implement the logic to save the meter data to the database
        # This is a placeholder implementation and should be adjusted based on your specific requirements
        for _, row in chunk.iterrows():
            values = [self.facility_id, self.meter_id, self.meter_serial_no, row['Start Date (Required)'],
                      row['End Date (Required)'], row['Meter Reading (Required)'], self.created_by]
            db_execute_single(insert_query_facility_meter_hourly_entries, values)

    def create_file_record_in_table(self, file_path):
        values = [self.facility_id, self.meter_id, self.meter_serial_no, self.created_by, file_path]
        return db_execute_single(insert_query_facility_meter_hourly_entries, values)


class MeterDataUploaderIV(BaseDataUploader):
    def validate_date_range(self, df_chunk):
        current_date = datetime.now().replace(second=0, microsecond=0)
        future_dates = df_chunk[df_chunk['Start Date (Required)'] > current_date]
        if not future_dates.empty:
            raise ValueError(
                f"Excel contains entries with future start dates. "
                f"All start dates must be on or before {current_date.strftime('%Y-%m-%d %H:%M')}. "
                f"Found {len(future_dates)} entries with future start dates."
            )

    def save_to_database(self, chunk):
        # Implement the logic to save the IV meter data to the database
        # This is a placeholder implementation and should be adjusted based on your specific requirements
        for _, row in chunk.iterrows():
            values = [self.meter_id, row['Start Date (Required)'], row['End Date (Required)'],
                      row['Meter Reading (Required)'], self.created_by]
            db_execute_single(insert_query_facility_iv_files_table, values)

    def create_file_record_in_table(self, file_path):
        values = [self.meter_id, file_path]
        return db_execute_single(insert_query_facility_iv_files_table, values)