import io
from datetime import datetime, time
from openpyxl import load_workbook
from dbconnection import db_execute_single, dbtest  # Assuming this handles batch insert
from sql_queries.file_uploader import insert_query_facility_meter_hourly_entries
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

    def get_meter_dates(self):
        query = f"""
        SELECT meter_active, meter_inactive 
        FROM epp.facility_meter_detail 
        WHERE id = {self.meter_id}
        """
        df = dbtest(query)
        if df.empty:
            raise ValueError(f"No meter details found for meter_id {self.meter_id}")
        return df.iloc[0]['meter_active'], df.iloc[0]['meter_inactive']

    def validate_date_range(self, start_date, end_date, meter_active, max_date):
        return not (start_date < meter_active or end_date > max_date)

    def process(self):
        try:
            excel_data = self.excel_file.read()  # Read the file content
            excel_io = io.BytesIO(excel_data)
            wb = load_workbook(excel_io, read_only=True)
            meter_active, meter_inactive = self.get_meter_dates()
            current_date = datetime.now().replace(minute=0, second=0, microsecond=0)
            max_date = min(meter_inactive, current_date) if meter_inactive else current_date

            batch_data = []
            for sheet in wb:
                if sheet.sheet_state != 'visible':
                    continue
                headers = next(sheet.iter_rows(values_only=True))
                idx_map = {v: i for i, v in enumerate(headers) if v in self.required_columns}
                if len(idx_map) != len(self.required_columns):
                    continue  # Skip sheet if required columns are missing

                for row in sheet.iter_rows(values_only=True):
                    start_date_str = row[idx_map['Start Date (Required)']]
                    end_date_str = row[idx_map['End Date (Required)']]
                    meter_reading = row[idx_map['Meter Reading (Required)']]

                    try:
                        start_date = datetime.strptime(start_date_str, "%Y-%m-%d %H:%M:%S")
                        end_date = datetime.strptime(end_date_str, "%Y-%m-%d %H:%M:%S")
                        if self.validate_date_range(start_date, end_date, meter_active, max_date):
                            batch_data.append((self.facility_id, self.meter_id, self.meter_serial_no, start_date,
                                               end_date, meter_reading, self.created_by))
                    except Exception as e:
                        continue  # Log or handle error appropriately

            # Batch insert to the database
            if batch_data:
                db_execute_single(insert_query_facility_meter_hourly_entries, batch_data)

            # Store file to a blob storage after processing
            blob_name = generate_blob_name()
            file_path = save_file_to_blob(blob_name, io.BytesIO(excel_data))
            return {"success": True, "message": "File processed and uploaded successfully", "path": file_path}

        except Exception as e:
            return {"success": False, "message": str(e)}

# Example usage:
# uploader = BaseDataUploader(file, 123, 456, False)
# result = uploader.process()
# print(result)
