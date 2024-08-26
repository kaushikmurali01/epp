from threading import Thread
import calendar
from flask import Flask, jsonify, request, render_template_string
import pandas as pd
import plotly.graph_objs as go

from components.dataCleaner import clean_raw_data
from components.meter_iv_uploader import MeterIVFileUploader
from components.add_file_data_to_table import AddMeterData

from constants import SUFFICIENCY_DATA
from meter_uploader import MeterDataUploader, MeterDataUploaderIV
from sql_queries.data_cleaning import data_cleaning_query, get_data_cleaning_query
from sql_queries.sufficiency_queries import sufficiency_query
from constants import IV_FACTOR, METER_FACTOR
from data_exploration import DataExploration, OutlierSettings
from data_eploration_summary import DataExplorationSummary
from data_exploration_v2 import DataExplorationSummaryV2
from download_weather_data import download_and_load_data
from issue_detection import detect_issues, handle_issues
from paginator import Paginator
from sql_queries.file_uploader import delete_file_query
from sql_queries.nearest_weather_stations import min_max_date_query, min_max_meter_date_query, weather_data_query, \
    min_max_date_query_iv, min_max_general, min_max_performance, get_base_line_min_max
from summarize_data import summarize_data
from fetch_data_from_hourly_api import fetch_and_combine_data_for_user_facilities, \
    fetch_and_combine_data_for_independent_variables
from dbconnection import dbtest, execute_query, refresh_materialised_view
from utils import get_nearest_stations
from visualization.data_exploration import DataExplorationVisualisation
from visualization.visualize_line_graph import DataVisualizer
from datetime import datetime, timedelta

app = Flask(__name__)


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


