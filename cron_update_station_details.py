import pandas as pd
import numpy as np
from psycopg2.extras import execute_values
from concurrent.futures import ThreadPoolExecutor
import math

from timezonefinder import TimezoneFinder

from dbconnection import get_db_connection, dbtest

column_mapping = {
    'Name': 'name',
    'Province': 'province',
    'Climate ID': 'climate_id',
    'Station ID': 'station_id',
    'WMO ID': 'wmo_id',
    'TC ID': 'tc_id',
    'Latitude (Decimal Degrees)': 'latitude_decimal',
    'Longitude (Decimal Degrees)': 'longitude_decimal',
    'Latitude': 'latitude',
    'Longitude': 'longitude',
    'Elevation (m)': 'elevation_m',
    'First Year': 'first_year',
    'Last Year': 'last_year',
    'HLY First Year': 'hly_first_year',
    'HLY Last Year': 'hly_last_year',
    'DLY First Year': 'dly_first_year',
    'DLY Last Year': 'dly_last_year',
    'MLY First Year': 'mly_first_year',
    'MLY Last Year': 'mly_last_year',
    'timezone': 'timezone',
}


# Read the CSV file
def fetch_dataframe():
    url = 'https://collaboration.cmc.ec.gc.ca/cmc/climate/Get_More_Data_Plus_de_donnees/Station%20Inventory%20EN.csv'
    df = pd.read_csv(url, nrows=0)
    modified_date = df.columns[0]
    year = int(modified_date.split(' ')[2].split('-')[0])
    last_updated = dbtest("select max(hly_last_year) from epp.weather_stations")
    last_updated = int(last_updated['max'].iloc[0])
    if year > last_updated:
        df = pd.read_csv(url, skiprows=[0, 1, 2], on_bad_lines='skip')
        df.rename(columns=column_mapping, inplace=True)
        return df
    else:
        return pd.DataFrame()


def analyze_data(df):
    for column in df.columns:
        print(f"Column: {column}")
        print(f"Data type: {df[column].dtype}")
        print(f"Null values: {df[column].isnull().sum()}")
        print("Sample values:", df[column].head().tolist())
        print("Unique values:", df[column].nunique())
        print("Value counts:")
        print(df[column].value_counts().head())
        print("\n")


def find_problematic_rows(df):
    for column in df.columns:
        if pd.api.types.is_numeric_dtype(df[column]):
            try:
                max_value = df[column].max()
                if pd.notnull(max_value) and max_value > 9223372036854775807:  # max value for BIGINT
                    print(f"Problematic column: {column}")
                    problematic_rows = df[df[column] > 9223372036854775807]
                    print(problematic_rows)
                    print("\n")
            except Exception as e:
                print(f"Error processing column {column}: {e}")
        else:
            print(f"Column {column} is non-numeric. Skipping numeric check.")


def clean_data(df):
    # Replace empty strings, 'NA', 'N/A', etc. with np.nan
    df = df.replace(['', 'NA', 'N/A', 'null', 'NULL', 'NaN'], np.nan)

    # Convert 'tc_id' to string, but keep NaN values
    df['tc_id'] = df['tc_id'].astype('object')

    # Convert numeric columns
    numeric_columns = ['station_id', 'wmo_id', 'latitude_decimal', 'longitude_decimal',
                       'elevation_m', 'first_year', 'last_year', 'hly_first_year',
                       'hly_last_year', 'dly_first_year', 'dly_last_year',
                       'mly_first_year', 'mly_last_year']

    for col in numeric_columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    return df


def get_connection():
    pass


