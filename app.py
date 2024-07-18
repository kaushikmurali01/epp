from flask import Flask, jsonify, request
import json
import pandas as pd
import numpy as np

from data_eploration_summary import DataExplorationSummary
from issue_detection import detect_issues, handle_issues
from summarize_data import summarize_data
from fetch_data_from_hourly_api import fetch_and_combine_data_for_user_facilities, \
    fetch_and_combine_data_for_independent_variables
from dbconnection import dbtest
from insertion_and_preparation import insert_clean_data_to_db
from visualization.data_exploration import DataExplorationVisualisation

app = Flask(__name__)


@app.route('/handle', methods=['GET'])
def return_summary():
    # Fetch the DataFrame from the database
    df = dbtest('''select distinct hme.facility_id, hme.facility_meter_detail_id as meter_type, hme.meter_id,
    hme.created_by, hme.media_url, fmd.purchased_from_the_grid, fmd.is_active
    from epp.facility_meter_hourly_entries hme join epp.facility_meter_detail fmd
    on hme.facility_meter_detail_id = fmd.meter_type;''')

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
    df = dbtest('''select hme.facility_id, hme.facility_meter_detail_id as meter_type, hme.meter_id,
    hme.created_by, hme.media_url, fmd.purchased_from_the_grid, fmd.is_active
    from epp.facility_meter_hourly_entries hme join epp.facility_meter_detail fmd
    on hme.facility_meter_detail_id = fmd.meter_type;''')

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
def check_sufficiency():
    # Fetch the DataFrame from the database
    df = dbtest('''select distinct hme.facility_id, hme.facility_meter_detail_id as meter_type, hme.meter_id,
    hme.created_by, hme.media_url, fmd.purchased_from_the_grid, fmd.is_active
    from epp.facility_meter_hourly_entries hme join epp.facility_meter_detail fmd
    on hme.facility_meter_detail_id = fmd.meter_type;''')

    granularity = request.json.get('granularity', 'hourly')
    start_date = request.json.get('start_date')
    end_date = request.json.get('end_date')
    facility_id = request.json.get('facility_id')
    meter_type = request.json.get('meter_type')
    independent_variables = request.json.get('independent_variables', '')
    # Debugging statements to check the received parameters
    # print("facility_id:", facility_id)
    # print("created_by:", created_by)

    user_combined_data = fetch_and_combine_data_for_user_facilities(df, facility_id, meter_type)

    # Debugging statement to check user_combined_data
    print("User combined data:\n", user_combined_data)

    if not user_combined_data:
        #     #print("user_combined_data is empty after fetching and combining data")
        return jsonify({'error': 'No data available for the given parameters'}), 400

    # weather_file = request.files['weather_file']
    # weather_df = pd.read_csv(weather_file)
    weather_df = dbtest(f'SELECT * FROM epp.weather_data where facility_id = {facility_id}')
    # print("weather df is -- - - - - -- - - -- -- - - -- - - - -- -", weather_df)
    results = {}
    # #print("weather_df is  - - - -- - - -- - -- - -- -- - ", weather_df)
    for meter_type, raw_df in user_combined_data.items():
        if raw_df.empty:
            print(f"raw_df is empty for meter_type {meter_type}")
            continue
        # raw_df = pd.read_excel("C:/Users/Akash Jain/Downloads/_598033_unknown1719905563363.xlsx")
        if start_date and end_date:
            start_date = pd.to_datetime(start_date)
            end_date = pd.to_datetime(end_date)

            # Ensure that date columns are in datetime format
            raw_df['ReadingDate'] = pd.to_datetime(raw_df['ReadingDate'])
            weather_df['date_time'] = pd.to_datetime(weather_df['date_time'])

            # Filter data based on the date range
            raw_df = raw_df[(raw_df['ReadingDate'] >= start_date) & (raw_df['ReadingDate'] <= end_date)]
            weather_df = weather_df[(weather_df['date_time'] >= start_date) & (weather_df['date_time'] <= end_date)]
            print("filtered weather df is - -- - - - -- - - -- -- - -- - ", weather_df)
        # Debugging statements after filtering
        # print(f"Filtered raw_df for meter_type {meter_type}:\n", raw_df)
        # print(f"Filtered weather_df:\n", weather_df)

        if independent_variables:
            summary, sufficiency = summarize_data(raw_df, weather_df, granularity)
            summary = summary[pd.notna(summary['Temperature'])]
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
                variable_name = idv['independent_variable_name'][0]
                print("variable name is- --  -- -###################################################33", variable_name)
                hourly_data.name = variable_name
                hourly_data_df = hourly_data.to_frame(name=variable_name)
                print("hourly_data_df", hourly_data_df)
                summary = pd.merge(summary, hourly_data_df, on='Start Date (Required)')
                # summary = summary.join(hourly_data_df, how='outer')
                print("The df after combining the independent variable is - - -  -- - - - - - - -- -   - ",
                      summary.columns)
            summary.rename(columns={'Start Date (Required)': 'Date'}, inplace=True)
            granularity_results = {}
            if sufficiency[granularity]:
                # Hourly sufficiency
                def process_granularity(data, granularity_level):
                    if granularity_level == 'hourly':

                        if sufficiency[granularity_level] < 90:
                            issues = detect_issues(data)
                            return {
                                'status': 'failed',
                                'overall_sufficiency': sufficiency[granularity_level],
                                'failedData': issues
                            }
                        else:
                            issues = detect_issues(data)
                            return {
                                'status': 'passed',
                                'sufficiency': sufficiency[granularity_level],
                                'monthly_sufficiency': calculate_monthly_sufficiency(data),
                                'outliers': issues['outliers']
                            }

                    else:
                        if sufficiency[granularity_level] < 90:
                            return {
                                'status': 'failed',
                                'sufficiency': sufficiency[granularity_level]
                            }
                        else:
                            return {
                                'status': 'passed',
                                'sufficiency': sufficiency[granularity_level]
                            }

                granularity_results[granularity] = process_granularity(summary, granularity)

                # Daily sufficiency
                # numeric_columns = summary.select_dtypes(include=np.number).columns

                daily_summary = summary.resample('D', on='Date').agg({
                    'Temperature': 'mean',
                    'EnergyConsumption': 'sum',
                    'DayNumber': 'first',
                    'WeekNumber': 'first',
                    'MonthNumber': 'first',
                    'MonthName': 'first'
                }).reset_index()
                print("daily summary data frame is - - - - - - - -- - -- - - -- - - - -- - ", daily_summary)
                granularity_results['daily'] = process_granularity(daily_summary, 'daily')

                results = granularity_results
                return jsonify(results), 200
            else:
                return {
                    'status': 'failed',
                    'message': "Wrong inputs passed. Please try again with other inputs."
                }, 200
        else:
            summary, sufficiency = summarize_data(raw_df, weather_df, granularity)
            granularity_results = {}
            if sufficiency[granularity]:
                # Hourly sufficiency
                def process_granularity(data, granularity_level):
                    if granularity_level == 'hourly':

                        if sufficiency[granularity_level] < 90:
                            issues = detect_issues(data)
                            return {
                                'status': 'failed',
                                'overall_sufficiency': sufficiency[granularity_level],
                                'failedData': issues
                            }
                        else:
                            issues = detect_issues(data)
                            return {
                                'status': 'passed',
                                'sufficiency': sufficiency[granularity_level],
                                'monthly_sufficiency': calculate_monthly_sufficiency(data),
                                'outliers': issues['outliers']
                            }

                    else:
                        if sufficiency[granularity_level] < 90:
                            return {
                                'status': 'failed',
                                'sufficiency': sufficiency[granularity_level]
                            }
                        else:
                            return {
                                'status': 'passed',
                                'sufficiency': sufficiency[granularity_level]
                            }

                # Hourly sufficiency
                granularity_results[granularity] = process_granularity(summary, granularity)

                # Daily sufficiency
                # numeric_columns = summary.select_dtypes(include=np.number).columns

                daily_summary = summary.resample('D', on='Date').agg({
                    'Temperature': 'mean',
                    'EnergyConsumption': 'sum',
                    'DayNumber': 'first',
                    'WeekNumber': 'first',
                    'MonthNumber': 'first',
                    'MonthName': 'first'
                }).reset_index()
                print("daily summary data frame is - - - - - - - -- - -- - - -- - - - -- - ", daily_summary)
                granularity_results['daily'] = process_granularity(daily_summary, 'daily')

                results = granularity_results
                return jsonify(results), 200
            else:
                return {
                    'status': 'failed',
                    'message': "Wrong inputs passed. Please try again with other inputs."
                }, 200
    # print(f"Sufficiency results: {results}")


