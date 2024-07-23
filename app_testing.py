from flask import Flask, jsonify, request
from enerva import *
app = Flask(__name__)
 
@app.route('/model_summary', methods = ['POST'])

def evaluate_model():
    print(request.get_json())
   # Extract the JSON object from the request
    input_settings = request.get_json()

    # Extract the required values
    granularity = input_settings.get('granularity')
    weather_station = input_settings.get('weatherStation')
    independent_variables = input_settings.get('independent_variables')
    additional_indep_cont_vars = [key for key, value in independent_variables.items() if value]
    dummy_variables = input_settings.get('dummyVariables')
    additional_dummy_vars = [key for key, value in dummy_variables.items() if value]

    cpi = pd.read_excel("CPI_hourly_data.xlsx")
    baseline_start_date = pd.to_datetime(input_settings.get('min_date'))
    baseline_end_date = pd.to_datetime(input_settings.get('max_date'))
    baseline_data = cpi
    # [(cpi['Timestamp'] >= baseline_start_date) & (cpi['Timestamp'] <= baseline_end_date)]
    
    hourly_model = EnergyModel()
    hourly_model.load_process_data(baseline_data)
    processed_baseline_data_hourly = hourly_model.indep_vars_processing(columns_to_remove = ['Flag', 'Holiday', 'TOW'], additional_indep_cat_vars = [],additional_indep_cont_vars = additional_indep_cont_vars ,additional_dummy_vars = additional_dummy_vars, holiday_flag = True)
    hourly_model.feature_engineering_eemeter_hourly_model(processed_baseline_data_hourly,"three_month_weighted")
    hourly_model.training_hourly_model()
    predicted_hourly_data = hourly_model.scoring_hourly_model(processed_baseline_data_hourly)
    results_summary = hourly_model.evaluate(predicted_hourly_data)
    
    return jsonify(results_summary)
    


# def dbtest(query):
#     with SSHTunnelForwarder(
#          ('172.183.211.211', 22),
#          ssh_private_key="C:/Users/Akash Jain/Downloads/vmkey.pem",
#          ### in my case, I used a password instead of a private key
#          ssh_username="ubuntu",
#          # ssh_password="<mypasswd>",
#          remote_bind_address=('epp-dev-db.postgres.database.azure.com', 5432)) as server:
#          server.start()
#          #print("server connected")
   
#          params = {
#              'database': 'postgres',
#              'user': 'epp',
#              'password': '3pp#db9$',
#              'host': 'localhost',
#              'port': server.local_bind_port
#              }
   
#          conn = psycopg2.connect(**params)
#          curs = conn.cursor()
#          #print("database connected")
#          curs.execute(query)
#          rows = curs.fetchall()
#          # Fetch all rows from the result set
#          colnames = [desc[0] for desc in curs.description]
       
#         # Create DataFrame from rows
#          df = pd.DataFrame(rows, columns=colnames)
       
#          return df

if __name__ == '__main__':
 
    app.run(host="0.0.0.0", debug=True)

# from flask import Flask, jsonify, request
# from enerva import *
# import requests
# import json
# app = Flask(__name__)

# @app.route('/model_summary', methods = ['POST'])

# def evaluate_model():
#     input_settings = request.get_json()
#     url = 'https://ams-enerva-dev.azure-api.net/v1/insert_clean_data'
#     cleansed_data_response = requests.post(url, json = input_settings)
#     cleaned_data = pd.DataFrame(cleansed_data_response.json()['clean_data'])
#     cleaned_data['Date'] = pd.to_datetime(cleaned_data['Date'])
#     modelling_columns = ['Date',  'EnergyConsumption', 'Temperature']

#     granularity = input_settings.get('granularity')
#     additional_indep_cont_vars = input_settings.get('independent_variables')
#     additional_indep_cont_vars = [str(x) for x in additional_indep_cont_vars]
#     # cpi = pd.read_excel("CPI_hourly_data.xlsx")
#     baseline_start_date = pd.to_datetime(input_settings.get('start_date'))
#     baseline_end_date = pd.to_datetime(input_settings.get('end_date'))
#     baseline_data = cleaned_data[(cleaned_data['Date'] >= baseline_start_date) & (cleaned_data['Date'] <= baseline_end_date)]
#     baseline_data = baseline_data[modelling_columns + additional_indep_cont_vars]
#     baseline_data = baseline_data.rename(columns = {'Date' : 'Timestamp', 'EnergyConsumption' : 'Energy Use [kW]', 'Temperature' : 'OAT'})

#     if granularity == 'hourly':
#         if "dummyVariables" in input_settings:
#             # admin
#             dummy_variables = input_settings.get('dummyVariables')
#             additional_dummy_vars = [key for key, value in dummy_variables.items() if value]

#             hourly_model = EnergyModel()
#             hourly_model.load_process_data(baseline_data)
#             processed_baseline_data_hourly = hourly_model.indep_vars_processing(columns_to_remove = [], additional_indep_cat_vars = [],additional_indep_cont_vars = additional_indep_cont_vars ,additional_dummy_vars = additional_dummy_vars, holiday_flag = True)
#             hourly_model.feature_engineering_eemeter_hourly_model(processed_baseline_data_hourly,"three_month_weighted")
#             hourly_model.training_hourly_model()
#             predicted_hourly_data = hourly_model.scoring_hourly_model(processed_baseline_data_hourly)
#             results_summary = hourly_model.evaluate(predicted_hourly_data)
#         else:
#             # user
#             hourly_model = EnergyModel()
#             hourly_model.load_process_data(baseline_data)
#             processed_baseline_data_hourly = hourly_model.indep_vars_processing(columns_to_remove = [], additional_indep_cat_vars = [],additional_indep_cont_vars = additional_indep_cont_vars ,additional_dummy_vars = [], holiday_flag = True)
#             hourly_model.feature_engineering_eemeter_hourly_model(processed_baseline_data_hourly,"three_month_weighted")
#             hourly_model.training_hourly_model()
#             predicted_hourly_data = hourly_model.scoring_hourly_model(processed_baseline_data_hourly)
#         else:
#         if "dummyVariables" in input_settings:
#             # admin
#             dummy_variables = input_settings.get('dummyVariables')
#             additional_dummy_vars = [key for key, value in dummy_variables.items() if value]

#             Daily_model = EnergyModel()
#             Daily_model.load_process_data(baseline_data)
#             processed_baseline_data = Daily_model.indep_vars_processing(columns_to_remove = [], additional_indep_cat_vars = [],additional_indep_cont_vars = additional_indep_cont_vars ,additional_dummy_vars = additional_dummy_vars, holiday_flag = True)
#             Daily_model.training_daily_model(processed_baseline_data,True)
#             predicted_Daily_data = Daily_model.scoring_daily_model(processed_baseline_data,True)
#             results_summary = Daily_model.evaluate(predicted_Daily_data)
#         else:
#             # user
#             Daily_model = EnergyModel()
#             Daily_model.load_process_data(baseline_data)
#             processed_baseline_data = Daily_model.indep_vars_processing(columns_to_remove = [], additional_indep_cat_vars = [],additional_indep_cont_vars = additional_indep_cont_vars ,additional_dummy_vars = additional_dummy_vars, holiday_flag = True)
#             Daily_model.training_daily_model(processed_baseline_data,True)
#             predicted_Daily_data = Daily_model.scoring_daily_model(processed_baseline_data,True)
#             results_summary = Daily_model.evaluate(predicted_Daily_data)
#         return jsonify(results_summary)


# if __name__ == '__main__':

#     app.run(host="0.0.0.0", debug=True, port =5004)
                                                                                                                              7,1           Top