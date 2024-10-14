import concurrent
from concurrent.futures import ThreadPoolExecutor
import io

import pandas as pd

from components.green_button import Convert
from meter_uploader import DataUploader
from utils import generate_blob_name, save_file_to_blob


class GreenDataUploader(DataUploader):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def process(self):
        try:
            df = Convert(self.xml_file)
            initial_data_length = len(df)  # Store the initial length of data for comparison later
            chunk_size = 10000  # Consistent with process_excel
            self.data_len = initial_data_length  # Record initial data length

            with ThreadPoolExecutor() as executor:
                futures = []
                for i in range(0, len(df), chunk_size):
                    chunk = df[i:i + chunk_size]
                    futures.append(executor.submit(self.validator.validate_chunk,
                                                   chunk))  # Assuming validate_chunk will return cleaned data

                concurrent.futures.wait(futures)
                validated_data = pd.concat([future.result() for future in futures])  # Concatenate results

            if validated_data.empty:
                raise ValueError("No valid data to process after validation.")

            csv_buffer = io.BytesIO()
            validated_data.to_csv(csv_buffer, index=False)
            csv_buffer.seek(0)

            blob_name = generate_blob_name(extension='csv')
            file_path = save_file_to_blob(blob_name, csv_buffer)
            record_id = self.create_file_record_in_table(file_path)

            removed_records = initial_data_length - len(validated_data)
            if len(validated_data) == 0:
                status_code = 400
                response_message = "All the rows had invalid data. So nothing to process."
            elif removed_records > 0:
                status_code = 202
                response_message = f"A few Records were removed while uploading the data as they had invalid records. {removed_records} Row(s) were removed"
            else:
                status_code = 200
                response_message = "File Uploaded Successfully"

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
