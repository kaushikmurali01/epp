import requests
import os
import pandas as pd
from insertion_and_preparation import insert_data_to_db


def download_weather_data(start_year, start_month, end_year, end_month, station_ids, facility_id):
    time_frame = 1  # Assuming time_frame is always 1
    temp_folder = os.getenv('TEMP')
    # temp_folder = 'TEMP'
    csv_folder = os.path.join(temp_folder, 'CSV Files')

    if not os.path.exists(csv_folder):
        os.makedirs(csv_folder)

    y, m = start_year, start_month
    total = (end_year - start_year) * 12 + (12 - start_month) + end_month - 10

    i = 0
    all_dataframes = []  # List to hold DataFrames

    while y <= end_year:
        for station_id in station_ids:
            url = f"http://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID={station_id}&Year={y}&Month={m}&Day=14&timeframe={time_frame}&submit=Download+Data"
            response = requests.get(url)

            if response.status_code == 200:
                file_path = os.path.join(csv_folder, f"{station_id}_{y}_{m}.csv")
                with open(file_path, 'wb') as f:
                    f.write(response.content)
                print(f"Downloaded {file_path}")
                
                # Read the downloaded CSV file into a DataFrame
                df = pd.read_csv(file_path)
                df['station_id'] = station_id  # Add a column for the station ID
                all_dataframes.append(df)  # Add the DataFrame to the list
            else:
                print(f"Failed to download data for station {station_id} in {y}/{m}")

        m += 1
        if m > 12:
            y += 1
            m = 1

        i += 1
        # print(f"Progress: Download {i} out of {total} files")

        if y > end_year or (y == end_year and m > end_month):
            break

    # Concatenate all DataFrames into a single DataFrame
    consolidated_df = pd.concat(all_dataframes, ignore_index=True)
    consolidated_df['facility_id'] = facility_id
    return consolidated_df


def download_and_load_data(start_year, start_month, end_year, end_month, station_ids, facility_id):
    consolidated_df = download_weather_data(start_year, start_month, end_year, end_month, station_ids,facility_id)
    insert_data_to_db(consolidated_df)