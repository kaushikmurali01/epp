import os

import pandas as pd
import concurrent.futures
import psycopg2
from psycopg2 import sql
from io import StringIO
import requests
import csv
from datetime import datetime

from dbconnection import get_db_connection, dbtest

# Adjust these parameters based on your system capabilities
MAX_WORKERS = 50
CHUNK_SIZE = 100000  # Number of rows to process at a time

# Column mapping: CSV column name to database column name
COLUMN_MAPPING = {
    'Longitude (x)': 'longitude',
    'Latitude (y)': 'latitude',
    'Station Name': 'station_name',
    'Climate ID': 'climate_id',
    'Date/Time (LST)': 'date_time',
    'Year': 'year',
    'Month': 'month',
    'Day': 'day',
    'Time (LST)': 'time',
    'Temp (°C)': 'temp',
    'Temp Flag': 'temp_flag',
    'Dew Point Temp (°C)': 'dew_point_temp',
    'Dew Point Temp Flag': 'dew_point_temp_flag',
    'Rel Hum (%)': 'rel_hum',
    'Rel Hum Flag': 'rel_hum_flag',
    'Precip. Amount (mm)': 'precip_amount',
    'Precip. Amount Flag': 'precip_amount_flag',
    'Wind Dir (10s deg)': 'wind_dir',
    'Wind Dir Flag': 'wind_dir_flag',
    'Wind Spd (km/h)': 'wind_spd',
    'Wind Spd Flag': 'wind_spd_flag',
    'Visibility (km)': 'visibility_km',
    'Visibility Flag': 'visibility_flag',
    'Stn Press (kPa)': 'station_press',
    'Stn Press Flag': 'station_press_flag',
    'Hmdx': 'hmdx',
    'Hmdx Flag': 'hmdx_flag',
    'Wind Chill': 'wind_chill',
    'Wind Chill Flag': 'wind_chill_flag',
    'Weather': 'weather'
}


def check_sufficiency(df):
    required_columns = [
        'Temp (°C)', 'Dew Point Temp (°C)', 'Rel Hum (%)',
        'Wind Dir (10s deg)', 'Wind Spd (km/h)', 'Visibility (km)',
        'Stn Press (kPa)', 'Hmdx', 'Wind Chill', 'Weather'
    ]

    total_records = len(df)
    threshold = 0.5  # 50% sufficiency threshold

    for column in required_columns:
        if column not in df.columns:
            print(f"Required column {column} is missing")
            return False

        non_null_count = df[column].count()
        sufficiency_percentage = non_null_count / total_records

        # Uncomment these lines if sufficiency threshold is to be enforced
        # if sufficiency_percentage < threshold:
        #     print(f"Column {column} does not meet sufficiency threshold. Only {sufficiency_percentage:.2%} of data is present")
        #     return False

    return True


def rename_columns(df):
    return df.rename(columns=COLUMN_MAPPING)


def upload_chunk(conn, chunk, station_id):
    cur = conn.cursor()

    # Rename columns and add station_id
    chunk = rename_columns(chunk)
    chunk['station_id'] = station_id

    # Prepare the data for COPY
    output = StringIO()
    chunk.to_csv(output, index=False, header=False, quoting=csv.QUOTE_MINIMAL)
    output.seek(0)

    try:
        cur.copy_expert(sql.SQL("""
            COPY weather_data_records (longitude, latitude, station_name, climate_id, date_time, year, month, day, time, 
                               temp, temp_flag, dew_point_temp, dew_point_temp_flag, rel_hum, rel_hum_flag, 
                               precip_amount, precip_amount_flag, wind_dir, wind_dir_flag, wind_spd, wind_spd_flag, 
                               visibility_km, visibility_flag, station_press, station_press_flag, hmdx, hmdx_flag, 
                               wind_chill, wind_chill_flag, weather, station_id)
            FROM STDIN WITH CSV
        """), output)
        conn.commit()
        return f"Uploaded chunk for station {station_id}"
    except Exception as e:
        conn.rollback()
        return f"Error uploading chunk for station {station_id}: {str(e)}"
    finally:
        cur.close()


def process_station(station_id, year, month, day, time_frame):
    url = f"http://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID={station_id}&Year={year}&Month={month}&Day={day}&timeframe={time_frame}&submit=Download+Data"
    try:
        csv_folder = f"/datadrive/weather_files/{year}/{month}/{station_id}"
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        file_path = os.path.join(csv_folder, f"{station_id}_{year}_{month}.csv")
        with open(file_path, 'wb') as f:
            f.write(response.content)
        csv_data = StringIO(response.content.decode('utf-8'))
        chunk_reader = pd.read_csv(csv_data, chunksize=CHUNK_SIZE)

        conn = get_db_connection()  # Create a new connection for each process
        for chunk in chunk_reader:
            if check_sufficiency(chunk):
                result = upload_chunk(conn, chunk, station_id)
                print(result)
            else:
                print(f"Data chunk for station {station_id} did not pass sufficiency check")

    except requests.RequestException as e:
        print(f"Failed to download data for station {station_id}. Error: {str(e)}")
    except Exception as e:
        print(f"Error processing station {station_id}: {str(e)}")
    finally:
        conn.close()


def main():
    stations = dbtest("SELECT station_id FROM stations")
    current_year = datetime.now().year
    current_month = datetime.now().month

    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = []
        for year in range(2020, 2024 + 1):
            for month in range(1, 13):
                if year == current_year and month > current_month:
                    break
                day = 14
                time_frame = 1
                for station_id in stations['station_id'].values:
                    print(station_id)
                    futures.append(
                        executor.submit(process_station, station_id, year, month, day, time_frame))

        for future in concurrent.futures.as_completed(futures):
            print(future.result())


if __name__ == "__main__":
    main()
