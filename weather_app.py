from flask import Flask, jsonify, request
import json
import pandas as pd
from download_weather_data import download_and_load_data
import math
from dbconnection import dbtest
from fetch_data_from_hourly_api import fetch_and_combine_data_for_user_facilities

app = Flask(__name__)


def haversine(lat1, lon1, lat2, lon2):
    # Convert latitude and longitude from degrees to radians
    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Radius of the Earth in kilometers (use 3956 for miles)
    R = 6371.0

    # Distance in kilometers
    distance = R * c
    return distance


def get_nearest_stations(facility_df, stations_df, n=3):
    # Ensure facility_df has at least one row
    if facility_df.empty:
        raise ValueError("facility_df must contain at least one row")

    # Extract facility coordinates (using the first row)
    facility_lat = float(facility_df.iloc[0]['latitude'])
    facility_lon = float(facility_df.iloc[0]['longitude'])

    # Reset the index of the stations_df to ensure indices are sequential
    stations_df.reset_index(drop=True, inplace=True)

    # Calculate distances and store them in a list of tuples (distance, index)
    distances = []
    for index, row in stations.iterrows():
        distance = haversine(facility_lat, facility_lon, float(row['latitude']), float(row['longitude']))
        distances.append((distance, index))

    # Sort the list by distance
    distances.sort()

    # Get the nearest n stations
    nearest_stations_indices = [index for _, index in distances[:n]]
    nearest_stations = stations.iloc[nearest_stations_indices]

    # Return the array of station IDs
    return nearest_stations['station_id'].values


stations = dbtest("select station_id,latitude, longitude, station_name from stations")


@app.route('/insert_weather_data', methods=['POST'])
def process():
    start_year = request.json.get('start_year')
    start_month = request.json.get('start_month')
    end_year = request.json.get('end_year')
    facility_id = request.json.get('facility_id')
    end_month = request.json.get('end_month')

    facility = dbtest("select id, latitude, longitude from epp.facility")
    print("Facility data is -  - - - - - -- - -- -  -- - - -- ", facility.columns)
    print(facility[facility['id'] == 24])
    facility_df = facility[facility['id'] == int(facility_id)]
    # Get nearest 3 stations
    nearest_station_ids = get_nearest_stations(facility_df, stations)
    print(nearest_station_ids)
    consolidated_df = download_and_load_data(int(start_year), int(start_month), int(end_year), int(end_month),
                                             nearest_station_ids, int(facility_id))

    return {"message": "Data inserted Succefully"}, 200


@app.route('/get_station_details', methods=['GET'])
def getdata():
    facility = request.args.get('facility_id')
    df = dbtest(
        f'SELECT DISTINCT station_name , latitude, longitude, climate_id, station_id FROM epp.weather_data WHERE facility_id = {facility}')
    df_con = df.to_dict(orient='records')
    return jsonify(df_con), 200


@app.route('/get_min_max_dates', methods=['GET'])
def getdates():
    df = dbtest('''SELECT distinct hme.facility_id, fmd.meter_type AS meter_type, hme.meter_id,
                          hme.created_by, hme.media_url, fmd.purchased_from_the_grid, fmd.is_active
                   FROM epp.facility_meter_hourly_entries hme
                   JOIN epp.facility_meter_detail fmd
                   ON hme.facility_meter_detail_id = fmd.id;''')

    facility_id = request.args.get('facility_id')
    meter_type = request.args.get('meter_type')
    print(type(facility_id))
    print(type(meter_type))
    user_combined_data = fetch_and_combine_data_for_user_facilities(df, facility_id, meter_type)
    print(user_combined_data)
    min_date = None
    max_date = None

    for key, data in user_combined_data.items():
        min_date = data['Start Date (Required)'].min() if min_date is None else min(min_date, data['Start Date (Required)'].min())
        max_date = data['Start Date (Required)'].max() if max_date is None else max(max_date, data['Start Date (Required)'].max())

    result = {
        "min_date": min_date,
        "max_date": max_date
    }

    return jsonify(result), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=5002)
