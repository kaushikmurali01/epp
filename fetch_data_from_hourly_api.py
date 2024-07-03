import pandas as pd
import requests
import io
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import datetime
def clean_dataframe(df):
    # Placeholder cleaning function
    return df

def clean_dataframe_idv(df):
    # Drop all columns that are unnamed or not required
    required_columns = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']
    df = df.loc[:, ~df.columns.str.contains('^Unnamed') & df.columns.isin(required_columns)]
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


def fetch_and_combine_data_for_user_facilities(df, facility_id, meter_type):
    # Ensure facility_id and created_by are correctly converted to the same type as in the DataFrame
    facility_id = int(facility_id) if facility_id is not None else None
    meter_type = int(meter_type) if meter_type is not None else None
    # created_by = float(created_by) if created_by is not None else None
    # print("the df coming here is - -  - - -- - - -  -- # # # #  # # # # ##  # # # # # - - -- - - -", df)

    # Filter the DataFrame based on facility_id, created_by, and is_active
    filtered_df = df[
        (df['facility_id'] == facility_id) & 
        (df['meter_type'] == meter_type) &
        (df['is_active'] == 1)
    ]
    filtered_df = filtered_df[:2]
    # print("filtered df is - - -- - -- - -- - - - - -- - - - - -", filtered_df)
    if filtered_df.empty:
        print("No data found for the given facility_id and created_by.")
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



def download_csv(url):
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
        csv_data = io.BytesIO(response.content)
        
        try:
            df = pd.read_csv(csv_data)
            # print(f"Successfully downloaded and read CSV from {url}")
            # print(f"CSV DataFrame shape: {df.shape}")
            df = clean_dataframe_idv(df)
            # print(f"Cleaned DataFrame shape: {df.shape}")
        except Exception as e:
            print(f"Error parsing the CSV file from {url}: {e}")
            df = pd.DataFrame()
    except requests.exceptions.RequestException as e:
        print(f"Error downloading the file from {url}: {e}")
        df = pd.DataFrame()
    
    return df

def fetch_and_combine_data_for_independent_variables(df, variable_id):
    # Filter the DataFrame based on independent_variable_id
    variable_id = int(variable_id)
    filtered_df = df[df['independent_variable_id'] == variable_id]
    print(f"Filtered DataFrame : {filtered_df}")
        
    if filtered_df.empty:
        print("No data found for the given independent_variable_id - {}".format(variable_id))
        return pd.DataFrame()
    
    combined_df = pd.DataFrame()
    
    for url in filtered_df['file_path']:
        df = download_csv(url)
        combined_df = pd.concat([combined_df, df], ignore_index=True)
        print(f"Combined DataFrame shape after processing {url}: {combined_df.shape}")
    
    if 'Start Date (Required)' in combined_df.columns:
        combined_df['Start Date (Required)'] = pd.to_datetime(combined_df['Start Date (Required)'], errors='coerce')
        combined_df = combined_df.groupby('Start Date (Required)', as_index=False).sum()
    print(combined_df)
    return combined_df

