import pandas as pd
import requests
import io
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import datetime
def clean_dataframe(df):
    # Placeholder cleaning function
    return df

def download_excel(url):
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["HEAD", "GET", "OPTIONS"]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    http = requests.Session()
    http.mount("https://", adapter)
    http.mount("http://", adapter)
    
    try:
        response = http.get(url, timeout=10)
        response.raise_for_status()
        excel_data = io.BytesIO(response.content)
        
        try:
            df = pd.read_excel(excel_data)
            df = clean_dataframe(df)
        except Exception as e:
            #print(f"Error parsing the Excel file from {url}: {e}")
            df = pd.DataFrame()
    except requests.exceptions.RequestException as e:
        #print(f"Error downloading the file from {url}: {e}")
        df = pd.DataFrame()
    
    return df


def fetch_and_combine_data_for_user_facilities(df, facility_id, created_by):
    # Ensure facility_id and created_by are correctly converted to the same type as in the DataFrame
    facility_id = int(facility_id) if facility_id is not None else None
    created_by = float(created_by) if created_by is not None else None

    # Filter the DataFrame based on facility_id, created_by, and is_active
    filtered_df = df[
        (df['facility_id'] == facility_id) & 
        (df['created_by'] == created_by) & 
        (df['is_active'] == 1)
    ]
    
    if filtered_df.empty:
        #print("No data found for the given facility_id and created_by.")
        return {}

    meter_types = filtered_df['meter_type'].unique()
    user_combined_data = {}

    for meter_type in meter_types:
        meter_df = filtered_df[filtered_df['meter_type'] == meter_type]
        combined_df = pd.DataFrame()
        
        if meter_df['purchased_from_the_grid'].any():
            for url in meter_df['media_url']:
                df = download_excel(url)
                
                combined_df = pd.concat([combined_df, df], ignore_index=True)
        
        if 'ReadingDate' in combined_df.columns:
            combined_df['ReadingDate'] = pd.to_datetime(combined_df['ReadingDate'])
            combined_df = combined_df.groupby('ReadingDate', as_index=False).mean()

        # Assign the processed DataFrame to the corresponding meter_type
        user_combined_data[meter_type] = combined_df

    return user_combined_data

