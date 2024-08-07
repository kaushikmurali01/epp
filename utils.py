import math
import uuid
from datetime import datetime

from config import AZURE_CONNECTION_STRING, CONTAINER_NAME

from azure.storage.blob import BlobServiceClient

from dbconnection import dbtest
from sql_queries.nearest_weather_stations import nearest_weather_stations


def generate_blob_name(extension="xlsx"):
    # Generate a unique identifier
    unique_id = uuid.uuid4()
    # Get the current timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    # Combine the unique identifier and timestamp
    blob_name = f"{timestamp}_{unique_id}.{extension}"
    return blob_name


def save_file_to_blob(blob_name, file):
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
        blob_client.upload_blob(file_content,
                                overwrite=False)  # Set overwrite to True to replace if it already exists
        blob_url = blob_client.url
        return blob_url

    except Exception as e:
        print(f"Error uploading file to blob storage: {str(e)}")


def haversine(lat1, lon1, lat2, lon2):
    # Convert latitude and longitude from degrees to radians
    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Radius of the Earth in kilometers (use 3956 for miles)
    R = 6371.0

    # Distance in kilometers
    distance = R * c
    return distance


def get_nearest_stations(facility, n=3):
    # Ensure facility_df has at least one row
    query = nearest_weather_stations.format(facility, n)
    station_dataframe = dbtest(query)
    return station_dataframe['station_id'].values
