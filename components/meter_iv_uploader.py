import pandas as pd
from dbconnection import dbtest, db_execute_single
from sql_queries.file_uploader import insert_query_facility_meter_hourly_entries, \
    insert_query_facility_iv_files_table, min_max_data_meter, min_max_data_iv, meter_start_date_end_data
from utils import generate_blob_name, save_file_to_blob


class MeterIVFileUploader:
    def __init__(self, file, facility_id, meter_id, iv, created_by=118, meter_serial_no=00000):
        self.file = file
        self.facility_id = facility_id
        self.meter_id = meter_id
        self.iv = iv
        self.created_by = created_by
        self.meter_serial_no = meter_serial_no

    def create_file_record_in_table(self, file_path):
        values = [self.facility_id, self.meter_id, self.meter_serial_no, self.created_by, file_path]
        query = insert_query_facility_meter_hourly_entries
        return db_execute_single(query, values)

    def create_file_iv_record_in_table(self, file_path):
        values = [self.meter_id, file_path]
        query = insert_query_facility_iv_files_table
        return db_execute_single(query, values)

    @staticmethod
    def validate_uploaded_file_range(file_min, file_max, record_min, record_max):
        # Convert record_min and record_max to datetime
        record_min = pd.to_datetime(record_min)
        record_max = pd.to_datetime(record_max)

        if isinstance(record_min, pd.Series):
            record_min = record_min.iloc[0]  # Get scalar value from Series
        if isinstance(record_max, pd.Series):
            record_max = record_max.iloc[0]  # Get scalar value from Series

            # Ensure extracted values are datetime
        record_min = pd.to_datetime(record_min)
        record_max = pd.to_datetime(record_max)

        # Validate range
        if file_max < record_min or file_min > record_max:
            return "OK", True
        return "Duplicate Data Detected", False

    def validate_file_date(self, file_start, file_end):
        meter_active_date = dbtest(meter_start_date_end_data.format(self.meter_id))
        meter_active_date['meter_active'] = pd.to_datetime(meter_active_date['meter_active'],
                                                           format='%Y-%m-%d %H:%M:%S')
        meter_active_date['meter_inactive'] = pd.to_datetime(meter_active_date['meter_inactive'],
                                                             format='%Y-%m-%d %H:%M:%S')
        if meter_active_date.meter_active[0] > file_start:
            pass

    def process(self):
        try:
            # Read the uploaded Excel file
            df = pd.read_excel(self.file)
            # Check if the required columns are present
            required_columns = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']
            if not all(column in df.columns for column in required_columns):
                return {"error": "Missing required columns"}

            # Convert 'Start Date (Required)' and 'End Date (Required)' to datetime
            df['Start Date (Required)'] = pd.to_datetime(df['Start Date (Required)'], errors='coerce')
            df['End Date (Required)'] = pd.to_datetime(df['End Date (Required)'], errors='coerce')

            file_max = df['Start Date (Required)'].max()
            file_min = df['Start Date (Required)'].min()
            if self.iv:
                query = min_max_data_iv.format(self.facility_id, self.meter_id)
            else:
                query = min_max_data_meter.format(self.facility_id, self.meter_id)
            range_df = dbtest(query)
            range_df = range_df.dropna()
            resource, is_valid = 'OK', True

            if len(range_df):
                range_df['lower_limit'] = pd.to_datetime(range_df['lower_limit']).dt.strftime('%Y-%m-%d %H:%M:%S')
                range_df['upper_limit'] = pd.to_datetime(range_df['upper_limit']).dt.strftime('%Y-%m-%d %H:%M:%S')
                response, is_valid = self.validate_uploaded_file_range(file_min, file_max, range_df['lower_limit'],
                                                                       range_df['upper_limit'])
            if not is_valid:
                return {"success": is_valid, 'error': response}
            self.file.seek(0)  # Ensure file pointer is at the beginning
            blob_name = generate_blob_name()
            file_path = save_file_to_blob(blob_name, self.file)
            if not self.iv:
                record_id = self.create_file_record_in_table(file_path)
            else:
                record_id = self.create_file_iv_record_in_table(file_path)
            return {"success": True, "message": "File Uploaded Successfully", "path": file_path, "record_id": record_id}
        except Exception as e:
            return {"error": str(e)}