@app.route('/check_sufficiency', methods=['POST'])
def get_sufficiency():
    facility_id = request.json.get('facility_id')
    s_d = start_date = request.json.get('start_date')
    e_d = end_date = request.json.get('end_date')

    # Check if all required parameters are present
    if not all([facility_id, start_date, end_date]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    # Modify the query with the provided parameters
    formatted_query = sufficiency_query.format(start_date=s_d, end_date=e_d, end_date_one=end_date + timedelta(days=1),
                                               facility_id=facility_id)
    df = dbtest(formatted_query)

    # Calculate sufficiency percentages
    hourly, daily, monthly, monthly_data = calculate_sufficiency(df, start_date, end_date)
    response = {
        "daily": {"sufficiency": round(daily, 2) if round(daily, 2) <= 100 else 100, "status": get_status(daily)},
        "hourly": {"sufficiency": round(hourly, 2) if round(hourly, 2) <= 100 else 100, "status": get_status(hourly)},
        "monthly": {
            "sufficiency": round(monthly, 2) if round(monthly, 2) <= 100 else 100,
            "status": get_status(monthly),
            "data": monthly_data
        }
    }

    return jsonify(response)


def calculate_sufficiency(df, start_date, end_date):
    # Calculate total hours, days, and months
    total_hours = int((end_date - start_date).total_seconds() / 3600) + 1
    total_days = (end_date - start_date).days + 1
    total_months = (end_date.year - start_date.year) * 12 + end_date.month - start_date.month + 1
    # Remove the NULL row
    df = df.dropna(subset=['meter_id'])

    # If the DataFrame is empty after removing blank rows, return 0 for all sufficiencies
    if df.empty:
        return 0, 0, 0, []

    # Calculate unique hourly and daily sufficiency
    unique_meters = df.drop_duplicates(subset=['meter_id'])

    hourly_sum = unique_meters['hourly_sufficiency_percentage'].sum()
    daily_sum = unique_meters['daily_sufficiency_percentage'].sum()

    meter_count = len(unique_meters)

    hourly_sufficiency = (hourly_sum * 100) / (total_hours * meter_count)
    daily_sufficiency = (daily_sum * 100) / (total_days * meter_count)

    # Calculate monthly sufficiency
    df_sorted = df.sort_values('monthly_sufficiency_percentage', ascending=False)

    # Drop duplicates based on meter_id and month_name, keeping the row with the highest monthly_sufficiency_percentage
    df_unique = df_sorted.drop_duplicates(subset=['meter_id', 'month_name'], keep='first')

    monthly_data = df_unique.groupby('month_name').agg({
        'monthly_sufficiency_percentage': 'sum',
        'meter_id': 'nunique'
    }).reset_index()
    sufficiency_data = pd.DataFrame(monthly_data)
    monthly_sufficiency_data = get_monthly_sufficiency(start_date, end_date, sufficiency_data)
    # Calculate monthly sufficiency percentage
    monthly_sufficiency = ((monthly_data['monthly_sufficiency_percentage'].sum() / (
            total_days * meter_count)) * 100) if total_days >= 364 else 0

    return hourly_sufficiency, daily_sufficiency, monthly_sufficiency, monthly_sufficiency_data


def get_month_days_in_range(start_date, end_date):
    month_days = {}
    current_date = start_date

    while current_date <= end_date:
        month_name = calendar.month_name[current_date.month]
        year = current_date.year
        days_in_month = calendar.monthrange(year, current_date.month)[1]

        if current_date.month == start_date.month and current_date.year == start_date.year:
            num_days = days_in_month - start_date.day + 1
        elif current_date.month == end_date.month and current_date.year == end_date.year:
            num_days = end_date.day
        else:
            num_days = days_in_month

        month_days[f"{month_name} {year}"] = num_days

        current_date = current_date.replace(
            year=current_date.year + (1 if current_date.month == 12 else 0),
            month=(current_date.month % 12) + 1,
            day=1
        )

    return month_days


def get_monthly_sufficiency(start_date, end_date, sufficiency_data):
    month_days = get_month_days_in_range(start_date, end_date)
    sufficiency_dict = {}
    for index, row in sufficiency_data.iterrows():
        month = row['month_name'].strip()
        value = row['monthly_sufficiency_percentage']
        for key in month_days.keys():
            if month in key:
                sufficiency_dict[
                    key] = f"{(value * 100 / (month_days[key] * row['meter_id']) if value * 100 / (month_days[key] * row['meter_id']) <= 100 else 100):.2f}"
                break

    result = [
        {"month": k, "value": sufficiency_dict.get(k, "0.00")}
        for k, v in month_days.items()
    ]
    return result


def get_status(sufficiency):
    return "passed" if sufficiency >= 90 else "failed"


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
    op = OutlierSettings(facility_id)
    op.process()

    information = op.data_exploration_response
    settings = [
        {record.get('meter_name'): METER_FACTOR if record.get('meter_name') != "Independent Variable" else IV_FACTOR}
        for record
        in information]
    response = {"settings": settings, 'info': information}
    return response


@app.route('/summary_visualisation', methods=['GET'])
def visualise_data_exploration_summary():
    facility_id = request.args.get('facility_id', None)
    visualisation = DataExplorationVisualisation(facility_id)
    return visualisation.fetch_data()


@app.route('/upload-meter-file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    file = request.files['file']
    file_name = request.files['file'].filename
    if file_name.split('.')[-1] not in ['xlsx', '.xls']:
        return jsonify({'error': "Please provide a valid Excel file"})
    iv = False if request.form.get('iv') in [None, 'false'] else True
    facility_id = request.form.get('facility_id')
    meter_id = request.form.get('meter_id')
    if not facility_id:
        return jsonify({'error': "Please Provide Facility ID"})
    if not meter_id:
        if iv:
            return jsonify({'error': "Please Provide Independent Variable ID"})
        return jsonify({'error': "Please Provide Meter ID"})
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    if file:
        if iv:
            uploader = MeterDataUploaderIV(file, facility_id, meter_id, iv)
        else:
            uploader = MeterDataUploader(file, facility_id, meter_id, iv)
        result = uploader.process()
        return jsonify(result)


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


@app.route('/add-meter-data', methods=['POST'])
def add_meter_data():
    facility_id = request.json.get('facility_id', None)
    iv = request.json.get('iv', False)
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

    if not facility_id:
        return {'status': 'failed', 'message': "Please provide Facility"}, 200
    if list_data == '1':
        if page_size > 100:
            page_size = 100
        if not all([meter_name, meter_id]):
            return {'status': 'failed', 'message': "Please provide meter_name and meter_id when listing data"}, 200

    des = DataExplorationSummaryV2(facility_id, summary_type, meter_name, meter_id)
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
    refresh_materialised_view(view)


@app.route('/get_clean_data', methods=['GET'])
def get_clean_data():
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        facility_id = request.args.get('facility_id')
        weather_station = request.args.get('station_id')

        if not all([start_date, end_date, facility_id]):
            return jsonify({"error": "Missing required parameters"}), 400

        try:
            facility_id = int(facility_id)
        except ValueError:
            return jsonify({"error": "Invalid parameter format"}), 400

        temp1, temp2, temp3 = get_nearest_stations(facility_id, n=3).station_id.values
        if weather_station:
            weather_station = int(weather_station)
            order = [temp1, temp2, temp3]
            if weather_station not in order:
                return jsonify({"error": "Invalid Station ID"}), 400
            order.pop(order.index(weather_station))
            order = [weather_station] + order
            temp1, temp2, temp3 = order
        date_obj = datetime.strptime(end_date, '%Y-%m-%d %H:%M')

        # Adjust to the end of the day
        end_date = date_obj.replace(hour=23, minute=59)
        end_date = end_date.strftime('%Y-%m-%d %H:%M')
        clean_data_query = get_data_cleaning_query(temp1, temp2, temp3, start_date, end_date, facility_id)

        df = dbtest(clean_data_query)

        if df.empty:
            return jsonify({"error": "No data found for the given parameters"}), 404

        cleaned_data = clean_raw_data(df)
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
        max_data = df.baseline_end_date.max()
        min_max_df = dbtest(min_max_performance.format(facility_id, max_data))
        print(min_max_performance.format(facility_id, max_data))
        min_max_df.dropna(inplace=True)
        if len(min_max_df):
            return {'min_date': min_max_df.min_date.min(), 'max_date': min_max_df.max_date.max()}
        return jsonify({"error": "Insufficient Data"}), 404

    return jsonify({"error": "Insufficient Data"}), 404


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=5000)
