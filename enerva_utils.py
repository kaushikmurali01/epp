import pandas as pd
import psycopg2
import psycopg2.extras
from sshtunnel import SSHTunnelForwarder
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import pickle
from azure.storage.blob import BlobServiceClient
import io
import json
from io import BytesIO
import requests

import config


def get_db_connection():
    if config.LOCAL:
        server = SSHTunnelForwarder(
            (config.SSH_IP, 22),
            ssh_username=config.SSH_USER,
            ssh_private_key=config.KEY_PATH,
            remote_bind_address=(config.DB_HOST, 5432)
        )
        server.start()
        params = {
            'database': config.DATABASE_NAME,
            'user': config.USER,
            'password': config.PASSWORD,
            'host': '127.0.0.1',  # Use localhost since we're using SSH tunneling
            'port': server.local_bind_port
        }
        conn = psycopg2.connect(**params)
        return conn  # , server  # Return the server object for later stopping
    else:
        params = {
            'database': config.DATABASE_NAME,
            'user': config.USER,
            'password': config.PASSWORD,
            'host': config.DB_HOST,
            'port': config.PORT
        }
        return psycopg2.connect(**params)


def db_execute(query, values, fetch=False, fetchall=False):
    conn = None
    curs = None
    try:
        conn = get_db_connection()  # Assumes existing function to get database connection
        curs = conn.cursor()

        # Execute the query with parameters
        curs.execute(query, values)  # Use `values` directly without indexing
        print('DB Query executed')
        result = None
        column_names = []

        # Fetch data if required
        if fetch:
            result = curs.fetchone()
        elif fetchall:
            result = curs.fetchall()
            if result:
                column_names = [desc[0] for desc in curs.description]
        
        conn.commit()
        if fetchall:
            return result, column_names
        return result

    except Exception as e:
        print("Database operation failed:", str(e))
        return None, []
    finally:
        # Ensure cursor and connection are closed
        if curs:
            curs.close()
        if conn:
            conn.close()


    # try:
    #     with SSHTunnelForwarder(
    #         (enerva_config.ssh_ip, 22),
    #         ssh_private_key=enerva_config.private_key_path,
    #         ssh_username=enerva_config.ssh_user,
    #         remote_bind_address=(enerva_config.ssh_bind_address, 5432)
    #     ) as server:
    #         server.start()
    #         # print("SSH tunnel established")
    #
    #         params = {
    #             'database': enerva_config.db_creds[0],
    #             'user': enerva_config.db_creds[1],
    #             'password': enerva_config.db_creds[2],
    #             'host': 'localhost',  # Connect to the local end of the tunnel
    #             'port': server.local_bind_port  # Local port assigned by SSH tunnel
    #         }
    #
    #         conn = psycopg2.connect(**params)
    #         curs = conn.cursor()
    #
    #         # Execute the query with parameters
    #         curs.execute(query, values)
    #
    #         # Fetch data if required
    #         result = None
    #         if fetch:
    #             result = curs.fetchone()
    #
    #         conn.commit()
    #         return result
    # except Exception as e:
    #     print("Database operation failed:", str(e))
    #     return None
    # finally:
    #     # Ensure cursor and connection are closed
    #     if curs:
    #         curs.close()
    #     if conn:
    #         conn.close()


# def push_data_to_db(predicted_data, facility_id, meter_type, model_metrics, baseline_summary_performance_page, table_name):
    # # Convert DataFrame to JSON strings for the output_data column
    # output_data_json = predicted_data.to_json(orient='records')

    # # Convert baseline_summary_performance_page JSON to a string
    # baseline_data_summary_json = json.dumps(baseline_summary_performance_page)

    # #model metrics json to string
    # model_metrics_summary_json = json.dumps(model_metrics)

    # # Create a list of tuples for insertion
    # values = [(facility_id, output_data_json, baseline_data_summary_json,meter_type,model_metrics_summary_json)]

    # # Create the SQL insert query
    # query = f"""
    # INSERT INTO {table_name} (facility_id, output_data, baseline_data_summary,meter_type,model_metrics_summary)
    # VALUES (%s, %s, %s, %s, %s)
    # """
    # # Execute the query
    # db_execute(query, values)