def insert_chunk(chunk):
    conn = get_db_connection()
    cursor = conn.cursor()

    insert_query = """
    INSERT INTO epp.weather_stations (
        name, province, climate_id, station_id, wmo_id, tc_id,
        latitude_decimal, longitude_decimal, latitude, longitude,
        elevation_m, first_year, last_year, hly_first_year, hly_last_year,
        dly_first_year, dly_last_year, mly_first_year, mly_last_year, timezone
    ) VALUES %s
    """

    # Convert DataFrame to list of tuples, replacing NaN with None
    data = [tuple(None if pd.isna(x) else x for x in row) for row in chunk.to_numpy()]

    try:
        execute_values(cursor, insert_query, data)
        conn.commit()
    except Exception as e:
        print(f"Error inserting chunk: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()


def split_dataframe(df, chunk_size=1000):
    chunks = list()
    num_chunks = math.ceil(len(df) / chunk_size)
    for i in range(num_chunks):
        chunks.append(df[i * chunk_size:(i + 1) * chunk_size])
    return chunks


def bulk_get_timezones(df):
    """
    Efficiently process timezone lookups in batches using a single TimezoneFinder instance
    """
    # Create single TimezoneFinder instance
    tf = TimezoneFinder()

    # Pre-filter valid coordinates to avoid unnecessary lookups
    mask = (
            (-90 <= df['latitude_decimal']) &
            (df['latitude_decimal'] <= 90) &
            (-180 <= df['longitude_decimal']) &
            (df['longitude_decimal'] <= 180) &
            df['latitude_decimal'].notna() &
            df['longitude_decimal'].notna()
    )

    # Initialize timezone column with None/NaN
    df['timezone'] = pd.NA

    # Only process valid coordinates
    valid_coords = df[mask]

    # Vectorized timezone lookup
    timezones = [
        tf.timezone_at(lat=lat, lng=lon)
        for lat, lon in zip(valid_coords['latitude_decimal'],
                            valid_coords['longitude_decimal'])
    ]

    # Update only the valid rows
    df.loc[mask, 'timezone'] = timezones

    return df


def get_records_to_process(df):
    existing_station_ids = dbtest('select station_id from epp.weather_stations')
    common_ids = df[df['station_id'].isin(existing_station_ids['station_id'])]
    df_update = df[df['station_id'].isin(common_ids['station_id'])]
    df_create = df[~df['station_id'].isin(common_ids['station_id'])]
    return df_update, df_create


def bulk_insert(df):
    chunks = split_dataframe(df)

    with ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(insert_chunk, chunks)


def update_chunk(chunk):
    conn = get_db_connection()
    cursor = conn.cursor()

    update_query = """
    UPDATE epp.weather_stations
    SET 
        name = data.name, 
        province = data.province,
        climate_id = data.climate_id,
        wmo_id = data.wmo_id,
        tc_id = data.tc_id,
        latitude_decimal = data.latitude_decimal,
        longitude_decimal = data.longitude_decimal,
        latitude = data.latitude,
        longitude = data.longitude,
        elevation_m = data.elevation_m,
        first_year = data.first_year,
        last_year = data.last_year,
        hly_first_year = data.hly_first_year,
        hly_last_year = data.hly_last_year,
        dly_first_year = data.dly_first_year,
        dly_last_year = data.dly_last_year,
        mly_first_year = data.mly_first_year,
        mly_last_year = data.mly_last_year,
        timezone = data.timezone
    FROM (VALUES %s) AS data (
        name, province, climate_id, station_id, wmo_id, tc_id,
        latitude_decimal, longitude_decimal, latitude, longitude,
        elevation_m, first_year, last_year, hly_first_year, hly_last_year,
        dly_first_year, dly_last_year, mly_first_year, mly_last_year, timezone
    )
    WHERE weather_stations.station_id = data.station_id
    """

    # Convert DataFrame to list of tuples, replacing NaN with None
    data = [tuple(None if pd.isna(x) else x for x in row) for row in chunk.to_numpy()]

    try:
        execute_values(cursor, update_query, data, template=None, page_size=100)
        conn.commit()
    except Exception as e:
        print(f"Error updating chunk: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()


def bulk_update(df):
    chunks = split_dataframe(df, chunk_size=1000)
    with ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(update_chunk, chunks)


if __name__ == "__main__":
    """
        This cron job will verify if there have been updates to the station inventory and, 
        if so, synchronize the database with the latest inventory records.
    """
    df = fetch_dataframe()
    if not df.empty:
        print(len(df))
        print("Loading and initial analysis of data...")
        analyze_data(df)
        df = df[pd.notna(df['hly_last_year'])]
        print("\nCleaning data...")
        df = clean_data(df)
        df = bulk_get_timezones(df)

        print("\nAnalysis after cleaning:")
        analyze_data(df)

        print("\nFinding problematic rows...")
        find_problematic_rows(df)

        print("\nStarting bulk insert...")
        update, insert = get_records_to_process(df)
        bulk_insert(insert)
        print("\nBulk insert completed.")
        print("\nStarting bulk update...")
        bulk_update(update)
        print("Bulk update completed.")
