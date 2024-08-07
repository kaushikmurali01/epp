from flask import Flask, jsonify, request
import requests
import pandas as pd
from CALTRACK_training import *
from CALTRACK_scoring import *
from enerva_utils import *
from p4p_calc import *
import json

app = Flask(__name__)
@app.route('/model_summary', methods=['POST'])

def baseline_model_training():
    input_settings = request.get_json()
    
    try:
        granularity = input_settings.get('granularity')
        meter_type = input_settings.get('meter_type')
        facility_id = int(input_settings.get('facility_id'))
        baseline_start_date = pd.to_datetime(input_settings.get('start_date'))
        baseline_end_date = pd.to_datetime(input_settings.get('end_date'))
        dummy_variables = input_settings.get('dummyVariables', {})
        selected_independent_variables_ids = input_settings.get('independent_variables', [])
        response = fetch_data_from_api(facility_id, baseline_start_date, baseline_end_date)
        cleaned_data = pd.DataFrame(response['clean_data'])
        # print(cleaned_data.columns)
        # print(cleaned_data.head())
        cleaned_data['Date'] = pd.to_datetime(cleaned_data['Date'])
        baseline_start_date = pd.to_datetime(input_settings.get('start_date'))
        baseline_end_date = pd.to_datetime(input_settings.get('end_date'))
        
        selected_independent_variables = get_independent_vars_names(selected_independent_variables_ids, facility_id)

        baseline_data = cleaned_data[(cleaned_data['Date'] >= baseline_start_date) & (cleaned_data['Date'] <= baseline_end_date)]
        baseline_data = baseline_data[['Date', 'EnergyConsumption', 'Temperature'] + selected_independent_variables]
        baseline_data.rename(columns={'Date': 'Timestamp', 'EnergyConsumption': 'Energy Use', 'Temperature': 'OAT'}, inplace=True)
        # print(baseline_data)
    except Exception as e:
    # This will catch any exception and print a message about what went wrong
        # raise
        print(f"An error occurred: {e}")
       
    additional_dummy_vars = [key for key, value in dummy_variables.items() if value]
    
    model = EnergyModel()
    model.load_process_data(baseline_data)
    processed_data = model.indep_vars_processing(
        columns_to_remove=[], 
        additional_indep_cat_vars=[], 
        additional_indep_cont_vars=selected_independent_variables, 
        additional_dummy_vars=additional_dummy_vars, 
        holiday_flag=False
    )
    
    if granularity == 'hourly':
        model.feature_engineering_eemeter_hourly_model(processed_data, "three_month_weighted")
        model.training_hourly_model()
        predicted_data = model.scoring_hourly_model(processed_data)
        baseline_summary_performance_page = model.get_baseline_summary(predicted_data, 'hourly',meter_type)
        # Get buffers from the model save function
        model_buffer, config_buffer = model.save_model_to_buffer('hourly')
    else:
        model.training_daily_model(processed_data, ignore_disqualification=True)
        predicted_data = model.scoring_daily_model(processed_data, ignore_disqualification=True)
        baseline_summary_performance_page = model.get_baseline_summary(predicted_data, 'daily',meter_type)
        # Get buffers from the model save function
        model_buffer, config_buffer = model.save_model_to_buffer('daily')
       
    model_metrics = model.evaluate(predicted_data)

    table_name = 'baseline_model_output_data'
    # Convert DataFrame to JSON strings for the output_data column
    predicted_data = predicted_data.reset_index()
    predicted_data['Timestamp'] = pd.to_datetime(predicted_data['Timestamp'])
    output_data_json = predicted_data.to_json(orient='records')
    # Convert baseline_summary_performance_page JSON to a string
    baseline_data_summary_json = json.dumps(baseline_summary_performance_page)
    #model metrics json to string
    model_metrics_summary_json = json.dumps(model_metrics)
    # Create a list of tuples for insertion
    values = (facility_id, output_data_json, baseline_data_summary_json,meter_type,model_metrics_summary_json)
    # Create the SQL insert query
    query = f"""
    INSERT INTO {table_name} (facility_id, output_data, baseline_data_summary,meter_type,model_metrics_summary)
    VALUES (%s, %s, %s, %s, %s)
    """
    # Execute the query
    db_execute(query, values)
    #push model to blob storage
    # Blob names
    sub_folder_name = f"caltrack-{str(facility_id)}-{str(meter_type)}"
    model_blob_name = f"{sub_folder_name}/model.pkl"
    config_blob_name = f"{sub_folder_name}/config.pkl"
    # Upload the model directly
    upload_blob_from_buffer(model_blob_name, model_buffer)
    # Upload the configuration directly
    upload_blob_from_buffer(config_blob_name, config_buffer)

    # returning baseline model metrics summary
    return jsonify(model_metrics)

