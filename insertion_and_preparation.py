from dbconnection import db_execute
import pandas as pd

def insert_data_to_db(df):
    query = """
    INSERT INTO weather_data (
        longitude, latitude, station_name, climate_id, date_time, year, month, day, time, temp,
        temp_flag, dew_point_temp, dew_point_temp_flag, rel_hum, rel_hum_flag, precip_amount,
        precip_amount_flag, wind_dir, wind_dir_flag, wind_spd, wind_spd_flag, visibility_km,
        visibility_flag, station_press, station_press_flag, hmdx, hmdx_flag, wind_chill,
        wind_chill_flag, weather, station_id, facility_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """
    values = [prepare_data(row) for index, row in df.iterrows()]
    db_execute(query, values)


def prepare_data(row):
    # Replace NaN with None (SQL NULL)
    clean_row = {k: (None if pd.isna(v) else v) for k, v in row.items()}

    # Ensure integer data types
    int_fields = ['Year', 'Month', 'Day', 'Wind Dir (10s deg)', 'Wind Spd (km/h)', 'Hmdx', 'Wind Chill', 'Wind Chill Flag', 'station_id', 'facility_id']
    for field in int_fields:
        clean_row[field] = int(clean_row[field]) if clean_row[field] is not None else None

    # Ensure decimal data types
    decimal_fields = {
        'Longitude (x)': (9, 6),
        'Latitude (y)': (9, 6),
        'Temp (°C)': (5, 2),
        'Dew Point Temp (°C)': (5, 2),
        'Precip. Amount (mm)': (5, 2),
        'Visibility (km)': (5, 2),
        'Stn Press (kPa)': (6, 2)
    }
    for field, (precision, scale) in decimal_fields.items():
        if clean_row[field] is not None:
            clean_row[field] = round(float(clean_row[field]), scale)
    # #print(tuple(clean_row.values()))
    return tuple(clean_row.values())