def calculate_monthly_sufficiency(df):
    df['month_year'] = df['Date'].dt.to_period('M')

    # Calculate expected rows (24 readings per day for each month)
    monthly_expected = df.groupby('month_year').apply(
        lambda x: 24 * x['Date'].dt.daysinmonth.iloc[0]
    )

    # Calculate non-null rows for 'Temperature' and 'EnergyConsumption'
    monthly_non_null = df.groupby('month_year').apply(
        lambda x: x.dropna(subset=['Temperature', 'EnergyConsumption']).shape[0]
    )

    # Calculate sufficiency percentage
    monthly_sufficiency = (monthly_non_null / monthly_expected) * 100

    sufficiency_output = [
        {'month': month.strftime('%B %Y'), 'value': f"{sufficiency:.2f}"}
        for month, sufficiency in monthly_sufficiency.items()
    ]
    return sufficiency_output


# date_time, temp, rel_hum, precip_amount, wind_spd, station_press, hmdx, weather, station_id, facility_id, distance
@app.route("/get_weather_data", methods=['GET'])
def weather_data():
    facility = request.args.get('facility_id')
    data = request.args.get('data')
    df = dbtest(f'SELECT date_time, {data} FROM epp.weather_data WHERE facility_id = {facility}')
    df['date_time'] = pd.to_datetime(df['date_time'])

    # Step 2: Set this column as the index
    df.set_index('date_time', inplace=True)

    # Step 3: Resample the data on an hourly basis and summarize the "Meter Reading (Required)" column
    monthly_data = df[data].resample('M').mean()

    # Convert the Series to a dictionary with string keys
    monthly_data_list = {index.strftime('%B'): round(value, 2) for index, value in monthly_data.items()}

    # df_con = monthly_data_list.to_dict(orient= 'records')
    return jsonify(monthly_data_list), 200


@app.route('/insert_clean_data', methods=['POST'])
def clean_data():
    # Fetch the DataFrame from the database
    df = dbtest('''select distinct hme.facility_id, hme.facility_meter_detail_id as meter_type, hme.meter_id,
    hme.created_by, hme.media_url, fmd.purchased_from_the_grid, fmd.is_active
    from epp.facility_meter_hourly_entries hme join epp.facility_meter_detail fmd
    on hme.facility_meter_detail_id = fmd.meter_type;''')

    granularity = request.json.get('granularity', '')
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
            raw_df['ReadingDate'] = pd.to_datetime(raw_df['ReadingDate'])
            weather_df['date_time'] = pd.to_datetime(weather_df['date_time'])

            # Filter data based on the date range
            raw_df = raw_df[(raw_df['ReadingDate'] >= start_date) & (raw_df['ReadingDate'] <= end_date)]
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


@app.route("/data-exploration-summary", methods=['GET'])
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


@app.route('/summary_visualisation')
def visualise_data_exploration_summary():
    facility_id = request.args.get('facility_id', None)
    visualisation = DataExplorationVisualisation(facility_id)
    return visualisation.fetch_data()


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
