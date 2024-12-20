import os
import pandas as pd
import concurrent.futures
import psycopg2
from psycopg2 import sql
from io import StringIO
import requests
import csv
from datetime import datetime
import time
from functools import partial
from contextlib import contextmanager

from dbconnection import get_db_connection, dbtest, execute_query
from sql_queries.weather_station_queries import UPDATE_IN_USE

# Adjust these parameters based on your system capabilities
MAX_WORKERS = 100  # Reduced from 10 to 5
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
    'Weather': 'weather',
    'utc_start_date': 'utc_start_date'
}


@contextmanager
def get_db_connection_from_pool():
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()


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
            COPY epp.weather_data_records (longitude, latitude, station_name, climate_id, date_time, year, month, day, time, 
                               temp, temp_flag, dew_point_temp, dew_point_temp_flag, rel_hum, rel_hum_flag, 
                               precip_amount, precip_amount_flag, wind_dir, wind_dir_flag, wind_spd, wind_spd_flag, 
                               visibility_km, visibility_flag, station_press, station_press_flag, hmdx, hmdx_flag, 
                               wind_chill, wind_chill_flag, weather, utc_start_date, station_id)
            FROM STDIN WITH CSV
        """), output)
        conn.commit()
        return f"Uploaded chunk for station {station_id}"
    except Exception as e:
        conn.rollback()
        return f"Error uploading chunk for station {station_id}: {str(e)}"
    finally:
        cur.close()


def upload_chunk_with_retry(chunk, station_id, max_retries=3, initial_delay=1):
    retries = 0
    while retries < max_retries:
        try:
            with get_db_connection_from_pool() as conn:
                return upload_chunk(conn, chunk, station_id)
        except psycopg2.Error as e:
            retries += 1
            if retries == max_retries:
                raise
            time.sleep(initial_delay * (2 ** (retries - 1)))  # Exponential backoff


def process_station(station_id, year, month, day, time_frame, time_zone):
    try:
        url = f"http://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID={station_id}&Year={year}&Month={month}&Day={day}&timeframe={time_frame}&submit=Download+Data"
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        csv_data = StringIO(response.content.decode('utf-8'))
        chunk_reader = pd.read_csv(csv_data)
        chunk_reader['Date/Time (LST)'] = pd.to_datetime(chunk_reader['Date/Time (LST)'], errors='coerce')

        chunk_reader['utc_start_date'] = chunk_reader['Date/Time (LST)'].dt.tz_localize(
            time_zone, ambiguous='NaT', nonexistent='shift_forward').dt.tz_convert('UTC')
        # today_utc = pd.Timestamp.now('UTC').normalize()
        # chunk_reader = chunk_reader[chunk_reader['utc_start_date'].dt.normalize() <= today_utc]

        result = upload_chunk_with_retry(chunk_reader, station_id)

    except requests.RequestException as e:
        print(f"Failed to download data for station {station_id}. Error: {str(e)}")
    except pd.errors.EmptyDataError:
        print(f"Empty CSV file for station {station_id}")
    except Exception as e:
        print(f"Unexpected error processing station {station_id}: {str(e)}")


def main(stations=None, in_use=False):
    start_year = 2018  # You can adjust this as needed
    if stations.empty:
        stations = dbtest(
            """SELECT station_id, timezone 
FROM epp.weather_stations 
WHERE hly_last_year = (SELECT max(hly_last_year) FROM epp.weather_stations) AND in_use = TRUE;
""")
    current_year = datetime.now().year
    current_month = datetime.now().month

    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = []
        for year in range(start_year, current_year + 1):
            for month in range(1, 13):
                if year == current_year and month > current_month:
                    break
                day = 14
                time_frame = 1
                for index, station in stations.iterrows():
                    station_id = station['station_id']
                    station_timezone = station['timezone']
                    print(f"Submitting task for station {station_id}, year {year}, month {month}")
                    futures.append(
                        executor.submit(process_station, station_id, year, month, day, time_frame, station_timezone))
                    time.sleep(0.1)

        for future in concurrent.futures.as_completed(futures):
            print(future.result())
    if in_use:
        station_ids = tuple([station for station in stations['station_id'].values])
        update_query = UPDATE_IN_USE.format(station_ids)
        execute_query(update_query)

    print("\n\n\n\n\n\n\n!!!!!!!!!!!!!!!!!!! Successfully Executed !!!!!!!!!!!!!!!!!!!")


if __name__ == "__main__":
    main()
