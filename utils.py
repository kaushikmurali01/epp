
import uuid
from datetime import datetime

from config import AZURE_CONNECTION_STRING, CONTAINER_NAME

from azure.storage.blob import BlobServiceClient


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