@app.route('/get_baseline_data_summary', methods=['GET'])
def get_baseline_data_summary():
    facility_id = request.args.get('facility_id')
    meter_type = request.args.get('meter_type')
    
    if not facility_id or not meter_type:
        return jsonify({"error": "facility_id and meter_type are required"}), 400
    try:
        facility_id = int(facility_id)
        meter_type = int(meter_type)
    except ValueError:
        return jsonify({"error": "facility_id and meter_type must be integers"}), 400
    
    query = "SELECT baseline_data_summary FROM baseline_model_output_data WHERE facility_id = %s AND meter_type = %s"
    result = db_execute(query, (facility_id, meter_type), fetch=True)
    
    if result and result[0]:
        return jsonify({"facility_id": facility_id, "meter_type": meter_type, "baseline_summary_performance_page": result[0]})
    else:
        return jsonify({"error": "No data found for the given facility_id and meter_type"}), 404
    
@app.route('/get_predicted_data', methods=['GET'])
def get_predicted_data():
    facility_id = request.args.get('facility_id')
    meter_type = request.args.get('meter_type')
    
    if not facility_id or not meter_type:
        return jsonify({"error": "facility_id and meter_type are required"}), 400
    
    try:
        facility_id = int(facility_id)
        meter_type = int(meter_type)
    except ValueError:
        return jsonify({"error": "facility_id and meter_type must be integers"}), 400
    
    query = "SELECT output_data FROM baseline_model_output_data WHERE facility_id = %s AND meter_type = %s"
    result = db_execute(query, (facility_id, meter_type), fetch=True)
    # print(facility_id,meter_type,result)
    if result:
        predicted_data = result[0]
        return jsonify(predicted_data)
    else:
        return jsonify({"error": "No data found for the given facility_id and meter_type"}), 404

@app.route('/p4p_calc_summary', methods=['POST'])
def p4p_calculation():
    input_settings_p4p = request.get_json()
    try:
        url = 'https://ams-enerva-dev.azure-api.net/v1/insert_clean_data'
        response = requests.post(url, json=input_settings_p4p)
        # print(response.json())
        cleansed_performance_data = pd.DataFrame(response.json()['clean_data'])
        # print(cleaned_data.columns)
        # print(cleaned_data.head())
        cleansed_performance_data['Date'] = pd.to_datetime(cleansed_performance_data['Date'])
        performance_start_date = pd.to_datetime(input_settings_p4p.get('start_date'))
        performance_end_date = pd.to_datetime(input_settings_p4p.get('end_date'))
        
        performance_data = cleansed_performance_data[(cleansed_performance_data['Date'] >= performance_start_date) & (cleansed_performance_data['Date'] <= performance_end_date)]
        performance_data = performance_data[['Date', 'EnergyConsumption', 'Temperature'] + input_settings_p4p.get('independent_variables', [])]
        performance_data.rename(columns={'Date': 'Timestamp', 'EnergyConsumption': 'Energy Use', 'Temperature': 'OAT'}, inplace=True)
        # print(baseline_data)
    except Exception as e:
    # This will catch any exception and print a message about what went wrong
        print(f"An error occurred: {e}")
    # get performance data from DB
    non_routine_adjustment_value = get_non_routine_adjustment_data(facility_id, meter_type, start_date, end_date)
    # enerva_user_input_settings
    granularity = input_settings_p4p.get('granularity')
    off_peak_incentive = input_settings_p4p.get('off_peak_incentive', 0)
    on_peak_incentive = input_settings_p4p.get('on_peak_incentive', 0)
    minimum_savings = input_settings_p4p.get('minimum_savings', 0)
    facility_id = input_settings_p4p.get('facility_id')
    meter_type = input_settings_p4p.get('meter_type')
    #take independent_variables from database

    # Blob names
    sub_folder_name = f"caltrack-{str(facility_id)}-{str(meter_type)}"
    model_blob_name = f"{sub_folder_name}/model.pkl"
    config_blob_name = f"{sub_folder_name}/config.pkl"

    loaded_model = download_buffer_from_blob(model_blob_name)
    loaded_config = download_buffer_from_blob(config_blob_name)
    print('model loaded successfully')
    if granularity == 'hourly':
        scoring_results = scoring_hourly_model(performance_data, loaded_model, loaded_config)
        performance = P4P_metrics_calculation(scoring_results, non_routine_adjustment_value, 'hourly', off_peak_incentive, on_peak_incentive, minimum_savings,meter_type)
    else:
        scoring_results = scoring_daily_model(performance_data, eemeter_model = loaded_model['eemeter_model'],linear_model = loaded_model['linear_model'], loaded_config = loaded_config)
        performance = P4P_metrics_calculation(scoring_results, non_routine_adjustment_value, 'daily', off_peak_incentive, on_peak_incentive, minimum_savings,meter_type)
        
    performance_summary = performance.calculate_metrics()
    
    return jsonify(performance_summary)

if __name__ == "__main__":
    app.run(host="0.0.0.0",debug=True,port =5004)