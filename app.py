import json
import time
from _decimal import Decimal
from threading import Thread

import numpy as np
from flask import Flask, jsonify, request, render_template_string
import pandas as pd
from flask_cors import CORS
from components.dataCleaner import clean_raw_data
from components.add_file_data_to_table import AddMeterData

from green_button_uploader import GreenDataUploader
from meter_uploader import DataUploader
from sql_queries.baseline_performance_calc import BASELINE_OBSERVED_PREDICTED, PERFORMANCE_OBSERVED_PREDICTED, COMBINED
from sql_queries.data_cleaning import get_data_cleaning_query
from sql_queries.data_exploration_queries import OUTLIER_SETTING
from sql_queries.graph import get_graph_query
from sql_queries.iv import INDEPENDENT_VARIABLE_QUERY
from sql_queries.sufficiency_queries import sufficiencies_hourly, IV_sufficiencies_hourly, \
    sufficiency_daily, IV_sufficiency_daily, sufficiencies_monthly, IV_sufficiencies_monthly, sufficiencie_thershold, \
    date_raneg_query
from constants import IV_FACTOR, METER_FACTOR, EXPORT_MESSAGE
from data_exploration import DataExploration
from data_eploration_summary import DataExplorationSummary
from data_exploration_v2 import DataExplorationSummaryV2
from download_weather_data import download_and_load_data
from issue_detection import detect_issues, handle_issues
from paginator import Paginator
from sql_queries.file_uploader import delete_file_query, STATUS_UPLOADER_INTIMATION_IV, STATUS_UPLOADER_INTIMATION_METER
from sql_queries.weather_station_queries import min_max_date_query, min_max_meter_date_query, weather_data_query, \
    min_max_date_query_iv, min_max_general, min_max_performance, get_base_line_min_max
from summarize_data import summarize_data
from fetch_data_from_hourly_api import fetch_and_combine_data_for_user_facilities, \
    fetch_and_combine_data_for_independent_variables
from dbconnection import dbtest, execute_query, db_execute_single
from utils import get_nearest_stations, get_timezone, get_utc_dates, export_data, get_paginated_data, delete_blob
from visualization.data_exploration import DataExplorationVisualisation
from visualization.visualize_line_graph import DataVisualizer
from datetime import datetime

app = Flask(__name__)
CORS(app)


@app.route('/handle', methods=['GET'])
def return_summary():
    # Fetch the DataFrame from the database
    df = dbtest('''SELECT distinct hme.facility_id, fmd.meter_type AS meter_type, hme.meter_id,
                          hme.created_by, hme.media_url, fmd.purchased_from_the_grid, fmd.is_active
                   FROM epp.facility_meter_hourly_entries hme
                   JOIN epp.facility_meter_detail fmd
                   ON hme.facility_meter_detail_id = fmd.id;''')

    granularity = request.json.get('granularity', '')
    start_date = request.json.get('start_date', '')
    end_date = request.json.get('end_date', '')
    page = int(request.json.get('page', 1))
    page_size = int(request.json.get('page_size', 100))
    facility_id = request.json.get('facility_id', '')
    meter_type = request.json.get('meter_type', '')

    # Debugging statements to check the received parameters
    # print("facility_id:", facility_id)
    # print("created_by:", created_by)

    user_combined_data = fetch_and_combine_data_for_user_facilities(df, facility_id, meter_type)

    # TODO for mat this dataframe and Return
    # Debugging statement to check user_combined_data
    print("User combined data:\n", user_combined_data)

    if not user_combined_data:
        # print("user_combined_data is empty after fetching and combining data")
        return jsonify({'error': 'No data available for the given parameters'}), 400

    weather_df = dbtest('SELECT * FROM epp.weather_data')
    print("weather df is -- - - - - -- - - -- -- - - -- - - - -- -", weather_df)
    results = {}
    # #print("weather_df is  - - - -- - - -- - -- - -- -- - ", weather_df)
    for meter_type, raw_df in user_combined_data.items():
        if raw_df.empty:
            print(f"raw_df is empty for meter_type {meter_type}")
            continue

        if start_date and end_date:
            start_date = pd.to_datetime(start_date)
            end_date = pd.to_datetime(end_date)

            # Ensure that date columns are in datetime format
            raw_df['ReadingDate'] = pd.to_datetime(raw_df['ReadingDate'])
            weather_df['date_time'] = pd.to_datetime(weather_df['date_time'])

            # Filter data based on the date range
            raw_df = raw_df[(raw_df['ReadingDate'] >= start_date) & (raw_df['ReadingDate'] <= end_date)]
            weather_df = weather_df[(weather_df['date_time'] >= start_date) & (weather_df['date_time'] <= end_date)]

        # Debugging statements after filtering
        # print(f"Filtered raw_df for meter_type {meter_type}:\n", raw_df)
        # print(f"Filtered weather_df:\n", weather_df)

        summary, sufficiency = summarize_data(raw_df, weather_df, granularity)

        summary_dict = summary.to_dict(orient='records')  # Convert DataFrame to list of dicts for JSON serialization
        # Implement pagination
        total_records = len(summary_dict)
        total_pages = (total_records + page_size - 1) // page_size  # Calculate total pages
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_summary = summary_dict[start_idx:end_idx]

        results[str(meter_type)] = {
            'summary': paginated_summary,
            'total_records': total_records,
            'page': page,
            'page_size': page_size,
            'total_pages': total_pages,
            'has_prev': page > 1,
            'has_next': page < total_pages
        }

        results[str(meter_type)] = {
            'summary': summary_dict
        }

    return jsonify(results), 200


