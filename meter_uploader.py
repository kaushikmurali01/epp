import concurrent.futures
import io
from datetime import datetime
import pandas as pd
import openpyxl
from dbconnection import dbtest, db_execute_single
from sql_queries.file_uploader import insert_query_facility_meter_hourly_entries, insert_query_facility_iv_files_table
from utils import generate_blob_name, save_file_to_blob


class CommonBase:
    def __init__(self):
        self.start = 'Start Date (Required)'
        self.end = 'End Date (Required)'
        self.reading = 'Meter Reading (Required)'
        self.required_columns = [self.start, self.end, self.reading]


class BaseDataUploader(CommonBase):
    def __init__(self, file, facility_id, meter_id, iv, created_by=None, meter_serial_no=None):
        super().__init__()
        self.facility_id = facility_id
        self.iv = iv
        self.excel_file = file
        self.meter_id = meter_id
        self.created_by = created_by
        self.meter_serial_no = meter_serial_no
        if not self.iv:
            self.meter_active, self.meter_inactive = self.get_meter_dates()
        else:
            self.meter_active, self.meter_inactive = None, None

    def get_meter_dates(self):
        query = f"SELECT meter_active, meter_inactive FROM epp.facility_meter_detail WHERE id = {self.meter_id}"
        df = dbtest(query)
        if df.empty:
            raise ValueError(f"No meter details found for meter_id {self.meter_id}")
        return df.iloc[0]['meter_active'], df.iloc[0]['meter_inactive']


class Validators(CommonBase):
    def __init__(self, meter_active, meter_inactive, iv, meter_id):
        super().__init__()
        self.clean_df = pd.DataFrame()
        self.iv = iv
        self.meter_id = meter_id
        self.meter_active = meter_active
        self.meter_inactive = meter_inactive
        self.required_columns = [self.start, self.end, self.reading]

    def validate_date_format(self, df):
        nat_values = df[[self.start, self.end]].isnull()
        if nat_values.any().any():
            raise ValueError(
                f"Check Date Format in Columns {self.start} {self.end}. Preferred  Formats is like 2024/09/25 09:09, 2024/09/07 09:09")

    def valid_start_end_date(self, df):
        filtered_df = df[df[self.start] > df[self.end]]
        if not filtered_df.empty:
            raise ValueError('Data Contains value where Start Date is Greater then End Date')

    def dates_beyond_2018(self, df):
        past_records = df[
            (df[self.start] < pd.Timestamp('2018-01-01 00:00:00')) |
            (df[self.end] < pd.Timestamp('2018-01-01 00:00:00'))
            ]
        if not past_records.empty:
            raise ValueError("Dates before 2018 are not accepted.")

    def check_for_valid_hourly_entries(self, df):
        df['Expected End Date'] = df[self.start] + pd.Timedelta(minutes=60)
        invalid_dates = df[df[self.end] > df['Expected End Date']]
        if len(invalid_dates):
            raise ValueError(
                f"Some rows have a time difference between Start Date and End Date greater than 60 minutes.")

    def check_for_date_ranges_between_meter_dates(self, df):
        current_date = datetime.now()
        max_date = min(self.meter_inactive, current_date) if self.meter_inactive else current_date
        min_date = self.meter_active
        if not min_date:
            min_date = pd.Timestamp('2018-01-01 00:00:00')
        if self.meter_active:
            invalid_dates = df[
                (df[self.start] < self.meter_active) |
                (df[self.end] > max_date)
                ]
        else:
            invalid_dates = df[
                (df[self.start] < min_date) |
                (df[self.end] > max_date)
                ]
        if not invalid_dates.empty:
            raise ValueError(f"File contains {len(invalid_dates)} entries outside the allowed date range. "
                             f"Allowed range: {min_date.strftime('%Y-%m-%d %H:%M')} to {max_date.strftime('%Y-%m-%d %H:%M')}.")

    def validate_future_records(self, df):
        current_date = datetime.now()
        invalid_dates = df[(df[self.start] > current_date) | (df[self.end] > current_date)]
        if not invalid_dates.empty:
            raise ValueError(f"File contains Future Dates")

    def validate_no_overlapping_dates(self, data_chunk):
        iv = self.iv
        meter_id = self.meter_id
        min_start = data_chunk['Start Date (Required)'].min()
        max_end = data_chunk['End Date (Required)'].max()
        if not min_start or max_end:
            return
        query = f"""
            SELECT 1 FROM epp.meter_hourly_entries 
            WHERE start_date <= '{max_end}' AND end_date >= '{min_start}' 
            AND {'independent_variable_id' if iv else 'meter_id'} = {meter_id}
            LIMIT 1
            """
        df = dbtest(query)
        if not df.empty:
            raise ValueError("Excel file contains entries that overlap with existing database records.")

    def validate_chunk(self, data_chunk):
        """
        Validations:
        1: Validate the date Should have a Valid Date Formats.| Not Done
        2: Validate that Start Date is Always Lesser Than End Date | Done
        3: Validate the Date of Start Date should never have the value before 2018 | Done
        4: Validate the Difference Between Start Date and End Date Should not be more than 60 minutes for Energy Consumption.| Done
        5: Check If It has any future Entries | Done
        6: Validate that the values provided in case of Energy Consumption Data should not be before meter START Date if the meter has a start date available.| Done
        7: There Should be No Overlapping Entries Present in the Database

        """
        self.validate_date_format(data_chunk)
        self.valid_start_end_date(data_chunk)
        self.dates_beyond_2018(data_chunk)
        if not self.iv:
            self.check_for_valid_hourly_entries(data_chunk)
            self.check_for_date_ranges_between_meter_dates(data_chunk)
        self.validate_future_records(data_chunk)
        self.validate_no_overlapping_dates(data_chunk)

        self.clean_df = pd.concat([self.clean_df, data_chunk], ignore_index=True)


