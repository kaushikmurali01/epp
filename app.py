from flask import Flask, jsonify, request
import json
import pandas as pd
from issue_detection import detect_issues, handle_issues
from summarize_data import summarize_data
from fetch_data_from_hourly_api import fetch_and_combine_data_for_user_facilities
from dbconnection import dbtest


app = Flask(__name__)

@app.route('/handle', methods = ['POST'])
def checker():
    # Fetch the DataFrame from the database
    df = dbtest('''select hme.facility_id, hme.facility_meter_detail_id as meter_type, hme.meter_id,
    hme.created_by, hme.media_url, fmd.purchased_from_the_grid, fmd.is_active
    from epp.facility_meter_hourly_entries hme join epp.facility_meter_detail fmd
    on hme.facility_meter_detail_id = fmd.meter_type;''')
    # #print("Initial df from database:\n", df)

    
    # if 'weather_file' not in request.files:
    #     return jsonify({'error': 'No file part'}), 400
    
    granularity = request.form.get('granularity', 'hourly')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    facility_id = request.form.get('facility_id')
    created_by = request.form.get('created_by')
    
    # Debugging statements to check the received parameters
    #print("facility_id:", facility_id)
    #print("created_by:", created_by)
    
    user_combined_data = fetch_and_combine_data_for_user_facilities(df, facility_id, created_by)
    
    # Debugging statement to check user_combined_data
    #print("User combined data:\n", user_combined_data)

    if not user_combined_data:
        #print("user_combined_data is empty after fetching and combining data")
        return jsonify({'error': 'No data available for the given parameters'}), 400

    weather_file = request.files['weather_file']
    weather_df = pd.read_csv(weather_file)
    # weather_df = dbtest('SELECT * FROM epp.weather_data')
    print("weather df is -- - - - - -- - - -- -- - - -- - - - -- -", weather_df)
    results = {}
    # #print("weather_df is  - - - -- - - -- - -- - -- -- - ", weather_df)
    for meter_type, raw_df in user_combined_data.items():
        if raw_df.empty:
            #print(f"raw_df is empty for meter_type {meter_type}")
            continue

        if start_date and end_date:
            start_date = pd.to_datetime(start_date)
            end_date = pd.to_datetime(end_date)
            
            # Ensure that date columns are in datetime format
            raw_df['ReadingDate'] = pd.to_datetime(raw_df['ReadingDate'])
            weather_df['Date/Time (LST)'] = pd.to_datetime(weather_df['Date/Time (LST)'])
            
            # Filter data based on the date range
            raw_df = raw_df[(raw_df['ReadingDate'] >= start_date) & (raw_df['ReadingDate'] <= end_date)]
            weather_df = weather_df[(weather_df['Date/Time (LST)'] >= start_date) & (weather_df['Date/Time (LST)'] <= end_date)]
        
        # Debugging statements after filtering
        #print(f"Filtered raw_df for meter_type {meter_type}:\n", raw_df)
        #print(f"Filtered weather_df:\n", weather_df)
        
        summary, sufficiency = summarize_data(raw_df, weather_df, granularity)
        
        # Detect issues in the summarized data
        issues = detect_issues(summary)
        # print("issues are - -- - - -- - - - --- - - - -- ", issues)
        def checker(weather_df):
            if weather_df.empty:
                #print("The weather_df DataFrame is empty.")
                return None  # Handle the empty DataFrame scenario
            else:
                target_station = weather_df.iloc[0]
                return target_station
        summary_dict = summary.to_dict(orient='records')  # Convert DataFrame to list of dicts for JSON serialization
        target_station = checker(weather_df)
        #print('target stations found is  - - -- - -- - - - - - - -- -' , target_station)
        # Handle issues by filling missing Temperature data
        summary_cleaned = handle_issues(summary, weather_df, issues, target_station, granularity)
        summary_cleaned.to_csv("summary_cleaned.csv")

        # Convert DataFrame to JSON-serializable format
        summary_dict = summary_cleaned.to_dict(orient='records')

        results[str(meter_type)] = {
            'sufficiency': sufficiency,
            'summary': summary_dict,
            'issues': issues
        }

    return jsonify(results), 200




if __name__ == '__main__':

    app.run(host="0.0.0.0", debug=True)