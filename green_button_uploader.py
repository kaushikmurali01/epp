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
        # Use the converted DataFrame directly
        print("in the process \n\n\n\n")
        df = Convert(self.xml_file)
        sum= df['Meter Reading (Required)'].sum()
        print("\nSum:-", sum)
        print("\ndataframe:", df.shape)
        # df = df.drop_duplicates(subset=['Start Date (Required)', 'End Date (Required)',
        #                                 'Meter Reading (Required)'])
        df = df.drop_duplicates(subset=['Start Date (Required)', 'End Date (Required)'])

        try:
            validated_chunks = []
            chunk_size = 50000

            # Set up a ThreadPoolExecutor for parallel processing of chunks
            with concurrent.futures.ThreadPoolExecutor() as executor:
                futures = []

                # Process data in specified chunk sizes
                for i in range(0, len(df), chunk_size):
                    chunk = df.iloc[i:i + chunk_size]
                    futures.append(executor.submit(self.process_chunk, chunk,None, chunk_df=True))
                # Collect results from each future
                for future in concurrent.futures.as_completed(futures):
                    try:
                        chunk_result = future.result()
                        if chunk_result is not None and not chunk_result.empty:
                            validated_chunks.append(chunk_result)
                    except Exception as e:
                        print(f"Error processing chunk: {str(e)}")
                        raise

            # Concatenate all validated chunks into a single DataFrame
            if validated_chunks:
                self.validator.clean_df = pd.concat(validated_chunks, ignore_index=True)

            # Calculate response based on 'is_active' records
            active_records = len(self.validator.clean_df[self.validator.clean_df['is_active'] == True])

            if active_records == 0:
                return {
                    "status_code": 400,
                    "success": False,
                    "message": "All rows contained invalid data; nothing to process."
                }

            # Calculate removed records
            removed_records = len(df) - active_records
            status_code = 200 if removed_records == 0 else 202
            response_message = "File Uploaded Successfully" if removed_records == 0 else \
                f"A few records were removed due to invalid data. {removed_records} row(s) were removed."

            # Save result to blob storage
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