# def push_dataframe_to_db(df, table_name):
#     # Generate tuples from the DataFrame rows
#     tuples = [tuple(x) for x in df.to_numpy()]

#     # Comma-separated column names
#     columns = ', '.join(list(df.columns))
#     values = ', '.join(['%s'] * len(df.columns))

#     query = f"INSERT INTO {table_name} ({columns}) VALUES ({values})"
#     db_execute(query, tuples)
    
# def push_json_to_db(json_data, table_name, json_column_name):
#     # Convert JSON data to a string suitable for SQL insertion
#     json_str = json.dumps(json_data)

#     # Create the SQL insert query
#     query = f"INSERT INTO {table_name} ({json_column_name}) VALUES (%s)"

#     # Execute the query with the json string
#     db_execute(query, (json_str,))

# def fetch_table_data(table_name):
#     query = f"SELECT * FROM {table_name};"
#     return db_fetch_data(query)

# def db_fetch_data(query):
#     conn = get_db_connection()
#     curs = conn.cursor()

#     # with SSHTunnelForwarder(
#     #     (config.ssh_ip, 22),
#     #     ssh_private_key=config.private_key_path,
#     #     ssh_username=config.ssh_user,
#     #     remote_bind_address=(config.ssh_bind_address, 5432)
#     # ) as server:
#     #     server.start()
#     #     params = {
#     #     'database': config.DATABASE_NAME,
#     #     'user': config.USER,
#     #     'password': config.PASSWORD,
#     #     'host': config.DB_HOST,
#     #     'port': config.PORT
#     #     }
#     # conn = psycopg2.connect(**params)
#     df = pd.read_sql_query(query, conn)
#     conn.close()
#     return df


def upload_blob_from_buffer(blob_name, buffer):

    storage_connection_string = f"DefaultEndpointsProtocol=https;AccountName={config.ACCOUNT_NAME};AccountKey={config.STORAGE_ACCOUNT_KEY};EndpointSuffix={config.END_POINT_SUFFIX}"
    blob_service_client = BlobServiceClient.from_connection_string(storage_connection_string)
    blob_client = blob_service_client.get_blob_client(container=config.CONTAINER_NAME, blob=blob_name)
    blob_client.upload_blob(buffer, overwrite=True)
    print(f"Upload of {blob_name} completed successfully.")

def download_buffer_from_blob(blob_name):
    
    """
    Download a blob from Azure Blob Storage and return it as a buffer.
    """
    storage_connection_string = f"DefaultEndpointsProtocol=https;AccountName={config.ACCOUNT_NAME};AccountKey={config.STORAGE_ACCOUNT_KEY};EndpointSuffix={config.END_POINT_SUFFIX}"
    blob_service_client = BlobServiceClient.from_connection_string(storage_connection_string)
    blob_client = blob_service_client.get_blob_client(container=config.CONTAINER_NAME, blob=blob_name)
    
    # Download blob as a stream
    downloaded_blob = blob_client.download_blob()
    buffer = io.BytesIO(downloaded_blob.readall())
    buffer.seek(0)  # Rewind the buffer to the beginning after reading
    # Unpickle the buffer to get the original object
    obj = pickle.load(buffer)
    
    print(f"Download and unpickling of {blob_name} completed successfully.")
    return obj

