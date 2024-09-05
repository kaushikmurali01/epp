import openpyxl
import io
from datetime import datetime, time
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
        self.column_indices = {}

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

    def validate_date_range(self, start_date, end_date):
        self.get_meter_dates()
        current_date = datetime.now().replace(minute=0, second=0, microsecond=0)
        max_date = min(self.meter_inactive, current_date) if self.meter_inactive else current_date
        meter_active_start = datetime.combine(self.meter_active.date(), time.min)

        if start_date < meter_active_start or end_date > max_date:
            return False
        return True

    def validate_time_interval(self, start_date, end_date):
        interval = (end_date - start_date).total_seconds() / 60
        return 0 <= interval <= 60

    def check_overlap(self, start_date, end_date):
        if self.iv:
            query = f"""
                    SELECT 1 
                    FROM epp.meter_hourly_entries 
                    WHERE start_date < '{end_date}' AND end_date > '{start_date}' AND independent_variable_id = {self.meter_id}
                    LIMIT 1
                    """
        else:
            query = f"""
            SELECT 1
            FROM epp.meter_hourly_entries 
            WHERE start_date < '{end_date}' AND end_date > '{start_date}' AND meter_id = {self.meter_id}
            LIMIT 1
            """
        result = dbtest(query)
        return len(result) > 0

    def save_to_database(self, row_data):
        # This method should be implemented in child classes
        raise NotImplementedError("This method should be implemented in child classes")

    def process_row(self, row):
        try:
            start_date = row[self.column_indices['Start Date (Required)']]
            end_date = row[self.column_indices['End Date (Required)']]
            meter_reading = row[self.column_indices['Meter Reading (Required)']]

            if not all([start_date, end_date, meter_reading]):
                return False, "Missing required data in row"

            start_date = datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")
            end_date = datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S")

            if not self.validate_date_range(start_date, end_date):
                return False, "Date out of allowed range"

            if not self.validate_time_interval(start_date, end_date):
                return False, "Invalid time interval"

            if self.check_overlap(start_date, end_date):
                return False, "Overlapping entry detected"

            self.save_to_database((start_date, end_date, meter_reading))
            return True, None
        except Exception as e:
            return False, str(e)

    def process_sheet(self, sheet):
        for row in sheet.iter_rows(values_only=True):
            if not self.column_indices:
                # First row, set up column indices
                self.column_indices = {col_name: idx for idx, col_name in enumerate(row) if
                                       col_name in self.required_columns}
                if len(self.column_indices) != len(self.required_columns):
                    raise ValueError(f"Sheet is missing required columns. Found: {list(self.column_indices.keys())}")
                continue

            success, error_message = self.process_row(row)
            if not success:
                print(f"Error processing row: {error_message}")
                # Optionally, you might want to collect these errors and report them

    def validate_and_process_excel(self):
        try:
            excel_data = self.excel_file.read()
            excel_io = io.BytesIO(excel_data)
            wb = openpyxl.load_workbook(excel_io, read_only=True, data_only=True)

            for sheet in wb.worksheets:
                if sheet.sheet_state == 'visible':
                    self.process_sheet(sheet)

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

    def save_to_database(self, row_data):
        start_date, end_date, meter_reading = row_data
        values = [self.facility_id, self.meter_id, self.meter_serial_no, start_date, end_date, meter_reading,
                  self.created_by]
        db_execute_single(insert_query_facility_meter_hourly_entries, values)

    def create_file_record_in_table(self, file_path):
        values = [self.facility_id, self.meter_id, self.meter_serial_no, self.created_by, file_path]
        return db_execute_single(insert_query_facility_meter_hourly_entries, values)


class MeterDataUploaderIV(BaseDataUploader):
    def validate_date_range(self, start_date, end_date):
        current_date = datetime.now().replace(second=0, microsecond=0)
        return start_date <= current_date and end_date <= current_date

    def save_to_database(self, row_data):
        start_date, end_date, meter_reading = row_data
        values = [self.meter_id, start_date, end_date, meter_reading, self.created_by]
        db_execute_single(insert_query_facility_iv_files_table, values)

    def create_file_record_in_table(self, file_path):
        values = [self.meter_id, file_path]
        return db_execute_single(insert_query_facility_iv_files_table, values)