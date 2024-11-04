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
        self.xml_file = file
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
                f"Check Date Format in Columns {self.start} {self.end}. Preferred Formats is like 2024/09/25 09:09, 2024/09/07 09:09")
        return df

    def valid_start_end_date(self, df):
        filtered_df = df[df[self.start] <= df[self.end]]
        if len(filtered_df) != len(df):
            raise ValueError('Data Contains value where Start Date is Greater then End Date')
        filtered_df = df[df[self.start] != df[self.end]]
        return filtered_df

    def dates_beyond_2018(self, df):
        past_records = df[
            (df[self.start] < pd.Timestamp('2018-01-01 00:00:00')) |
            (df[self.end] < pd.Timestamp('2018-01-01 00:00:00'))
            ]
        if not past_records.empty:
            raise ValueError("Dates before 2018 are not accepted.")
        return df

    def check_for_valid_hourly_entries(self, df):
        df['Expected End Date'] = df[self.start] + pd.Timedelta(minutes=60)
        return df[df[self.end] <= df['Expected End Date']]

    def check_for_date_ranges_between_meter_dates(self, df):
        current_date = datetime.now()
        max_date = min(self.meter_inactive, current_date) if self.meter_inactive else current_date
        min_date = self.meter_active if self.meter_active else pd.Timestamp('2018-01-01 00:00:00')

        invalid_dates = df[
            (df[self.start] < min_date) |
            (df[self.end] > max_date)
            ]

        if not invalid_dates.empty:
            raise ValueError(f"File contains {len(invalid_dates)} entries outside the allowed date range. "
                             f"Allowed range: {min_date.strftime('%Y-%m-%d %H:%M')} to {max_date.strftime('%Y-%m-%d %H:%M')}.")
        return df

    def validate_future_records(self, df):
        current_date = datetime.now()
        invalid_dates = df[(df[self.start] > current_date) | (df[self.end] > current_date)]
        if not invalid_dates.empty:
            raise ValueError(f"File contains Future Dates")
        return df

    def validate_no_overlapping_dates(self, df):
        min_start = df[self.start].min()
        max_end = df[self.end].max()

        if pd.isnull(min_start) or pd.isnull(max_end):
            return df

        query = f"""
            SELECT start_date, end_date, reading FROM epp.meter_hourly_entries 
            WHERE start_date <= '{max_end}' AND end_date >= '{min_start}' 
            AND {'independent_variable_id' if self.iv else 'meter_id'} = {self.meter_id}
        """
        db = dbtest(query)
        if not db.empty:
            db.rename(columns={'start_date': self.start, 'end_date': self.end, 'reading': self.reading}, inplace=True)
            merged = db.merge(df, on=[self.start, self.end, self.reading], how='inner')
            if not merged.empty:
                raise ValueError("Excel file contains entries that overlap with existing database records.")
        return df

    def validate_chunk(self, data_chunk):
        """
        Validates a chunk of data through all validation steps and returns the validated DataFrame
        """
        df = self.validate_date_format(data_chunk)
        df = self.valid_start_end_date(df)
        df = self.dates_beyond_2018(df)

        if not self.iv:
            df = self.check_for_valid_hourly_entries(df)
            df = self.check_for_date_ranges_between_meter_dates(df)

        df = self.validate_future_records(df)
        df = self.validate_no_overlapping_dates(df)

        return df


class DataUploader(BaseDataUploader):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.validator = Validators(self.meter_active, self.meter_inactive, self.iv, self.meter_id)
        self.data_len = 0
        self.validated_chunks = []

    def read_excel_sheets(self, file):
        required_columns = [self.start, self.end, self.reading]
        excel_io = io.BytesIO(file.read())
        wb = openpyxl.load_workbook(excel_io, read_only=True)
        sheets_data = []
        invalid_sheets = []
        missing_columns = False

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
        initial_row_count = len(df)
        df.dropna(subset=[self.start, self.end], inplace=True)
        df.dropna(how='all', inplace=True)
        df['is_active'] = True

        new_row = pd.DataFrame([{
            self.start: pd.Timestamp('2024-09-21 22:22:22'),
            self.end: pd.Timestamp('2024-09-21 23:22:22'),
            self.reading: 7294581063259348,
            'is_active': False
        }])

        df = pd.concat([df, new_row], ignore_index=True)

        for col in [self.start, self.end]:
            df[col] = pd.to_datetime(df[col], errors='coerce').dt.round('min')
        return df

    def process_chunk(self, chunk_data, header):
        try:
            df = pd.DataFrame(chunk_data, columns=header)
            df = df[[self.start, self.end, self.reading]]
            df = self.data_cleaning(df)
            validated_df = self.validator.validate_chunk(df)
            return validated_df
        except Exception as e:
            print(f"Error processing chunk: {str(e)}")
            raise

    def create_file_record_in_table(self, file_path):
        insert_query = insert_query_facility_iv_files_table if self.iv else insert_query_facility_meter_hourly_entries
        values = [self.meter_id, file_path] if self.iv else [self.facility_id, self.meter_id, self.meter_serial_no,
                                                             self.created_by, file_path]
        return db_execute_single(insert_query, values)

    def process(self):
        try:
            sheets_data = self.read_excel_sheets(self.excel_file)
            validated_chunks = []

            with concurrent.futures.ThreadPoolExecutor() as executor:
                futures = []
                chunk_set = 50000

                for header, data in sheets_data:
                    self.data_len += len(data)
                    for i in range(0, len(data), chunk_set):
                        chunk = data[i:i + chunk_set]
                        futures.append(executor.submit(self.process_chunk, chunk, header))

                # Collect results
                for future in concurrent.futures.as_completed(futures):
                    try:
                        chunk_result = future.result()
                        if chunk_result is not None and not chunk_result.empty:
                            validated_chunks.append(chunk_result)
                    except Exception as e:
                        print(f"Error processing chunk: {str(e)}")
                        raise

            # Combine all validated chunks
            if validated_chunks:
                self.validator.clean_df = pd.concat(validated_chunks, ignore_index=True)

            # Calculate response
            active_records = len(self.validator.clean_df[self.validator.clean_df['is_active'] == True])

            if active_records == 0:
                return {
                    "status_code": 400,
                    "success": False,
                    "message": "All the rows had invalid data. So nothing to process."
                }

            removed_records = self.data_len - active_records
            status_code = 200 if removed_records == 0 else 202
            response_message = "File Uploaded Successfully" if removed_records == 0 else \
                f"A few Records were removed while Uploading the data as they had invalid records. {removed_records} Row(s) were removed"

            # Save to blob storage
            excel_buffer = io.BytesIO()
            self.validator.clean_df.to_csv(excel_buffer, index=False)
            excel_buffer.seek(0)
            blob_name = generate_blob_name(extension='csv')
            file_path = save_file_to_blob(blob_name, excel_buffer)
            record_id = self.create_file_record_in_table(file_path)

            return {
                "status_code": status_code,
                "success": True,
                "message": response_message,
                "path": file_path,
                "record_id": record_id
            }

        except Exception as error:
            return {
                "status_code": 500,
                "success": False,
                "error": str(error)
            }