def download_non_routine_file_from_url(url, save_path=None):
    """
    Download a file from a given URL by extracting the file extension before the query string and optionally save it to the specified local path or return as a DataFrame.

    Args:
    url (str): URL of the file to download.
    save_path (str, optional): Local path where the file should be saved, if None, returns DataFrame.

    Returns:
    pd.DataFrame or None: DataFrame if save_path is None, else None.
    """
    try:
        # Extract the filename before the query string
        base_url = url.split('?')[0]
        file_extension = base_url.split('.')[-1].lower()

        response = requests.get(url)
        if response.status_code == 200:
            if save_path:
                with open(save_path, 'wb') as f:
                    f.write(response.content)
                print(f"File downloaded successfully and saved to {save_path}")
                return None
            else:
                content = BytesIO(response.content)
                if file_extension == 'csv':
                    df = pd.read_csv(content)
                    print("CSV file loaded into DataFrame successfully.")
                elif file_extension == 'xlsx':
                    df = pd.read_excel(content)
                    print("Excel file loaded into DataFrame successfully.")
                else:
                    print("Unknown file type based on URL extension.")
                    return None
                return df
        else:
            print(f"Failed to download the file. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"An error occurred while downloading the file: {e}")
        return None

import pandas as pd

def get_non_routine_adjustment_data(facility_id, meter_type, start_date, end_date):
    """
    Fetches and calculates non-routine adjustment data based on the specified parameters.

    Args:
    facility_id (int): Facility ID for filtering.
    meter_type (int): Meter type for filtering.
    start_date (str): Start date in 'YYYY-MM-DD' format.
    end_date (str): End date in 'YYYY-MM-DD' format.
    db_execute (function): Function to execute database queries.
    download_non_routine_file_from_url (function): Function to download files from URLs and return as DataFrame.

    Returns:
    DataFrame: The resulting DataFrame containing the filtered data.
    float: Total non-routine adjustment including direct entries and values from URLs.
    """
    query = """
    SELECT
        nrdem.id, 
        nrdem.type,
        nrm.id AS nrm_id,
        nrm.event_name,
        nrdem.start_date,
        nrdem.end_date,
        nrm.facility_id,
        nrm.meter_type,
        CASE 
            WHEN nrdem.type = 1 THEN nrdem.non_routine_adjustment
            WHEN nrdem.type = 2 THEN nrdem.file_url
            ELSE NULL
        END AS result
    FROM
        non_routine_model nrm
    JOIN
        non_routine_data_entry_model nrdem ON nrm.id = nrdem.non_routine_id
    WHERE
        nrm.facility_id = %s AND
        nrm.meter_type = %s AND
        (
            (nrdem.type = 1 AND nrdem.start_date >= %s AND nrdem.end_date <= %s)
            OR
            nrdem.type = 2
        );
    """

    # Define parameters
    params = (facility_id, meter_type, start_date, end_date)
    try:
        # Execute the query
        results = db_execute(query, params, fetch=False, fetchall=True)
        data = results[0]
        # Variables to store results
        non_routine_from_direct_entry = 0
        non_routine_adjustment_from_urls = 0
        urls = []
        # Process results
        if data:
            for row in data:
                if row[1] == 1:  # Check if type is 1
                    non_routine_from_direct_entry += float(row[8])  # Assuming 'result' is at index 8
                elif row[1] == 2:  # Check if type is 2
                    urls.append(row[8])  # Assuming 'result' is at index 8

        # Initialize an empty DataFrame
        non_routine_dfs = pd.DataFrame()
        # Loop through each URL, download the DataFrame, and concatenate directly
        for url in urls:
            df_url = download_non_routine_file_from_url(url)
            if df_url is not None:
                # Concatenate directly to the main DataFrame
                non_routine_dfs = pd.concat([non_routine_dfs, df_url], ignore_index=True)
                print("non-routine data fetched from urls")
                # print(non_routine_dfs)
        # Apply the filter and calculate the total adjustment
        if not non_routine_dfs.empty:
            non_routine_dfs['Start Date (Required)'] = pd.to_datetime(non_routine_dfs['Start Date (Required)'])
            non_routine_dfs['End Date (Required)'] = pd.to_datetime(non_routine_dfs['End Date (Required)'])
            # Applying the filter
            non_routine_dfs_filtered = non_routine_dfs[(non_routine_dfs['Start Date (Required)'] >= pd.to_datetime(start_date)) & (non_routine_dfs['End Date (Required)'] <= pd.to_datetime(end_date))]
            non_routine_adjustment_from_urls = non_routine_dfs_filtered['Meter Reading (Required)'].sum()

        total_non_routine_adjustment = non_routine_adjustment_from_urls + non_routine_from_direct_entry
        # print(total_non_routine_adjustment)
        return  total_non_routine_adjustment
    except:
        # print("i got an error")
        return None
    

def fetch_data_from_api(facility_id, meter_type, start_date, end_date):
    # Define the API endpoint
    url = "https://ams-enerva-dev.azure-api.net/v1/get_clean_data"

    # Set up parameters for the GET request
    params = {
        'facility_id': facility_id,
        'meter_type' : meter_type,
        'start_date': start_date,
        'end_date': end_date
    }

    # Make the GET request
    response = requests.get(url, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        # Process the data (assuming JSON response)
        data = response.json()
        return data
    else:
        # Handle errors (you might want to raise an exception or return an error message)
        return f"Failed to fetch data: {response.status_code}"
    
def get_independent_vars_names(selected_independent_variables_ids, facility_id):
    # SQL query to retrieve all independent variables for the given facility
    iv_mapping_query = "SELECT id, name FROM independent_variable WHERE facility_id= %s"
    
    # Execute the database query
    mapping_values, cols = db_execute(iv_mapping_query, (facility_id,), fetchall=True)
    
    # Convert the list of tuples to a dictionary for easier access
    iv_dict = {id_: name for id_, name in mapping_values}
    
    # Filter the names based on selected IDs
    selected_names = [iv_dict[id_] for id_ in selected_independent_variables_ids if id_ in iv_dict]
    
    return selected_names

def insert_scoring_data(facility_id, meter_type, baseline_model_settings, scoring_data):
    # SQL INSERT statement
    query = """
    INSERT INTO scoring_data_output (facility_id, meter_type, baseline_model_settings, scoring_data)
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (facility_id, meter_type) DO UPDATE
    SET meter_type = EXCLUDED.meter_type,
        baseline_model_settings = EXCLUDED.baseline_model_settings,
        scoring_data = EXCLUDED.scoring_data;
    """

    # Tuple of values to be inserted
    values = (facility_id, meter_type, baseline_model_settings, scoring_data)

    # Use the db_execute function to run the query
    db_execute(query, values)

def fetch_scoring_and_incentive_data(facility_id, meter_type):
    """
    Fetches scoring data and conditional incentive settings based on facility ID and meter type.
    
    Parameters:
    facility_id (int): The ID of the facility.
    meter_type (int): The type of meter.

    Returns:
    dict: A dictionary containing baseline model settings, scoring data, and incentive settings.
    """
    # SQL query to fetch data
    query = """
    SELECT 
        a.baseline_model_settings, 
        a.scoring_data, 
        CASE WHEN a.meter_type = 1 THEN b.pre_project_incentive ELSE NULL END as pre_project_incentive,
        CASE WHEN a.meter_type = 1 THEN b.on_peak_incentive_rate ELSE NULL END as on_peak_incentive_rate,
        CASE WHEN a.meter_type = 1 THEN b.off_peak_incentive_rate ELSE NULL END as off_peak_incentive_rate,
        CASE WHEN a.meter_type = 1 THEN b.minimum_savings ELSE NULL END as minimum_savings
    FROM 
        scoring_data_output a
    LEFT JOIN 
        incentive_settings b ON a.facility_id = b.facility_id 
    WHERE 
        a.facility_id = %s AND a.meter_type = %s;
    """
    
    # Execute the query
    values = (facility_id, meter_type)
    result = db_execute(query, values, fetch=True)
    
    # Prepare the results to return
    if result:
        return {
            'baseline_model_settings': result[0],
            'scoring_data': result[1],
            'incentive_settings': {
                'pre_project_incentive': float(result[2]) if result[2] is not None else 0.0,
                'on_peak_incentive_rate': float(result[3]) if result[3] is not None else 0.0,
                'off_peak_incentive_rate': float(result[4]) if result[4] is not None else 0.0,
                'minimum_savings': float(result[5]) if result[5] is not None else 0.0
            }
        }
    else:
        print("No data found for the given facility_id and meter_type.")
        return None