@app.route('/check_issues', methods=['POST'])
def check_issues():
    # Fetch the DataFrame from the database
    df = dbtest('''SELECT distinct hme.facility_id, fmd.meter_type AS meter_type, hme.meter_id,
                          hme.created_by, hme.media_url, fmd.purchased_from_the_grid, fmd.is_active
                   FROM epp.facility_meter_hourly_entries hme
                   JOIN epp.facility_meter_detail fmd
                   ON hme.facility_meter_detail_id = fmd.id;''')

    granularity = request.form.get('granularity', 'hourly')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    facility_id = request.form.get('facility_id')
    created_by = request.form.get('created_by')

    # Debugging statements to check the received parameters
    # print("facility_id:", facility_id)
    # print("created_by:", created_by)

    user_combined_data = fetch_and_combine_data_for_user_facilities(df, facility_id, created_by)

    # Debugging statement to check user_combined_data
    print("User combined data:\n", user_combined_data)

    if not user_combined_data:
        # print("user_combined_data is empty after fetching and combining data")
        return jsonify({'error': 'No data available for the given parameters'}), 400

    # weather_file = request.files['weather_file']
    # weather_df = pd.read_csv(weather_file)
    weather_df = dbtest('SELECT * FROM epp.weather_data')
    print("weather df is -- - - - - -- - - -- -- - - -- - - - -- -", weather_df)
    results = {}
    # #print("weather_df is  - - - -- - - -- - -- - -- -- - ", weather_df)
    for meter_type, raw_df in user_combined_data.items():
        if raw_df.empty:
            print(f"raw_df is empty for meter_type {meter_type}")
            continue

        if start_date and end_date:
            start_date = pd.to_datetime(start_date)
            end_date = pd.to_datetime(end_date)

            # Ensure that date columns are in datetime format
            raw_df['ReadingDate'] = pd.to_datetime(raw_df['ReadingDate'])
            weather_df['date_time'] = pd.to_datetime(weather_df['date_time'])

            # Filter data based on the date range
            raw_df = raw_df[(raw_df['ReadingDate'] >= start_date) & (raw_df['ReadingDate'] <= end_date)]
            weather_df = weather_df[(weather_df['date_time'] >= start_date) & (weather_df['date_time'] <= end_date)]

        # Debugging statements after filtering
        # print(f"Filtered raw_df for meter_type {meter_type}:\n", raw_df)
        # print(f"Filtered weather_df:\n", weather_df)

        summary, sufficiency = summarize_data(raw_df, weather_df, granularity)

        # Detect issues in the summarized data
        issues = detect_issues(summary)
        results[str(meter_type)] = {
            'issues': issues
        }

    return jsonify(results), 200


@app.route('/date_range', methods=['GET'])
def get_date_range():
    facility_id = request.args.get('facility_id', type=int)
    if facility_id is None:
        return jsonify({"error": "facility_id is required"}), 400

    is_independent_variable = request.args.get('is_independent_variable', default=False, type=bool)
    date_ranege = date_raneg_query.format(facility_id=facility_id, is_independent_variable=is_independent_variable)
    date_raneg_df = dbtest(date_ranege)
    response = {
        "start_date": date_raneg_df['start_date'].tolist()[0] if not date_raneg_df['start_date'].empty else None,
        "end_date": date_raneg_df['end_date'].tolist()[0] if not date_raneg_df['start_date'].empty else None,
    }
    return jsonify(response)


