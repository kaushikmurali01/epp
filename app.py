from flask import Flask, jsonify, request
import requests
import pandas as pd
from CALTRACK_training import *
from CALTRACK_scoring import *
from enerva_utils import *
from p4p_calc import *
import json
import pytz

app = Flask(__name__)
@app.route('/model_summary', methods=['POST'])

def baseline_model_training():
    try:
        input_settings = request.get_json()
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
        # except Exception as e:
        # # This will catch any exception and print a message about what went wrong
        #     # raise
        #     print(f"An error occurred: {e}")
        
        additional_dummy_vars = [key for key, value in dummy_variables.items() if value]
        
        model = EnergyModel()
        model.load_process_data(baseline_data.copy())
        processed_data = model.indep_vars_processing(
            columns_to_remove=[], 
            additional_indep_cat_vars=[], 
            additional_indep_cont_vars=selected_independent_variables, 
            additional_dummy_vars=additional_dummy_vars, 
            holiday_flag=False
        )
        
        if granularity == 'hourly':
            model.feature_engineering_eemeter_hourly_model(processed_data.copy(), "three_month_weighted")
            model.training_hourly_model()
            predicted_data = model.scoring_hourly_model(processed_data.copy())
            baseline_summary_performance_page = model.get_baseline_summary(predicted_data.copy(), 'hourly',meter_type)
            # Get buffers from the model save function
            model_buffer, config_buffer = model.save_model_to_buffer('hourly')
        else:
            model.training_daily_model(processed_data.copy(), ignore_disqualification=True)
            predicted_data = model.scoring_daily_model(processed_data.copy(), ignore_disqualification=True)
            baseline_summary_performance_page = model.get_baseline_summary(predicted_data.copy(), 'daily',meter_type)
            # Get buffers from the model save function
            model_buffer, config_buffer = model.save_model_to_buffer('daily')
        
        model_metrics = model.evaluate(predicted_data)
        input_settings_dump = {
            "granularity" : granularity,
            "meter_type" : meter_type,
            "facility_id" : facility_id,
            "baseline_start_date" : str(baseline_start_date),
            "baseline_end_date" : str(baseline_end_date),
            "modelling_independent_variables" : list(model.independent_variables),
            "independent_variables_name" : selected_independent_variables,
            "dummy_variables" : dummy_variables,
        }
        model_input_settings = json.dumps(input_settings_dump)
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
        values = (facility_id, output_data_json, baseline_data_summary_json,meter_type,model_metrics_summary_json,model_input_settings)
        # Create the SQL insert query
        query = f"""
        INSERT INTO {table_name} (facility_id, output_data, baseline_data_summary, meter_type, model_metrics_summary, model_input_settings)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (facility_id) DO UPDATE
        SET output_data = EXCLUDED.output_data,
            baseline_data_summary = EXCLUDED.baseline_data_summary,
            model_metrics_summary = EXCLUDED.model_metrics_summary,
            model_input_settings = EXCLUDED.model_input_settings
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
    except Exception as e:
        print(f"An error occurred: {e}")
        return str(e), 500  # HTTP 500 Internal Server Error

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
    
@app.route('/score_performance_data', methods=['POST'])
def score_data():
    try:
        input_settings_scoring = request.get_json()
        scoring_start_date = pd.to_datetime(input_settings_scoring.get('start_date'))
        scoring_end_date = pd.to_datetime(input_settings_scoring.get('end_date'))
        facility_id = input_settings_scoring.get('facility_id')
        meter_type = input_settings_scoring.get('meter_type')
        query = """
        SELECT model_input_settings 
        FROM baseline_model_output_data 
        WHERE facility_id = %s AND meter_type = %s;
        """
        values = (facility_id, meter_type)
        result = db_execute(query, values, fetch=True)
        baseline_model_settings = result[0]
        granularity = baseline_model_settings['granularity']
        selected_independent_variables = baseline_model_settings['independent_variables_name']
        dummy_variables = baseline_model_settings['dummy_variables']
        modelling_independent_variables = baseline_model_settings['modelling_independent_variables']
        #get clean performance data
        response = fetch_data_from_api(facility_id, scoring_start_date, scoring_end_date)
        cleansed_scoring_data = pd.DataFrame(response['clean_data'])
        print(cleansed_scoring_data.head())
        cleansed_scoring_data['Date'] = pd.to_datetime(cleansed_scoring_data['Date'])
        scoring_data = cleansed_scoring_data[(cleansed_scoring_data['Date'] >= scoring_start_date) & (cleansed_scoring_data['Date'] <= scoring_end_date)]
        scoring_data = scoring_data[['Date', 'EnergyConsumption', 'Temperature'] + selected_independent_variables]
        scoring_data.rename(columns={'Date': 'Timestamp', 'EnergyConsumption': 'Energy Use', 'Temperature': 'OAT'}, inplace=True)

        model = EnergyModel()
        model.load_process_data(scoring_data.copy())
        processed_scoring_data = model.indep_vars_processing(
            columns_to_remove=[], 
            additional_indep_cat_vars=[], 
            additional_indep_cont_vars=selected_independent_variables, 
            additional_dummy_vars=list(dummy_variables), 
            holiday_flag=False
        )
        # print(modelling_independent_variables)
        # print(selected_independent_variables)
        preserved_columns = ['observed', 'temperature']
        processed_scoring_data = adjust_and_finalize_data(processed_scoring_data,preserved_columns, modelling_independent_variables)
        # print(processed_scoring_data.head())
        # Blob names
        sub_folder_name = f"caltrack-{str(facility_id)}-{str(meter_type)}"
        model_blob_name = f"{sub_folder_name}/model.pkl"
        config_blob_name = f"{sub_folder_name}/config.pkl"

        loaded_model = download_buffer_from_blob(model_blob_name)
        loaded_config = download_buffer_from_blob(config_blob_name)
        print('model loaded successfully')
        if granularity == 'hourly':
            scoring_results = scoring_hourly_model(processed_scoring_data.copy(), loaded_model, loaded_config)
        else:
            scoring_results = scoring_daily_model(processed_scoring_data.copy(), eemeter_model = loaded_model['eemeter_model'],linear_model = loaded_model['linear_model'], loaded_config = loaded_config)
        #make a new table in db to store these results
        print('Data scoring successfully done. Saving results to DB...')
        scoring_results = scoring_results.reset_index()
        scoring_results['Timestamp'] = pd.to_datetime(scoring_results['Timestamp'])
        output_scoring_data_json = scoring_results.to_json(orient='records')
        insert_scoring_data(facility_id, meter_type, json.dumps(baseline_model_settings), output_scoring_data_json)
        return "Data scoring and saving to DB completed successfully", 200 #http ok
    except Exception as e:
        print(f"An error occurred: {e}")
        return str(e), 500  # HTTP 500 Internal Server Error

@app.route('/p4p_calc_summary', methods=['POST'])
def p4p_calculation():
    try:
        input_settings_p4p = request.get_json()
        meter_type = input_settings_p4p.get('meter_type')
        facility_id = int(input_settings_p4p.get('facility_id'))
        performance_start_date = pd.to_datetime(input_settings_p4p.get('start_date'))
        performance_end_date = pd.to_datetime(input_settings_p4p.get('end_date'))
        result = fetch_scoring_and_incentive_data(facility_id, meter_type)
        baseline_model_settings = result['baseline_model_settings']
        scoring_data_master = pd.DataFrame(result['scoring_data'])
        #assuming json automatically converts it into UTC
        # est_offset = pytz.FixedOffset(-300)  # UTC-5:00
        scoring_data_master['Timestamp'] = pd.to_datetime(scoring_data_master['Timestamp'],unit= 'ms')
        # scoring_data_master['Timestamp'] = scoring_data_master['Timestamp'].apply(lambda x: est_offset.localize(x))
        performance_scored_data = scoring_data_master[(scoring_data_master['Timestamp'] >= performance_start_date) & (scoring_data_master['Timestamp'] <= performance_end_date)]
        non_routine_adjustment_value = get_non_routine_adjustment_data(facility_id, meter_type, performance_start_date, performance_end_date)
        granularity = baseline_model_settings['granularity']
        pre_project_incentive = result['incentive_settings']['pre_project_incentive']
        on_peak_incentive = result['incentive_settings']['on_peak_incentive_rate']
        off_peak_incentive = result['incentive_settings']['off_peak_incentive_rate']
        minimum_savings = result['incentive_settings']['minimum_savings']

        if granularity == 'hourly':
            performance = P4P_metrics_calculation(performance_scored_data, non_routine_adjustment_value, 'hourly', off_peak_incentive, on_peak_incentive, minimum_savings,meter_type)
        else:
            performance = P4P_metrics_calculation(performance_scored_data, non_routine_adjustment_value, 'daily', off_peak_incentive, on_peak_incentive, minimum_savings,meter_type)
            
        performance_summary = performance.calculate_metrics()
        print("performance calculation done successfully")
        return jsonify(performance_summary)
    except Exception as e:
        print(f"An error occurred: {e}")
        return str(e), 500  # HTTP 500 Internal Server Error
    
@app.route('/get_performance_scoring_data', methods=['GET'])
def scoring_data_for_visual():
    try:
        facility_id = request.args.get('facility_id')
        meter_type = request.args.get('meter_type')
        # performance_start_date = pd.to_datetime(input_settings_p4p.get('start_date'))
        # performance_end_date = pd.to_datetime(input_settings_p4p.get('end_date'))
        query = """
        SELECT baseline_model_settings, scoring_data 
        FROM scoring_data_output 
        WHERE facility_id = %s AND meter_type = %s;
        """
        values = (facility_id, meter_type)
        result = db_execute(query, values, fetch=True)
        baseline_model_settings = result[0]
        # scoring_data_master = pd.DataFrame(result[1])
        # #assuming json automatically converts it into UTC
        # # est_offset = pytz.FixedOffset(-300)  # UTC-5:00
        # scoring_data_master['Timestamp'] = pd.to_datetime(scoring_data_master['Timestamp'],unit= 'ms')
        # scoring_data_master['Timestamp'] = scoring_data_master['Timestamp'].apply(lambda x: est_offset.localize(x))
        return result[1]
    except Exception as e:
        print(f"An error occurred: {e}")
        return str(e), 500  # HTTP 500 Internal Server Error

if __name__ == "__main__":
    app.run(host="0.0.0.0",debug=True,port =5004)