from datetime import datetime, time

import pandas as pd

from concurrent.futures import ThreadPoolExecutor, as_completed
from openpyxl import load_workbook
import io

from dbconnection import db_execute_single, dbtest
from sql_queries.file_uploader import insert_query_facility_meter_hourly_entries
from utils import generate_blob_name, save_file_to_blob


class MeterDataUploader:
    """
    A class for uploading meter data from Excel files to a database.
    """

    def __init__(self, file, facility_id, meter_id, iv, created_by=None, meter_serial_no=None):
        """
        Initialize the MeterDataUploader.

        :param excel_file: Path to the Excel file or file-like object containing meter data
        :param db_connection_string: Database connection string
        :param facility_id: ID of the facility
        """
        self.facility_id = facility_id
        self.excel_file = file
        self.meter_id = meter_id
        self.iv = iv
        self.created_by = created_by
        self.meter_serial_no = meter_serial_no
        self.required_columns = ['Start Date (Required)', 'End Date (Required)',
                                 'Meter Reading (Required)']
        self.merged_df = pd.DataFrame()

    # def validate_date_range(self):
    #     """
    #     Validate that all dates in the Excel file are within the allowed range.
    #     """
    #     current_date = pd.Timestamp.now().date()
    #
    #     if self.meter_inactive is None:
    #         max_date = current_date
    #     else:
    #         max_date = max(
    #             self.meter_inactive.date() if isinstance(self.meter_inactive, pd.Timestamp) else self.meter_inactive,
    #             current_date)
    #
    #     invalid_dates = self.merged_df[
    #         (self.merged_df['Start Date (Required)'].dt.date < self.meter_active.date() if isinstance(self.meter_active,
    #                                                                                                   pd.Timestamp) else self.meter_active) |
    #         (self.merged_df['End Date (Required)'].dt.date > max_date)
    #         ]
    #
    #     if not invalid_dates.empty:
    #         raise ValueError(
    #             f"Excel contains entries outside the allowed date range. "
    #             f"Allowed range: {self.meter_active.date() if isinstance(self.meter_active, pd.Timestamp) else self.meter_active} to {max_date}"
    #         )

    def validate_date_range(self):
        """
        Validate that all dates in the Excel file are within the allowed range.
        """
        current_date = datetime.now().replace(minute=0)

        if self.meter_inactive is None:
            max_date = current_date
        else:
            max_date = min(self.meter_inactive, current_date)

        # Ensure meter_active is a datetime with time set to 00:00:00
        meter_active_start = datetime.combine(self.meter_active.date(), time.min)

        invalid_dates = self.merged_df[
            (self.merged_df['Start Date (Required)'] < meter_active_start) |
            (self.merged_df['End Date (Required)'] > max_date)
            ]

        if not invalid_dates.empty:
            raise ValueError(
                f"Excel contains entries outside the allowed date range. "
                f"Allowed range: {meter_active_start.strftime('%Y-%m-%d %H:%M')} to {max_date.strftime('%Y-%m-%d %H:%M')}"
            )

    def validate_and_read_excel_sheets(self):
        """
        Validate and read data from Excel sheets, ignoring hidden sheets.

        :raises ValueError: If there are issues with reading or validating the Excel file
        """
        try:
            # If excel_file is a string (file path), open it as a file object
            if isinstance(self.excel_file, str):
                with open(self.excel_file, 'rb') as file:
                    excel_data = file.read()
            else:
                # If it's already a file-like object, read its content
                excel_data = self.excel_file.read()

            # Create a BytesIO object from the excel data
            excel_io = io.BytesIO(excel_data)

            # Load the workbook to check for hidden sheets
            wb = load_workbook(excel_io, read_only=True)
            visible_sheets = [sheet.title for sheet in wb.worksheets if sheet.sheet_state == 'visible']

            # Reset the BytesIO object for pandas to read
            excel_io.seek(0)

            # Read only visible sheets, excluding the 'Reference' sheet
            with pd.ExcelFile(excel_io) as xls:
                all_sheets = {sheet_name: pd.read_excel(xls, sheet_name) for sheet_name in visible_sheets if
                              sheet_name != 'Reference'}
        except Exception as e:
            raise ValueError(f"Error reading Excel file: {str(e)}")

        # Check if any valid sheets were found
        if not all_sheets:
            raise ValueError("The Excel file appears to be empty or unreadable.")

        valid_sheets = []
        invalid_sheets = []

        # Process each sheet
        for sheet_name, df in all_sheets.items():
            if isinstance(df, pd.DataFrame) and not df.empty:
                # Check if all required columns are present
                if all(column in df.columns for column in self.required_columns):
                    valid_sheets.append(sheet_name)
                    df_filtered = df[self.required_columns]  # Select only required columns
                    # Merge data from valid sheets
                    if self.merged_df.empty:
                        self.merged_df = df_filtered
                    else:
                        self.merged_df = pd.concat([self.merged_df, df_filtered], ignore_index=True)
                else:
                    invalid_sheets.append(sheet_name)

        # Raise error if no valid sheets found
        if not valid_sheets:
            raise ValueError(f"No valid sheets found. Invalid sheets: {', '.join(invalid_sheets)}")

        # Raise error if no valid data found
        if self.merged_df.empty:
            raise ValueError("No valid data found in the Excel file.")

        # Convert date columns to datetime
        self.merged_df['Start Date (Required)'] = pd.to_datetime(self.merged_df['Start Date (Required)'])
        self.merged_df['End Date (Required)'] = pd.to_datetime(self.merged_df['End Date (Required)'])

    def check_duplicates(self):
        """
        Check for duplicate entries in the merged DataFrame.

        :raises ValueError: If duplicate entries are found
        """
        # Find duplicate rows based on Start Date and End Date
        duplicates = self.merged_df[
            self.merged_df.duplicated(subset=['Start Date (Required)', 'End Date (Required)'], keep=False)]
        # Raise error if duplicates found
        if not duplicates.empty:
            raise ValueError("Excel file contains duplicate entries")

    def check_overlaps_in_chunk(self, chunk, new_entries):
        """
        Check for overlaps between a chunk of existing data and new entries.

        :param chunk: DataFrame containing a chunk of existing data
        :param new_entries: DataFrame containing new entries to check
        :return: List of overlapping entries
        """
        overlaps = []
        # Convert date columns to datetime
        chunk['start_date'] = pd.to_datetime(chunk['start_date'])
        chunk['end_date'] = pd.to_datetime(chunk['end_date'])

        # Check each new entry against the chunk
        for _, new_row in new_entries.iterrows():
            # Find overlapping entries
            overlap = chunk[
                (chunk['start_date'] < new_row['End Date (Required)']) &
                (chunk['end_date'] > new_row['Start Date (Required)'])
                ]
            if not overlap.empty:
                overlaps.append(new_row)
                break  # Stop checking this row if an overlap is found

        return overlaps

    def get_meter_dates(self):
        """
        Fetch meter_active and meter_inactive dates from the database.
        """
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

    def check_overlaps(self, chunk_size=100000):
        """
        Check for overlaps between new entries and existing database records.

        :param chunk_size: Size of chunks to process at a time
        :raises ValueError: If overlaps are found
        """
        # Get min start date and max end date from new entries
        min_start = self.merged_df['Start Date (Required)'].min()
        max_end = self.merged_df['End Date (Required)'].max()

        # Prepare SQL query to fetch potentially overlapping records
        query = f"""
        SELECT start_date, end_date 
        FROM epp.meter_hourly_entries 
        WHERE start_date <= '{max_end}' AND end_date >= '{min_start}' AND meter_id = {self.meter_id}
        """

        # Fetch data using dbtest function
        df = dbtest(query)

        overlaps = []
        # Use ThreadPoolExecutor for parallel processing
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = []
            # Process database records in chunks
            for i in range(0, len(df), chunk_size):
                chunk = df.iloc[i:i + chunk_size]
                future = executor.submit(self.check_overlaps_in_chunk, chunk, self.merged_df)
                futures.append(future)

            # Collect results
            for future in as_completed(futures):
                overlaps.extend(future.result())

        # Raise error if overlaps found
        if overlaps:
            raise ValueError("Excel file contains entries that overlap with existing database records")

    def validate(self):
        """
        Perform all validation checks on the Excel data.

        :return: Tuple (bool, str) indicating success/failure and error message if any
        """
        try:
            self.validate_and_read_excel_sheets()
            self.check_duplicates()
            self.get_meter_dates()  # Fetch meter dates before validation
            self.validate_date_range()  # New validation step
            self.check_overlaps()
            return True, "File Validated Successfully"  # Return success if all validations pass
        except ValueError as e:
            return False, str(e)  # Return failure with error message for validation errors
        except Exception as e:
            return False, f"Unexpected error: {str(e)}"  # Return failure for unexpected errors

    def create_file_record_in_table(self, file_path):
        values = [self.facility_id, self.meter_id, self.meter_serial_no, self.created_by, file_path]
        query = insert_query_facility_meter_hourly_entries
        return db_execute_single(query, values)

    def process(self):
        """
        Process the Excel file: validate data and insert into the database if valid.

        :return: Dict containing success status, message, file path, and record ID
        """
        valid, error_message = self.validate()
        if valid:
            # If excel_file is a string (file path), open it as a file object
            if isinstance(self.excel_file, str):
                with open(self.excel_file, 'rb') as file:
                    excel_data = file.read()
            else:
                # If it's already a file-like object, read its content and seek to the beginning
                self.excel_file.seek(0)
                excel_data = self.excel_file.read()

            blob_name = generate_blob_name()
            file_path = save_file_to_blob(blob_name, io.BytesIO(excel_data))

            # self.insert_data()  # Insert data into the database
            record_id = self.create_file_record_in_table(file_path)

            return {
                "success": True,
                "message": "File Uploaded Successfully",
                "path": file_path,
                "record_id": record_id
            }
        return {"success": False, "message": error_message}
