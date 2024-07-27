import threading
import uuid
from datetime import datetime

import pandas as pd

from config import AZURE_CONNECTION_STRING, CONTAINER_NAME
from dbconnection import dbtest, db_execute_single
from sql_queries.file_uploader import min_max_data, insert_query_facility_meter_hourly_entries
from azure.storage.blob import BlobServiceClient


def create_file_record_in_table(facility_id, meter_id, meter_serial_no, created_by, file_path):
    values = [facility_id, meter_id, meter_serial_no, created_by, file_path]
    query = insert_query_facility_meter_hourly_entries
    return db_execute_single(query, values)


def generate_blob_name(extension="xlsx"):
    # Generate a unique identifier
    unique_id = uuid.uuid4()
    # Get the current timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    # Combine the unique identifier and timestamp
    blob_name = f"{timestamp}_{unique_id}.{extension}"
    return blob_name


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


def save_file_to_blob(file, blob_name):
    try:
        # Initialize the BlobServiceClient
        blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)
        container_client = blob_service_client.get_container_client(CONTAINER_NAME)

        # Ensure the container exists
        if not container_client.exists():
            container_client.create_container()

        # Create a BlobClient
        blob_client = container_client.get_blob_client(blob_name)

        # Convert FileStorage to bytes
        file_content = file.read()

        # Upload the file to the blob
        blob_client.upload_blob(file_content, overwrite=True)  # Set overwrite to True to replace if it already exists
        print(f"File {blob_name} uploaded successfully.")
        print(f"File uploaded to blob storage as {blob_name}")
        blob_url = blob_client.url
        return blob_url

    except Exception as e:
        print(f"Error uploading file to blob storage: {str(e)}")


def process_excel(file, facility_id, meter_id, created_by=118, meter_serial_no=00000):
    try:
        # Read the uploaded Excel file
        df = pd.read_excel(file)
        # Check if the required columns are present
        required_columns = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']
        if not all(column in df.columns for column in required_columns):
            return {"error": "Missing required columns"}

        # Convert 'Start Date (Required)' and 'End Date (Required)' to datetime
        df['Start Date (Required)'] = pd.to_datetime(df['Start Date (Required)'], errors='coerce')
        df['End Date (Required)'] = pd.to_datetime(df['End Date (Required)'], errors='coerce')

        file_max = df['Start Date (Required)'].max()
        file_min = df['Start Date (Required)'].min()

        range_df = dbtest(min_max_data.format(facility_id, meter_id))
        range_df['lower_limit'] = pd.to_datetime(range_df['lower_limit']).dt.strftime('%Y-%m-%d %H:%M:%S')
        range_df['upper_limit'] = pd.to_datetime(range_df['upper_limit']).dt.strftime('%Y-%m-%d %H:%M:%S')
        response, is_valid = validate_uploaded_file_range(file_min, file_max, range_df['lower_limit'],
                                                          range_df['upper_limit'])
        # if not is_valid:
        #     return {"success": is_valid, 'error': response}
        file.seek(0)  # Ensure file pointer is at the beginning
        blob_name = generate_blob_name()
        file_path = save_file_to_blob(file, blob_name)
        record_id = create_file_record_in_table(facility_id, meter_id, meter_serial_no, created_by, file_path)
        return {"success": True, "message": "File Uploaded Successfully", "path": file_path, "record_id": record_id}
    except Exception as e:
        return {"error": str(e)}