@app.route('/check_sufficiency', methods=['POST'])
def get_sufficiency():
    facility_id = request.json.get('facility_id')
    s_d = start_date = request.json.get('start_date')
    e_d = end_date = request.json.get('end_date')
    IVs = request.json.get('independent_variables', [])

    # Check if all required parameters are present
    if not all([facility_id, start_date, end_date]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    hourly_query = sufficiencies_hourly
    daily_query = sufficiency_daily
    monthly_query = sufficiencies_monthly

    IVids = ""
    if len(IVs) > 0:
        hourly_query = IV_sufficiencies_hourly
        daily_query = IV_sufficiency_daily
        monthly_query = IV_sufficiencies_monthly
        IVids = f"AND  is_independent_variable = true AND independent_variable_id IN {'(' + ','.join(map(str, tuple(IVs))) + ')'} AND reading>= 0"

    # Modify the query with the provided parameters
    sufficiencies_hourly_query = hourly_query.format(start_date=s_d, end_date=e_d, facility_id=facility_id, IVids=IVids)
    sufficiency_daily_query = daily_query.format(start_date=s_d, end_date=e_d, facility_id=facility_id, IVids=IVids)
    sufficiencies_monthly_query = monthly_query.format(start_date=s_d, end_date=e_d, facility_id=facility_id,
                                                       IVids=IVids)
    sufficiencies_hourly_df = dbtest(sufficiencies_hourly_query)
    sufficiency_daily_df = dbtest(sufficiency_daily_query)
    sufficiencies_monthly_df = dbtest(sufficiencies_monthly_query)
    sufficiencies_monthly_df_sorted = sufficiencies_monthly_df.sort_values(by='mm')
    # Calculate sufficiency percentages
    # hourly, daily, monthly, monthly_data = calculate_sufficiency(df, start_date, end_date, IVs)
    monthley_sufficiency = sufficiencies_monthly_df['value'].tolist()
    monthley_sufficiency_pass = round(sufficiencies_monthly_df['value'].mean(), 2)
    total_days = (end_date - start_date).days
    query_thershold = sufficiencie_thershold.format(facility_id=facility_id)
    query_thershold_output = dbtest(query_thershold)
    hourly_thershold = query_thershold_output['hourly'].tolist()[0] if not query_thershold_output[
        'hourly'].empty else 90
    daily_thershold = query_thershold_output['daily'].tolist()[0] if not query_thershold_output['daily'].empty else 90
    monthly_thershold = query_thershold_output['monthly'].tolist()[0] if not query_thershold_output[
        'monthly'].empty else 90
    for a in monthley_sufficiency:
        if (a < monthly_thershold):
            monthley_sufficiency_pass = 10
    response = {
        "daily": {"sufficiency": sufficiency_daily_df['percentage'].tolist()[0] if
        sufficiency_daily_df['percentage'].tolist()[0] != None else 0,
                  "status": get_status(sufficiency_daily_df['percentage'].tolist()[0], total_days, daily_thershold),
                  "threshold": daily_thershold},
        "hourly": {"sufficiency": sufficiencies_hourly_df['percentage'].tolist()[0],
                   "status": get_status(sufficiencies_hourly_df['percentage'].tolist()[0], total_days,
                                        hourly_thershold), "threshold": hourly_thershold},
        "monthly": {
            "sufficiency": monthley_sufficiency_pass,
            "status": get_status(monthley_sufficiency_pass, total_days, monthly_thershold),
            "data": sufficiencies_monthly_df_sorted[['value', 'month']].to_dict(orient='records'),
            "threshold": monthly_thershold
        }
    }
    return jsonify(response)


def get_status(sufficiency, total_days, limit):
    return "passed" if (sufficiency != None and sufficiency > limit and total_days >= 364) else "failed"


@app.route("/get_weather_data", methods=['GET'])
def weather_data():
    facility = request.args.get('facility_id')
    station = request.args.get('station_id')
    if facility:
        facility = int(facility)
    if station:
        station = int(station)
    if not facility:
        response = {"success": False, 'error': "Please Provide Facility ID"}
        return jsonify(response), 400
    if not station:
        response = {"success": False, 'error': "Please Provide Station ID"}
        return jsonify(response), 400
    station_ids = get_nearest_stations(facility)
    station_id_list = None
    if not station_ids.empty:
        station_id_list = [int(station_id) for station_id in station_ids.station_id.values]
        print(station_id_list, station)
    if station not in station_id_list:
        response = {"success": False, 'error': "Please Provide Valid Station ID"}
        return jsonify(response), 400
    min_max_date = dbtest(min_max_general.format(facility))
    min_max_date = min_max_date.dropna()
    if len(min_max_date):
        min_date = min_max_date.min_date[0].strftime('%Y-%m-%d %H:%M:%S')
        max_date = min_max_date.max_date[0].strftime('%Y-%m-%d %H:%M:%S')
    else:
        response = {"success": False, 'error': "Insufficient Data"}
        return jsonify(response), 404

    if station:
        formatted_query = weather_data_query.format(station, min_date, max_date)
        df = dbtest(formatted_query)
        return df.to_dict(orient='records'), 200
    else:
        return jsonify({'success': False, 'error': 'Insufficient Data'}), 404


@app.route('/insert_clean_data', methods=['POST'])
def clean_data():
    # Fetch the DataFrame from the database
    df = dbtest('''SELECT distinct hme.facility_id, fmd.meter_type AS meter_type, hme.meter_id,
                          hme.created_by, hme.media_url, fmd.purchased_from_the_grid, fmd.is_active
                   FROM epp.facility_meter_hourly_entries hme
                   JOIN epp.facility_meter_detail fmd
                   ON hme.facility_meter_detail_id = fmd.id;''')

    granularity = request.json.get('granularity', 'hourly')
    start_date = request.json.get('start_date', '')
    end_date = request.json.get('end_date', '')
    facility_id = request.json.get('facility_id', '')
    meter_type = request.json.get('meter_type', '')
    independent_variables = request.json.get('independent_variables', '')

    # Debugging statements to check the received parameters
    # print("facility_id:", facility_id)
    # print("created_by:", created_by)

    user_combined_data = fetch_and_combine_data_for_user_facilities(df, facility_id, meter_type)

    # Debugging statement to check user_combined_data
    print("User combined data:\n", user_combined_data)

    if not user_combined_data:
        # print("user_combined_data is empty after fetching and combining data")
        return jsonify({'error': 'No data available for the given parameters'}), 400

    weather_df = dbtest(f'SELECT * FROM epp.weather_data where facility_id = {facility_id}')

    # print("weather df is -- - - - - -- - - -- -- - - -- - - - -- -", weather_df)
    results = {}
    # #print("weather_df is  - - - -- - - -- - -- - -- -- - ", weather_df)
    for meter_type, raw_df in user_combined_data.items():
        if raw_df.empty:
            print(f"raw_df is empty for meter_type {meter_type}")
            continue

        if start_date and end_date:
            start_date = pd.to_datetime(start_date)
            end_date = pd.to_datetime(end_date)

            # Ensure that date columns are in datetime format
            raw_df['Start Date (Required)'] = pd.to_datetime(raw_df['Start Date (Required)'])
            weather_df['date_time'] = pd.to_datetime(weather_df['date_time'])

            # Filter data based on the date range
            raw_df = raw_df[
                (raw_df['Start Date (Required)'] >= start_date) & (raw_df['Start Date (Required)'] <= end_date)]
            weather_df = weather_df[(weather_df['date_time'] >= start_date) & (weather_df['date_time'] <= end_date)]

        # Debugging statements after filtering
        # print(f"Filtered raw_df for meter_type {meter_type}:\n", raw_df)
        # print(f"Filtered weather_df:\n", weather_df)

        summary, sufficiency = summarize_data(raw_df, weather_df, granularity)
        if independent_variables:
            summary = summary[pd.notna(summary['Temperature'])]
            # summary.to_csv("ctyghujihgftgyhu.csv")
            issues = detect_issues(summary)
            summary.rename(columns={'Date': 'Start Date (Required)'}, inplace=True)

            for variable_id in independent_variables:
                print("variable_id coming is - -- - - - --  -- - - - - - ", variable_id)
                idv = dbtest(
                    f'select distinct iv.facility_id, iv.id as independent_variable_id,iv.name as independent_variable_name, ivf.file_path from independent_variable iv join independent_variable_file ivf on iv.id = ivf.independent_variable_id where iv.facility_id = {facility_id} and iv.id = {variable_id}')
                print("independent variable dataframe is - - - - - --- - -- -  - - -", idv)
                variable_data = fetch_and_combine_data_for_independent_variables(idv, variable_id)
                print("independent variable dataframe after processing is - - - - - --- - -- -  - - -", variable_data)
                variable_data['Start Date (Required)'] = pd.to_datetime(variable_data['Start Date (Required)'])
                if start_date and end_date:
                    start_date = pd.to_datetime(start_date)
                    end_date = pd.to_datetime(end_date)

                    # Ensure that date columns are in datetime format
                    variable_data['Start Date (Required)'] = pd.to_datetime(variable_data['Start Date (Required)'])

                    # Filter data based on the date range
                    variable_data = variable_data[(variable_data['Start Date (Required)'] >= start_date) & (
                            variable_data['Start Date (Required)'] <= end_date)]
                    print("variable_data after filtering is  - - -- - -- - - - - - - -- - - - - - -", variable_data)

                variable_data['Start Date (Required)'] = pd.to_datetime(variable_data['Start Date (Required)'])
                # Step 2: Set this column as the index
                variable_data.set_index('Start Date (Required)', inplace=True)

                # Step 3: Resample the data on an hourly basis and summarize the "Meter Reading (Required)" column
                hourly_data = variable_data['Meter Reading (Required)'].resample('H').sum()
                print("hourly data is 0- 0 -0 -0 - 0-0 - 0- 0 -0 - - -- - - -  - -- - -- - - - ", hourly_data)
                # hourly_data.to_csv("hourly_data.csv")
                variable_name = str(idv['independent_variable_id'][0])
                print("variable name is- --  -- -###################################################33", variable_name)
                hourly_data.name = variable_name
                hourly_data_df = hourly_data.to_frame(name=variable_name)
                print("hourly_data_df", hourly_data_df)
                summary = pd.merge(summary, hourly_data_df, on='Start Date (Required)')
                # summary = summary.join(hourly_data_df, how='outer')
                print("The df after combining the independent variable is - - -  -- - - - - - - -- -   - ",
                      summary.columns)
            summary.rename(columns={'Start Date (Required)': 'Date'}, inplace=True)

            def checker(weather_df):
                if weather_df.empty:
                    # print("The weather_df DataFrame is empty.")
                    return None  # Handle the empty DataFrame scenario
                else:
                    target_station = weather_df.iloc[0]
                    return target_station

            summary_dict = summary.to_dict(
                orient='records')  # Convert DataFrame to list of dicts for JSON serialization
            target_station = checker(weather_df)
            # print('target stations  found is  - - -- - -- - - - - - - -- -' , target_station)
            # Handle issues by filling missing Temperature data
            summary_cleaned = handle_issues(summary, weather_df, issues, target_station, granularity)
            summary_cleaned.reset_index(drop=True, inplace=True)
            summary_cleaned['month_year'] = summary_cleaned['month_year'].astype(str)
            summary_cleaned = summary_cleaned.to_dict(orient='records')
            # insert_clean_data_to_db(summary_cleaned)

            results = {
                'clean_data': summary_cleaned
            }
        else:
            issues = detect_issues(summary)

            # summary.to_csv("updated_summary.csv")

            # print("issues are - -- - - -- - - - --- - - - -- ", issues)
            def checker(weather_df):
                if weather_df.empty:
                    # print("The weather_df DataFrame is empty.")
                    return None  # Handle the empty DataFrame scenario
                else:
                    target_station = weather_df.iloc[0]
                    return target_station

            summary_dict = summary.to_dict(
                orient='records')  # Convert DataFrame to list of dicts for JSON serialization
            target_station = checker(weather_df)
            # print('target stations  found is  - - -- - -- - - - - - - -- -' , target_station)
            # Handle issues by filling missing Temperature data
            summary_cleaned = handle_issues(summary, weather_df, issues, target_station, granularity)
            summary_cleaned = summary_cleaned[pd.notna(summary_cleaned['Temperature'])]
            summary_cleaned.reset_index(drop=True, inplace=True)
            # summary_cleaned.to_csv("summary_cleaned.csv")
            summary_cleaned['month_year'] = summary_cleaned['month_year'].astype(str)

            summary_cleaned = summary_cleaned.to_dict(orient='records')

            results = {
                'clean_data': summary_cleaned
            }

    return jsonify(results), 200


@app.route("/idv_processing", methods=['GET'])
def idv_process():
    variable_id = request.args.get('variable_id')
    df = dbtest("select * from epp.independent_variable_file")
    result_df = fetch_and_combine_data_for_independent_variables(df, variable_id)
    if result_df.empty:
        return jsonify([]), 200
    # Step 1: Convert the "Start Date (Required)" column to datetime
    result_df['Start Date (Required)'] = pd.to_datetime(result_df['Start Date (Required)'])

    # Step 2: Set this column as the index
    result_df.set_index('Start Date (Required)', inplace=True)

    # Step 3: Resample the data on an hourly basis and summarize the "Meter Reading (Required)" column
    hourly_data = result_df['Meter Reading (Required)'].resample('H').sum()

    # Convert the Series to a dictionary with string keys
    hourly_data_list = [{'Reading_date': str(index), 'Value': value} for index, value in hourly_data.items()]

    return jsonify(hourly_data_list), 200


@app.route("/data-exploration-summary-old", methods=['GET'])
def get_data_exploration_summary():
    facility_id = request.args.get('facility_id', None)
    summary_type = request.args.get('summary_type', 'observe_data')
    detail = request.args.get('detail', False)
    meter = request.args.get('meter')
    detail_setting = request.args.get('ds')
    page_no = request.args.get('page_number', 1)
    page_size = request.args.get('page_size', 100)
    if detail or meter:
        if not detail:
            return {
                'status': 'failed',
                'message': "Please provide detail flag"
            }, 200

        if not meter:
            return {
                'status': 'failed',
                'message': "Please provide Meter Type"
            }, 200

    if not facility_id:
        return {
            'status': 'failed',
            'message': "Please provide Facility ID"
        }, 200
    des_object = DataExplorationSummary(facility_id, meter, detail, page_no, page_size, detail_setting)
    if summary_type == 'outliers':
        response = des_object.get_outlier_summary()
    elif summary_type == 'missing_data':
        response = des_object.get_missing_data_summary()
    else:
        response = des_object.get_observe_data_summary()
    return response


@app.route("/data-exploration-summary", methods=['GET'])
def get_data_exploration_summary_new():
    """
    facility_id: Mandatory
    meter_id: Mandatory for PopUp
    if summary_type is outliers then and there is a meter_type then bound is mandatory
    :return:
    """
    facility_id = request.args.get('facility_id')
    if not facility_id:
        return {'status': 'failed', 'message': "Please provide Facility"}, 200
    meter = request.args.get('meter')
    summary_type = request.args.get('summary_type', 'observe_data')
    bound = request.args.get('bound')
    if summary_type == 'outliers':
        if meter and not bound:
            return {'status': 'failed', 'message': "Please provide value of Bound"}, 200

    page_no = request.args.get('page_number', 1)
    page_size = request.args.get('page_size', 100)
    de = DataExploration(facility_id, summary_type, meter, bound)
    de.process()
    if meter:
        pg = Paginator(int(page_no), int(page_size))
        df = de.data_exploration_summary_response
        if len(df):
            df['Meter Reading (Required)'] = df['Meter Reading (Required)'].fillna('NaN')
            return pg.paginate_df(de.data_exploration_summary_response)
        return []
    return de.data_exploration_response


@app.route("/outlier-settings", methods=['GET'])
def get_outlier_settings():
    facility_id = request.args.get('facility_id')
    if not facility_id:
        return {'status': 'failed', 'message': "Please provide Facility"}, 200
    get_station_id = get_nearest_stations(facility_id)
    station_ids = tuple(get_station_id['station_id'].tolist())
    hourly_entries = OUTLIER_SETTING.format(facility_id, facility_id, station_ids)
    information = dbtest(hourly_entries)
    information = information.dropna(subset=['first_quartile'])
    if len(information):
        info = []
        meter_types = []

        def format_value(value, col):
            if not value:
                return "-"
            return "{:.2f}".format(value) if not isinstance(value, Decimal) else "{:.2f}".format(float(value))

        METER_MAP = {
            "Electricity": 1,
            "Water": 2,
            "NG": 3,
            "Temperature": 104,
            "Independent Variable": 999

        }
        for rec in information.values:
            meter_name = rec[0]
            lower_limit = float(format_value(rec[4], 'lower_limit'))
            if meter_name != 'Temperature':
                if lower_limit < 0:
                    lower_limit = 0
            meter_types.append(meter_name)
            formatted = {'meter_type': METER_MAP.get(meter_name),
                         'meter_name': meter_name,
                         'inter_quartile': float(format_value(rec[1], 'inter_quartile')),
                         'first_quartile': float(format_value(rec[2], 'first_quartile')),
                         'third_quartile': float(format_value(rec[3], 'third_quartile')),
                         'lower_limit': lower_limit,
                         'upper_limit': float(format_value(rec[5], 'upper_limit'), )}
            info.append(formatted)
        info = sorted(info, key=lambda x: x["meter_type"])
        sorted_meter_types = sorted(meter_types, key=lambda x: METER_MAP[x])

        settings = [{meter: METER_FACTOR if meter.lower() != 'independent variable' else IV_FACTOR} for
                    meter in sorted_meter_types]

        output_json = {
            "info": info,
            "settings": settings
        }

        return output_json

    response = {"settings": None, 'info': None}
    return response


@app.route('/summary_visualisation', methods=['GET'])
def visualise_data_exploration_summary():
    facility_id = request.args.get('facility_id', None)
    visualisation = DataExplorationVisualisation(facility_id)
    return visualisation.fetch_data()


@app.route("/data-exploration-summary-v2", methods=['GET'])
def get_data_exploration_summary_v2():
    facility_id = request.args.get('facility_id', None)
    summary_type = request.args.get('summary_type', 'observe_data')
    list_data = request.args.get('detail', '0')
    page_size = int(request.args.get('page_size', 10))
    page_no = int(request.args.get('page_number', 1))
    meter_name = request.args.get('meter', None)
    meter_id = request.args.get('meter_id', None)
    bound = request.args.get('bound', 'Lower limit')
    start_date = request.args.get('min_date', None)
    end_date = request.args.get('max_date', None)

    if not facility_id:
        return {'status': 'failed', 'message': "Please provide Facility"}, 200
    if list_data == '1':
        if page_size > 100:
            page_size = 100
        if not all([meter_name, meter_id]):
            return {'status': 'failed', 'message': "Please provide meter_name and meter_id when listing data"}, 200

    des = DataExplorationSummaryV2(facility_id, summary_type, meter_name, meter_id, start_date, end_date)
    if list_data == '1':
        response = des.get_paginated_list(page_size, page_no, bound)
        return jsonify(response)
    else:
        return des.process()


@app.route('/graph', methods=['GET'])
def get_graph():
    facility_id = request.args.get('facility_id')
    meter_id = request.args.get('meter_id')
    data_visualizer = DataVisualizer(facility_id, meter_id)
    combined_data = data_visualizer.combined_data
    start_date = request.args.get('start_date', combined_data['date'].min().strftime('%Y-%m-%d'))
    end_date = request.args.get('end_date', combined_data['date'].max().strftime('%Y-%m-%d'))

    filtered_data = combined_data[(combined_data['date'] >= start_date) & (combined_data['date'] <= end_date)]
    fig = data_visualizer.generate_figure(filtered_data)

    graph_html = fig.to_html(full_html=False)

    return render_template_string('''
        <html>
            <head>
                <title>Dash</title>
            </head>
            <body>
                {{ graph_html|safe }}
            </body>
        </html>
    ''', graph_html=graph_html)


@app.route('/insert_weather_data', methods=['POST'])
def process():
    start_year = request.json.get('start_year')
    start_month = request.json.get('start_month')
    end_year = request.json.get('end_year')
    facility_id = request.json.get('facility_id')
    end_month = request.json.get('end_month')

    # facility = dbtest("select id, latitude, longitude from epp.facility")
    # print("Facility data is -  - - - - - -- - -- -  -- - - -- ", facility.columns)
    # print(facility[facility['id'] == 24])
    # facility_df = facility[facility['id'] == int(facility_id)]
    # Get nearest 3 stations
    nearest_station_ids = get_nearest_stations(facility_id)
    consolidated_df = download_and_load_data(int(start_year), int(start_month), int(end_year), int(end_month),
                                             nearest_station_ids, int(facility_id))

    return {"message": "Data inserted Succefully"}, 200


@app.route('/get_station_details', methods=['GET'])
def getdata():
    facility = request.args.get('facility_id')
    if facility:
        facility = int(facility)
        response = get_nearest_stations(facility)
        if len(response):
            response = response[['latitude', 'longitude', 'station_id', 'station_name', 'climate_id']]
            df_con = response.to_dict(orient='records')
            return jsonify(df_con), 200
    return jsonify({"success": False, 'error': 'Insufficient Data'}), 404


@app.route('/get_min_max_dates', methods=['GET'])
def getdates():
    facility_id = request.args.get('facility_id')
    meter_type = request.args.get('meter_type')
    meter_id = request.args.get('meter_id')
    iv_id = request.args.get('iv_id')
    if meter_id:
        query = min_max_meter_date_query.format(facility_id, meter_id)
    elif meter_type:
        query = min_max_date_query.format(facility_id, meter_type)
    elif iv_id:
        query = min_max_date_query_iv.format(facility_id, iv_id)
    else:
        response = {"success": False,
                    'error': "Please provide Either of the 3 values. Meter ID, Meter Type or Independent Variable ID"}
        return jsonify(response), 400
    min_max_date = dbtest(query)
    min_max_date = min_max_date.dropna()
    if len(min_max_date):
        min_date = min_max_date.min_date[0].strftime('%m/%d/%Y %H:%M')
        max_date = min_max_date.max_date[0].strftime('%m/%d/%Y %H:%M')
    else:
        response = {"success": False, 'error': "Insufficient Data"}
        return jsonify(response), 404

    result = {
        "start_date": min_date,
        "end_date": max_date
    }

    return jsonify(result), 200


@app.route('/refresh_view', methods=['POST'])
def refresh_view():
    view = request.json.get('view')
    # refresh_materialised_view(view)


@app.route('/get_clean_data', methods=['GET'])
def get_clean_data():
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        facility_id = request.args.get('facility_id')
        weather_station = request.args.get('station_id')
        meter_type = request.args.get('meter_type')
        if not all([start_date, end_date, facility_id, meter_type]):
            return jsonify({"error": "Missing required parameters"}), 400

        try:
            facility_id = int(facility_id)
            meter_type = int(meter_type)
        except ValueError:
            return jsonify({"error": "Invalid parameter format"}), 400
        query = f"SELECT latitude, longitude FROM epp.facility WHERE id={facility_id}"
        facility_lat_long = dbtest(query)
        latitude = facility_lat_long.loc[0, 'latitude']
        longitude = facility_lat_long.loc[0, 'longitude']
        time_zone = get_timezone(latitude, longitude)
        temp_start, temp_end = get_utc_dates(start_date, end_date, time_zone)
        temp1, temp2, temp3 = get_nearest_stations(facility_id, n=3).station_id.values
        if weather_station:
            weather_station = int(weather_station)
            order = [temp1, temp2, temp3]
            if weather_station not in order:
                return jsonify({"error": "Invalid Station ID"}), 400
            order.pop(order.index(weather_station))
            order = [weather_station] + order
            temp1, temp2, temp3 = order
        try:
            # Try parsing with seconds
            date_obj = datetime.strptime(end_date, '%Y-%m-%d %H:%M:%S')
        except ValueError:
            # If it fails, parse without seconds
            date_obj = datetime.strptime(end_date, '%Y-%m-%d %H:%M')

        # Adjust to the end of the day
        end_date = date_obj.replace(hour=23, minute=59)
        end_date = end_date.strftime('%Y-%m-%d %H:%M')

        clean_data_query = get_data_cleaning_query(temp1, temp2, temp3, start_date, end_date, facility_id, meter_type)
        df = dbtest(clean_data_query)
        if df.empty:
            return jsonify({"error": "No data found for the given parameters"}), 404
        cleaned_data = clean_raw_data(df, facility_id, meter_type)
        if isinstance(cleaned_data, pd.DataFrame):
            cleaned_data['Date'] = pd.to_datetime(cleaned_data['Date']).dt.strftime('%Y-%m-%d %H:%M:%S')
            return jsonify({"clean_data": cleaned_data.to_dict('records')})
        elif isinstance(cleaned_data, dict):
            return jsonify({"clean_data": cleaned_data})
        else:
            return jsonify({"error": "Unexpected data format after cleaning"}), 500

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the full error
        return jsonify({"error": "An unexpected error occurred", "detail": str(e)}), 500


@app.route('/get-workflow', methods=['GET'])
def get_workflow():
    facility_id = request.args.get('facility_id')
    if not facility_id:
        return jsonify({"error": "Please Provide Facility ID"}), 400
    facility_id = int(facility_id)
    query = "SELECT * FROM epp.workflow WHERE facility_id={}".format(facility_id)
    df = dbtest(query)
    print(df.head())
    df.dropna(inplace=True)
    if not df.empty:
        fields = ['id', 'facility_id', 'detail', 'ew', 'weather_iv', 'savings', 'baseline', 'performance']

        workflows = []
        for _, row in df.iterrows():
            workflow = {field: row[field] if field in row else None for field in fields}
            workflows.append(workflow)
        return jsonify({'workflow': workflow}), 200
    return jsonify({"error": "No Workflow Created Yet"}), 404


@app.route('/get-performance-min-max', methods=['GET'])
def get_performance_min_max():
    facility_id = request.args.get('facility_id')
    meter_type = request.args.get('meter_type')
    if not facility_id:
        return jsonify({"error": "Please Provide Facility ID"}), 400
    if not meter_type:
        return jsonify({"error": "Please Provide Meter Type"}), 400

    facility_id, meter_type = int(facility_id), int(meter_type)
    query = get_base_line_min_max.format(facility_id, meter_type)
    df = dbtest(query)
    df.dropna(inplace=True)
    if len(df):
        meter_type = int(meter_type)
        max_data = df.baseline_end_date.max()
        min_max_df = dbtest(min_max_performance.format(facility_id, meter_type, max_data))
        min_max_df.dropna(inplace=True)
        if len(min_max_df):
            return {
                'min_date': min_max_df.min_date.min().strftime('%Y-%m-%d %H:%M:%S'),
                'max_date': min_max_df.max_date.max().strftime('%Y-%m-%d %H:%M:%S')
            }

        return jsonify({"error": "Insufficient Data"}), 404

    return jsonify({"error": "Insufficient Data"}), 404


@app.route('/get-uploader-result', methods=['GET'])
def get_uploader_result():
    """
    Retrieves the result of an upload process by record ID and type (iv).
    Query parameters:
    - record_id: ID of the record
    - iv: Indicator if the upload is for an Independent Variable (optional, default is False)
    """
    # Function dictionary to handle responses based on upload status
    status_handlers = {
        True: lambda name, type_val="Meter": ("Data Uploaded Successfully for {}: {}".format(type_val, name), 201),
        False: lambda name, type_val="Meter": ("File Being Processed for {}: {}".format(type_val, name), 200),
        None: lambda name, type_val="Meter": (
            "Something went wrong with {}: {} Data Upload.".format(type_val, name), 400)
    }

    record_id = request.args.get('record_id')
    iv = request.args.get('iv')  # Default to False if not provided
    if iv in [False, 'false']:
        iv = False
    else:
        iv = True
    if not record_id:
        return jsonify({"message": 'Please Provide a Record ID', 'status_code': 400}), 400

    query = STATUS_UPLOADER_INTIMATION_IV if iv else STATUS_UPLOADER_INTIMATION_METER
    response = dbtest(query.format(record_id))  # Ensure dbtest is using safe query practices

    if not response.empty:
        status, meter = response.iloc[0].values
        handler = status_handlers.get(status, lambda name, type_val="Meter":
        ("Something went wrong with {}: {} Data Upload.".format(type_val, name), 400))
        message, status_code = handler(meter, 'Independent Variable' if iv else "Meter")
        return jsonify({"message": message, 'status_code': status_code}), status_code

    return jsonify({"message": 'Invalid Record', 'status_code': 400}), 400


@app.route('/add-meter-data', methods=['POST'])
def add_meter_data():
    facility_id = request.json.get('facility_id', None)
    iv = request.json.get('iv')
    if iv in ['true', True]:
        iv = True
    else:
        iv = False
    record_id = request.json.get('record_id')
    if not record_id:
        return {
            'status': 'failed',
            'message': "Please provide Record ID"
        }, 200
    amd = AddMeterData(facility_id, record_id, iv=iv)
    thread = Thread(target=amd.process)
    thread.start()
    return {'status': 'Processing started'}, 202


@app.route('/upload-meter-file', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file provided"}), 400

    file_name = file.filename
    if not file_name.endswith(('.xls', '.xlsx', '.xml')):
        return jsonify({"error": "Please provide a valid file (.xls , .xlsx , xml)"}), 400

    facility_id = request.form.get('facility_id')
    meter_id = request.form.get('meter_id')
    iv = request.form.get('iv', 'false').lower() == 'true'

    if not facility_id:
        return jsonify({"error": "Please provide Facility ID"}), 400
    if not meter_id:
        error_msg = "Please Provide Independent Variable ID" if iv else "Please Provide Meter ID"
        return jsonify({"error": error_msg}), 400
    if file_name.endswith(('.xml',)):
        if iv:
            error_msg = "xml files are not Supported for Independent Variables"
            return jsonify({"error": error_msg}), 400
        uploader = GreenDataUploader(file, facility_id, meter_id, iv)
    else:
        uploader = DataUploader(file, facility_id, meter_id, iv)
    result = uploader.process()
    return jsonify(result), result.get('status_code')


@app.route('/remove-meter-file', methods=['POST'])
def remove_file():
    record_id = request.json.get('record_id')
    iv = request.json.get('iv')
    table_name = 'epp.facility_meter_hourly_entries'
    if iv:
        table_name = 'independent_variable_file'

    if not record_id:
        return jsonify({"error": "No selected file"})
    query = delete_file_query.format(table_name, record_id)
    status, response = execute_query(query)
    return {'success': status, 'response': response}


@app.route('/get-raw-data', methods=['get'])
def get_raw_data():
    facility_id = request.args.get('facility_id')
    meter_type = request.args.get('meter_type')
    facility_id, meter_type = int(facility_id), int(meter_type)
    from_date = request.args.get('from_date')
    to_date = request.args.get('to_date')
    stations = get_nearest_stations(facility_id)
    station_ids = tuple(stations['station_id'].values)  # Ensure it's a tuple for SQL IN clause formatting
    query = get_graph_query(facility_id, meter_type, from_date, to_date, station_ids)
    raw_data = dbtest(query)
    raw_data.rename(columns={'hourly_start_date': 'start_date', 'total_hourly_reading': 'readings', 'avg_temp': 'temp'},
                    inplace=True)
    raw_data['start_date'] = raw_data['start_date'].dt.strftime('%Y-%m-%d %H:%M:%S')
    response = raw_data.to_dict('records')

    return jsonify(response)


@app.route('/pull-station-data', methods=['POST'])
def pull_station_data():
    facility_id = request.json.get('facility_id')
    if not facility_id:
        return {"message": "Please Provide Facility ID"}, 400

    nearest_station_ids = get_nearest_stations(facility_id)
    nearest_station_ids = nearest_station_ids[nearest_station_ids['in_use'] == False]
    if not nearest_station_ids.empty:
        from update_weather_stations import main
        thread = Thread(target=main, args=(nearest_station_ids, True))
        thread.start()

    return {"message": "Data Being Inserted"}, 200


@app.route('/get-independent-variable', methods=['GET'])
def get_independent_variable():
    facility_id = request.args.get('facility_id')
    if not facility_id:
        return {"message": "Please Provide Facility ID"}, 400

    iv_query = INDEPENDENT_VARIABLE_QUERY.format(facility_id)
    iv_data = dbtest(iv_query)
    iv_data_dict = iv_data.to_dict()
    result = [{'max_duration': iv_data_dict['max_duration'][i],
               'name': iv_data_dict['name'][i],
               'id': iv_data_dict['id'][i]}
              for i in range(len(iv_data_dict['id']))]
    return jsonify(result), 200


@app.route('/get-performance-baseline-cal', methods=['GET'])
def get_performance_baseline_cal():
    facility = int(request.args.get('facility_id')) if request.args.get('facility_id') else None
    interface = int(request.args.get('interface')) if request.args.get('interface') else None
    page_size = int(request.args.get('page_size', 10))
    page_no = int(request.args.get('page_number', 1))
    meter_type = int(request.args.get('meter_type')) if request.args.get('meter_type') else None
    user = int(request.args.get('user')) if request.args.get('user') else None
    export = request.args.get('export')
    coordinates = f"SELECT id,latitude, longitude FROM epp.facility WHERE id={facility}"
    facility_lat_long = dbtest(coordinates)
    latitude = facility_lat_long.loc[0, 'latitude']
    longitude = facility_lat_long.loc[0, 'longitude']
    time_zone = get_timezone(latitude, longitude)
    # if not (facility or meter_type or user):
    if not (facility or meter_type):
        return jsonify({'success': False,
                        'error': 'Either if the 3 required fields are Missing. Facility or Meter Type or User'}), 400
    columns = ['start_date', 'end_date', 'observed', 'predicted', 'temperature']
    if interface == 4:
        query = BASELINE_OBSERVED_PREDICTED.format(time_zone, time_zone, facility, meter_type)
    elif interface == 5:
        query = PERFORMANCE_OBSERVED_PREDICTED.format(time_zone, time_zone, facility, meter_type)
    else:
        columns.append('source')
        query = COMBINED.format(time_zone, time_zone, facility, time_zone, time_zone, facility, meter_type)
    df = dbtest(query)
    df = df[columns]
    total_count = len(df)
    df['start_date'] = pd.to_datetime(df['start_date'], format='%a, %d %b %Y %H:%M:%S GMT').dt.strftime(
        '%Y/%m/%d %H:%M:%S')
    df['end_date'] = pd.to_datetime(df['end_date'], format='%a, %d %b %Y %H:%M:%S GMT').dt.strftime('%Y/%m/%d %H:%M:%S')
    if export:
        if not user:
            return jsonify({'success': False, 'error': 'Please Provide User ID'}), 400
        create_export_record = "INSERT INTO epp.export (created_by, interface, facility_id) VALUES (%s, %s, %s)"
        record_id = db_execute_single(create_export_record, (user, interface, facility))
        thread = Thread(target=export_data, args=(df, record_id))
        thread.start()
        return jsonify({'success': True, 'message': 'File Export in Progress', 'record_id': record_id}), 200
    df = get_paginated_data(df, page_size, page_no)
    return {'count': total_count, 'data': df.to_dict(orient='records')}


@app.route('/get-export-status', methods=['GET'])
def get_export_status():
    record_ids = request.args.get('record_ids')
    user = int(request.args.get('user')) if request.args.get('user') else None
    facility = int(request.args.get('facility')) if request.args.get('facility') else None
    if record_ids:
        actual_list = json.loads(record_ids)
        actual_list = tuple(actual_list)
    if record_ids:
        if len(actual_list) == 1:
            query = f"""SELECT status, id,file_path FROM epp.export where id = {actual_list[0]}"""
        else:
            query = f"""SELECT status, id,file_path FROM epp.export where id in {actual_list}"""
    elif user:
        query = f"""SELECT status, id,file_path FROM epp.export where created_by = {user}"""
    elif facility:
        query = f"""SELECT status, id,file_path FROM epp.export where facility_id = {facility}"""
    else:
        return jsonify({'success': False, 'error': 'Please Provide User ID/Facility ID/Records ID(s)'}), 400
    response = dbtest(query)
    if not response.empty:
        conditions = [response['status'] == 0, response['status'] == 1, response['status'] == 2]
        status_code_choices = [200, 201, 500]
        response['status_code'] = np.select(conditions, status_code_choices, default=-1)
        response['status_code'] = response['status_code'].replace(-1, np.nan).astype('Int64')

        message_choices = ['Export In Progress', 'File Exported Successfully', 'Something Went Wrong']
        response['message'] = np.select(conditions, message_choices, default='Unknown Status')
        return jsonify({'count': len(response), 'data': response.to_dict(orient='records')}), 200
    return {'success': True, 'status': 200}


@app.route('/mark-as-read', methods=['POST'])
def mark_notification_notification_as_read():
    record_id = int(request.json.get('record_id')) if request.json.get('record_id') else None
    file_path = request.json.get('file_path')
    if not (record_id or file_path):
        return jsonify({'success': False, 'error': 'Please Provide Records ID or File Path'}), 400
    # ToDo Remove File from blob storage
    execute_query(f"DELETE FROM epp.export WHERE id={record_id}")
    blob_name = file_path.split('/')[-1]
    time.sleep(5)
    delete_blob(blob_name)
    return jsonify({'success': True, 'message': 'Marked as Read'}), 200


@app.route('/get-unread-notifications', methods=['GET'])
def get_unread_notifications():
    user_id = int(request.args.get('user_id')) if request.args.get('user_id') else None
    page_size = int(request.args.get('page_size', 10))
    page_no = int(request.args.get('page_number', 1))
    query = f"SELECT ex.facility_id, ex.interface,ex.file_path, ex.id,fa.facility_name FROM epp.export as ex JOIN epp.facility as fa on ex.facility_id = fa.id WHERE ex.is_read=false  and ex.status=1 and ex.created_by={user_id}"
    # if user_id:
    #     query = f"SELECT ex.facility_id, ex.interface,ex.file_path, ex.id,fa.facility_name FROM epp.export as ex JOIN epp.facility as fa on ex.facility_id = fa.id WHERE ex.is_read=false  and ex.status=1 and ex.created_by={user_id}"
    # else:
    #     query = f"SELECT ex.facility_id, ex.interface,ex.file_path, ex.id,fa.facility_name FROM epp.export as ex JOIN epp.facility as fa on ex.facility_id = fa.id WHERE is_read=false and  status=1"
    notifications = dbtest(query)
    conditions = [notifications['interface'] == 1,
                  notifications['interface'] == 2,
                  notifications['interface'] == 3,
                  notifications['interface'] == 4,
                  notifications['interface'] == 5
                  ]
    interface_choices = [value for key, value in EXPORT_MESSAGE]
    notifications['message'] = np.select(conditions, interface_choices, default='NA')
    total_count = len(notifications)
    df = get_paginated_data(notifications, page_size, page_no)
    return {'count': total_count, 'data': df.to_dict(orient='records')}


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=5000)
