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
            with concurrent.futures.ThreadPoolExecutor() as executor:
                futures = []
                chunk_set = 10000
                self.data_len += len(df)
                for i in range(0, len(df), chunk_set):
                    chunk = df[i:i + chunk_set]
                    futures.append(
                        executor.submit(self.process_chunk, chunk, df.columns, self.validator, self.iv, self.meter_id))
                concurrent.futures.wait(futures)
                for future in futures:
                    future.result()  # This will raise any exceptions that occurred during processing

            response_message = "File Uploaded Successfully"
            status_code = 200

            if self.data_len != len(self.validator.clean_df[self.validator.clean_df['is_active'] == True]):
                removed_records = self.data_len - len(
                    self.validator.clean_df[self.validator.clean_df['is_active'] == True])
                if len(self.validator.clean_df[self.validator.clean_df['is_active'] == True]) == 0:
                    status_code = 400
                    response_message = f"All the rows had invalid data. So nothing to process."
                else:
                    status_code = 202
                    response_message = f"A few Records were removed while Uploading the data as they had invalid records. {removed_records} Row(s) were removed"

            file_path, record_id = None, None
            if status_code in [200, 202]:
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