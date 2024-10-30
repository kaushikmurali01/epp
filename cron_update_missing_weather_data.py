import pandas as pd
import concurrent.futures
import psycopg2
from psycopg2 import sql
from io import StringIO
import requests
import csv
import time
from contextlib import contextmanager

from dbconnection import get_db_connection, dbtest, execute_query
from sql_queries.weather_station_queries import UPDATE_IN_USE, MISSING_RECORDS
from update_weather_stations import COLUMN_MAPPING

# Adjust these parameters based on your system capabilities
MAX_WORKERS = 100  # Reduced from 10 to 5
CHUNK_SIZE = 100000  # Number of rows to process at a time

# Column mapping: CSV column name to database column name


@contextmanager
def get_db_connection_from_pool():
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()


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

        upload_chunk_with_retry(chunk_reader, station_id)
        time.sleep(1)  # Add a small delay between chunk uploads

    except requests.RequestException as e:
        print(f"Failed to download data for station {station_id}. Error: {str(e)}")
    except pd.errors.EmptyDataError:
        print(f"Empty CSV file for station {station_id}")
    except Exception as e:
        print(f"Unexpected error processing station {station_id}: {str(e)}")


def main(stations=None, in_use=False):
    missing_data = dbtest(MISSING_RECORDS)
    if missing_data.empty:
        return
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = []
        for index, record in missing_data.iterrows():
            year = record['year']
            month = record['month']
            station_id = record['station_id']
            time_zone = record['timezone']
            day = 14
            time_frame = 1

            print(f"Submitting task for station {station_id}, year {year}, month {month}")
            futures.append(
                executor.submit(process_station, station_id, year, month, day, time_frame, time_zone))
            time.sleep(0.1)

        for future in concurrent.futures.as_completed(futures):
            print(future.result())
    if in_use:
        station_ids = tuple([station for station in stations['station_id'].values])
        update_query = UPDATE_IN_USE.format(station_ids)
        execute_query(update_query)

    print("\n\n\n\n\n\n\n!!!!!!!!!!!!!!!!!!! Successfully Executed !!!!!!!!!!!!!!!!!!!")


if __name__ == "__main__":
    """
    This CRON JOB will look for the missing data and update it in the database i.e 
    if Any station does not have entire data for Year 2020 Month September then this CRON will 
    fetch the data and update the weather data
    """
    main()
