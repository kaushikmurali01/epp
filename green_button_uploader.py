import io
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime


from components.green_button import Convert
from dbconnection import dbtest, db_execute_single
from sql_queries.file_uploader import insert_query_facility_meter_hourly_entries, insert_query_facility_iv_files_table
from utils import generate_blob_name, save_file_to_blob


class GreenBaseDataUploader:
    def __init__(self, file, facility_id, meter_id, iv, created_by=None, meter_serial_no=None):
        self.facility_id = facility_id
        self.iv = iv
        self.xml_file = file
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
    def __init__(self, meter_active, meter_inactive, iv):
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
            minutes = 24 * 60
        self.validate_time_difference(chunk, minutes=minutes)

    @staticmethod
    def validate_no_overlapping_dates(iv, meter_id, data_chunk):
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

    @staticmethod
    def validate_start_end_dates(data_chunk):
        if (data_chunk['Start Date (Required)'] > data_chunk['End Date (Required)']).any():
            raise ValueError("There are rows where the Start Date is greater than the End Date.")

    @staticmethod
    def validate_time_difference(data_chunk, minutes=60):
        time_difference = (data_chunk['End Date (Required)'] - data_chunk[
            'Start Date (Required)']).dt.total_seconds() / 60
        if (time_difference > minutes).any():
            raise ValueError(
                f"Some rows have a time difference between Start Date and End Date greater than {minutes} minutes.")

    def validate_data_within_meter_active_range(self, data_chunk):
        current_date = datetime.now()
        max_date = min(self.meter_inactive, current_date) if self.meter_inactive else current_date
        if not self.meter_active:
            invalid_dates = data_chunk[
                (data_chunk['End Date (Required)'] > max_date)
            ]
        else:
            invalid_dates = data_chunk[
                (data_chunk['Start Date (Required)'] < self.meter_active) |
                (data_chunk['End Date (Required)'] > max_date)
                ]
        print(self.meter_active, max_date, "@#$#@$%^#$%Y^#$%^")
        if not invalid_dates.empty:
            if self.meter_active:
                raise ValueError(
                    f"Excel contains {len(invalid_dates)} entries outside the allowed date range. "
                    f"Allowed range: {self.meter_active.strftime('%Y-%m-%d %H:%M')} to {max_date.strftime('%Y-%m-%d %H:%M')}."
                )
            else:
                raise ValueError(
                    f"Excel contains {len(invalid_dates)} future Entries."
                )


class GreenDataUploader(GreenBaseDataUploader):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.validator = Validators(self.meter_active, self.meter_inactive, self.iv)

    def create_file_record_in_table(self, file_path):
        insert_query = insert_query_facility_iv_files_table if self.iv else insert_query_facility_meter_hourly_entries
        values = [self.meter_id, file_path] if self.iv else [self.facility_id, self.meter_id, self.meter_serial_no,
                                                             self.created_by, file_path]
        return db_execute_single(insert_query, values)

    def process(self):
        try:
            df = Convert(self.xml_file)
            chunk_size = 50000  # Size of each chunk for validation
            num_workers = 10  # Number of concurrent workers
            # Splitting the DataFrame into chunks
            chunks = [df.iloc[i:i + chunk_size] for i in range(0, len(df), chunk_size)]

            # Using ThreadPoolExecutor to validate chunks in parallel
            with ThreadPoolExecutor(max_workers=num_workers) as executor:
                futures = [executor.submit(self.validate_and_process_chunk, chunk) for chunk in chunks]

                # Waiting for all futures to complete
                results = [future.result() for future in futures]
            excel_buffer = io.BytesIO()

            df.to_excel(excel_buffer, index=False)  # Save DataFrame to an Excel buffer
            excel_buffer.seek(0)  # Rewind the buffer

            blob_name = generate_blob_name()
            file_path = save_file_to_blob(blob_name, excel_buffer)
            record_id = self.create_file_record_in_table(file_path)
            return {
                "success": True,
                "message": "File Uploaded Successfully",
                "path": file_path,
                "record_id": record_id
            }
        except Exception as error:
            return {
                "success": False,
                "error": str(error)
            }

    def validate_and_process_chunk(self, chunk):
        """Validate a single chunk of data."""
        self.validator.validate_chunk(chunk, self.iv, self.meter_id)
        return "Chunk processed successfully"
