from datetime import datetime, time
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
        self.iv= iv
        self.excel_file = file
        self.meter_id = meter_id
        self.created_by = created_by
        self.meter_serial_no = meter_serial_no
        self.required_columns = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']
        self.merged_df = pd.DataFrame()

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

    def validate_date_range(self):
        self.get_meter_dates()
        current_date = datetime.now().replace(minute=0, second=0, microsecond=0)
        max_date = min(self.meter_inactive, current_date) if self.meter_inactive else current_date
        meter_active_start = pd.to_datetime(datetime.combine(self.meter_active.date(), time.min))
        max_date = pd.to_datetime(max_date)
        invalid_dates = self.merged_df[
            (self.merged_df['Start Date (Required)'] < meter_active_start) |
            (self.merged_df['End Date (Required)'] > max_date)
            ]

        if not invalid_dates.empty:
            print("Invalid Dates Details:")
            print(invalid_dates[['Start Date (Required)', 'End Date (Required)']])
            # Handle or log the invalid dates as needed
            # For example, removing these rows:
            # self.merged_df = self.merged_df[~self.merged_df.index.isin(invalid_dates.index)]

            raise ValueError(
                f"Excel contains {len(invalid_dates)} entries outside the allowed date range. "
                f"Allowed range: {meter_active_start.strftime('%Y-%m-%d %H:%M')} to {max_date.strftime('%Y-%m-%d %H:%M')}. "
                f"Consider reviewing these entries."
            )

    def validate_and_read_excel_sheets(self):
        try:
            excel_data = self.excel_file.read() if hasattr(self.excel_file, 'read') else open(self.excel_file,
                                                                                              'rb').read()
            excel_io = io.BytesIO(excel_data)
            wb = load_workbook(excel_io, read_only=True)
            visible_sheets = [sheet.title for sheet in wb.worksheets if sheet.sheet_state == 'visible']
            excel_io.seek(0)
            with pd.ExcelFile(excel_io) as xls:
                all_sheets = {sheet_name: pd.read_excel(xls, sheet_name) for sheet_name in visible_sheets}
        except Exception as e:
            raise ValueError(f"Error reading Excel file: {str(e)}")

        if not all_sheets:
            raise ValueError("The Excel file appears to be empty or unreadable.")

        valid_sheets, invalid_sheets = [], []
        for sheet_name, df in all_sheets.items():
            if isinstance(df, pd.DataFrame) and not df.empty and all(
                    column in df.columns for column in self.required_columns):
                valid_sheets.append(sheet_name)
                df_filtered = df[self.required_columns]
                self.merged_df = df_filtered if self.merged_df.empty else pd.concat([self.merged_df, df_filtered],
                                                                                    ignore_index=True)
            else:
                invalid_sheets.append(sheet_name)

        if not valid_sheets:
            raise ValueError(f"No valid sheets found. Invalid sheets: {', '.join(invalid_sheets)}")
        if self.merged_df.empty:
            raise ValueError("No valid data found in the Excel file.")
        if invalid_sheets:
            invalid_sheets_join = invalid_sheets[0]
            if len(invalid_sheets) > 1:
                invalid_sheets_join = ','.join(invalid_sheets)
            raise ValueError("Invalid Sheet(s):{}".format(invalid_sheets_join))

        # # Convert 'Start Date (Required)' to datetime, setting invalid values to NaN
        # self.merged_df['Start Date (Required)'] = pd.to_datetime(self.merged_df['Start Date (Required)'],
        #                                                          errors='coerce')
        #
        # # Convert 'End Date (Required)' to datetime, setting invalid values to NaN
        # self.merged_df['End Date (Required)'] = pd.to_datetime(self.merged_df['End Date (Required)'], errors='coerce')

    def check_duplicates(self):
        duplicates = self.merged_df[
            self.merged_df.duplicated(subset=['Start Date (Required)', 'End Date (Required)'], keep=False)]
        if not duplicates.empty:
            raise ValueError("Excel file contains duplicate entries")

    @staticmethod
    def check_overlaps_in_chunk(chunk, new_entries):
        overlaps = []
        chunk['start_date'] = pd.to_datetime(chunk['start_date'])
        chunk['end_date'] = pd.to_datetime(chunk['end_date'])
        for _, new_row in new_entries.iterrows():
            overlap = chunk[
                (chunk['start_date'] < new_row['End Date (Required)']) &
                (chunk['end_date'] > new_row['Start Date (Required)'])
                ]
            if not overlap.empty:
                overlaps.append(new_row)
                break
        return overlaps

    def check_overlaps(self, chunk_size=100000):
        min_start = self.merged_df['Start Date (Required)'].min()
        max_end = self.merged_df['End Date (Required)'].max()
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
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(self.check_overlaps_in_chunk, df.iloc[i:i + chunk_size], self.merged_df)
                       for i in range(0, len(df), chunk_size)]
            for future in as_completed(futures):
                overlaps.extend(future.result())
        if overlaps:
            raise ValueError("Excel file contains entries that overlap with existing database records")

    def check_invalid_dates(self):
        self.merged_df.dropna(how='all', inplace=True)
        try:
            self.merged_df['Start Date (Required)'] = pd.to_datetime(self.merged_df['Start Date (Required)'])
            self.merged_df['End Date (Required)'] = pd.to_datetime(self.merged_df['End Date (Required)'])
        except:
            raise ValueError("Invalid Records in Start Date (Required) or End Date (Required)")

        # start_date_missing = self.merged_df['Start Date (Required)'].isnull().sum()
        # end_date_missing = self.merged_df['End Date (Required)'].isnull().sum()
        # if start_date_missing and end_date_missing:
        #     raise ValueError("Both Start Date (Required) and End Date (Required) has Missing values")
        # if start_date_missing:
        #     raise ValueError("Start Date (Required) has Missing values")
        # if end_date_missing:
        #     raise ValueError("End Date (Required) has Missing values")

    def validate(self):
        try:
            self.validate_and_read_excel_sheets()
            # self.check_duplicates()
            self.check_invalid_dates()
            self.validate_date_range()
            self.check_overlaps()
            return True, "File Validated Successfully"
        except ValueError as e:
            return False, str(e)
        except Exception as e:
            return False, f"Unexpected error: {str(e)}"

    def create_file_record_in_table(self, file_path):
        raise NotImplementedError("This method should be implemented in child classes")

    # def get_meter_dates(self):
    #     raise NotImplementedError("This method should be implemented in child classes")
    # def validate_date_range(self):
    #     raise NotImplementedError("This method should be implemented in child classes")

    def process(self):
        valid, error_message = self.validate()
        if valid:
            self.excel_file.seek(0)  # Reset the file pointer to the beginning of the file.
            excel_data = self.excel_file.read() if hasattr(self.excel_file, 'read') else open(self.excel_file,
                                                                                              'rb').read()
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
        super().__init__(file, facility_id, meter_id, created_by, meter_serial_no)
        self.iv = iv

    def create_file_record_in_table(self, file_path):
        values = [self.facility_id, self.meter_id, self.meter_serial_no, self.created_by, file_path]
        return db_execute_single(insert_query_facility_meter_hourly_entries, values)


class MeterDataUploaderIV(BaseDataUploader):
    def validate_date_range(self):
        current_date = datetime.now().replace(second=0, microsecond=0)
        future_dates = self.merged_df[self.merged_df['Start Date (Required)'] > current_date]
        if not future_dates.empty:
            raise ValueError(
                f"Excel contains entries with future start dates. "
                f"All start dates must be on or before {current_date.strftime('%Y-%m-%d %H:%M')}. "
                f"Found {len(future_dates)} entries with future start dates."
            )

    def create_file_record_in_table(self, file_path):
        values = [self.meter_id, file_path]
        return db_execute_single(insert_query_facility_iv_files_table, values)
