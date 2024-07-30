from flask import Flask, jsonify, request
import json
import pandas as pd
from download_weather_data import download_and_load_data
import math
from dbconnection import dbtest
from fetch_data_from_hourly_api import fetch_and_combine_data_for_user_facilities
from sql_queries.nearest_weather_stations import nearest_weather_stations, min_max_date_query

app = Flask(__name__)








if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=5001)