class DataUploader(BaseDataUploader):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.validator = Validators(self.meter_active, self.meter_inactive, self.iv, self.meter_id)

    def read_excel_sheets(self, file):
        required_columns = [self.start, self.end, self.reading]
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
                continue

            header = rows[0]
            if not all(col in header for col in required_columns):
                missing_columns = True
                invalid_sheets.append(sheet.title)
                continue
            if not invalid_sheets:
                data = rows[1:]
                sheets_data.append((header, data))

        wb.close()
        if missing_columns:
            raise ValueError("Required Columns are missing in Sheet(s):{}".format(','.join(invalid_sheets)))

        return sheets_data

    def data_cleaning(self, df):
        df = df[self.required_columns]
        df.dropna(subset=[self.start, self.end], inplace=True)
        df.dropna(how='all', inplace=True)
        df['Default'] = False

        new_row = pd.DataFrame([{
            self.start: pd.Timestamp('2024-09-21 22:22:22'),
            self.end: pd.Timestamp('2024-09-21 23:22:22'),
            self.reading: 7294581063259348,
            'Default': True
        }])

        df = pd.concat([df, new_row], ignore_index=True)

        for col in [self.start, self.end]:
            df[col] = pd.to_datetime(df[col], errors='coerce').dt.round('min')
        return df

    def process_chunk(self, chunk_data, header, validator, iv, meter_id):
        df = pd.DataFrame(chunk_data, columns=header)
        df = df[[self.start, self.end, self.reading]]
        df = self.data_cleaning(df)
        validator.validate_chunk(df)

    def create_file_record_in_table(self, file_path):
        insert_query = insert_query_facility_iv_files_table if self.iv else insert_query_facility_meter_hourly_entries
        values = [self.meter_id, file_path] if self.iv else [self.facility_id, self.meter_id, self.meter_serial_no,
                                                             self.created_by, file_path]
        return db_execute_single(insert_query, values)

    def process(self):
        try:
            sheets_data = self.read_excel_sheets(self.excel_file)
            with concurrent.futures.ThreadPoolExecutor() as executor:
                futures = []
                chunk_set = 10000
                for header, data in sheets_data:
                    for i in range(0, len(data), chunk_set):
                        chunk = data[i:i + chunk_set]
                        futures.append(
                            executor.submit(self.process_chunk, chunk, header, self.validator, self.iv, self.meter_id))
                concurrent.futures.wait(futures)
                for future in futures:
                    future.result()  # This will raise any exceptions that occurred during processing
            excel_buffer = io.BytesIO()
            self.validator.clean_df.to_excel(excel_buffer, index=False)
            excel_buffer.seek(0)
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
