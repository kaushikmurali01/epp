import pandas as pd
import psycopg2
import psycopg2.extras
from sshtunnel import SSHTunnelForwarder
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import pickle
import enerva_config as config_varun
from azure.storage.blob import BlobServiceClient
import io
import json

def db_execute(query, values, fetch=False):
    conn = None
    curs = None
    try:
        with SSHTunnelForwarder(
            (config_varun.ssh_ip, 22),
            ssh_private_key=config_varun.private_key_path,
            ssh_username=config_varun.ssh_user,
            remote_bind_address=(config_varun.ssh_bind_address, 5432)
        ) as server:
            server.start()
            # print("SSH tunnel established")

            params = {
                'database': config_varun.db_creds[0],
                'user': config_varun.db_creds[1],
                'password': config_varun.db_creds[2],
                'host': 'localhost',  # Connect to the local end of the tunnel
                'port': server.local_bind_port  # Local port assigned by SSH tunnel
            }

            conn = psycopg2.connect(**params)
            curs = conn.cursor()

            # Execute the query with parameters
            curs.execute(query, values)

            # Fetch data if required
            result = None
            if fetch:
                result = curs.fetchone()

            conn.commit()
            return result
    except Exception as e:
        print("Database operation failed:", str(e))
        return None
    finally:
        # Ensure cursor and connection are closed
        if curs:
            curs.close()
        if conn:
            conn.close()
        
# def db_execute(query, values):
#     with SSHTunnelForwarder(
#             (config.SSH_IP, 22),
#             ssh_private_key=config.KEY_PATH,
#             ssh_username=config.SSH_USER,
#             remote_bind_address=(config.DB_HOST, 5432)
#     ) as server:
#         server.start()
#         # print("server connected")

#         params = {
#             'database': config.DATABASE_NAME,
#             'user': config.USER,
#             'password': config.PASSWORD,
#             'host': config.LOCAL_HOST,
#             'port': config.PORT
#         }

#         conn = psycopg2.connect(**params)
#         curs = conn.cursor()
#         # print("database connected")

#         psycopg2.extras.execute_batch(curs, query, values)
#         conn.commit()
#         curs.close()
#         conn.close()
#         # print("Data inserted successfully")

# Database functions
# def db_execute(query, values, fetch=False):
#     conn = None
#     try:
#         if config.LOCAL:
#             # import pdb;pdb.set_trace()
#             with SSHTunnelForwarder(
#                     (config.SSH_IP, 22),
#                     ssh_private_key=config.KEY_PATH,
#                     ssh_username=config.SSH_USER,
#                     remote_bind_address=(config.DB_HOST, 5432)) as server:
#                 local_port = server.local_bind_port
#                 params = {
#                     'database': config.DATABASE_NAME,
#                     'user': config.USER,
#                     'password': config.PASSWORD,
#                     'host': '127.0.0.1',  # Localhost for SSH tunnel
#                     'port': '5432'   # Local bind port
#                 }
#                 conn = psycopg2.connect(**params)
#         else:
#             params = {
#                 'database': config.DATABASE_NAME,
#                 'user': config.USER,
#                 'password': config.PASSWORD,
#                 'host': config.DB_HOST,
#                 'port': config.PORT
#             }
#             conn = psycopg2.connect(**params)
        
#         curs = conn.cursor()
#         curs.execute(query, values)
#         result = None
#         if fetch:
#             result = curs.fetchone()
#         conn.commit()
#         curs.close()
#         return result
#     except Exception as e:
#         print(f"Database connection failed: {e}")
#     finally:
#         if conn:
#             conn.close()

def push_data_to_db(predicted_data, facility_id, meter_type, model_metrics, baseline_summary_performance_page, table_name):
    # Convert DataFrame to JSON strings for the output_data column
    output_data_json = predicted_data.to_json(orient='records')

    # Convert baseline_summary_performance_page JSON to a string
    baseline_data_summary_json = json.dumps(baseline_summary_performance_page)

    #model metrics json to string
    model_metrics_summary_json = json.dumps(model_metrics)

    # Create a list of tuples for insertion
    values = [(facility_id, output_data_json, baseline_data_summary_json,meter_type,model_metrics_summary_json)]

    # Create the SQL insert query
    query = f"""
    INSERT INTO {table_name} (facility_id, output_data, baseline_data_summary,meter_type,model_metrics_summary)
    VALUES (%s, %s, %s, %s, %s)
    """
    # Execute the query
    db_execute(query, values)


def push_dataframe_to_db(df, table_name):
    # Generate tuples from the DataFrame rows
    tuples = [tuple(x) for x in df.to_numpy()]

    # Comma-separated column names
    columns = ', '.join(list(df.columns))
    values = ', '.join(['%s'] * len(df.columns))

    query = f"INSERT INTO {table_name} ({columns}) VALUES ({values})"
    db_execute(query, tuples)
    
def push_json_to_db(json_data, table_name, json_column_name):
    # Convert JSON data to a string suitable for SQL insertion
    json_str = json.dumps(json_data)

    # Create the SQL insert query
    query = f"INSERT INTO {table_name} ({json_column_name}) VALUES (%s)"

    # Execute the query with the json string
    db_execute(query, (json_str,))

def fetch_table_data(table_name):
    query = f"SELECT * FROM {table_name};"
    return db_fetch_data(query)

def db_fetch_data(query):
    with SSHTunnelForwarder(
        (config.ssh_ip, 22),
        ssh_private_key=config.private_key_path,
        ssh_username=config.ssh_user,
        remote_bind_address=(config.ssh_bind_address, 5432)
    ) as server:
        server.start()
        params = {
        'database': config.DATABASE_NAME,
        'user': config.USER,
        'password': config.PASSWORD,
        'host': config.DB_HOST,
        'port': config.PORT
        }
        conn = psycopg2.connect(**params)
        df = pd.read_sql_query(query, conn)
        conn.close()
    return df


def upload_blob_from_buffer(storage_connection_string, container_name, blob_name, buffer):
    blob_service_client = BlobServiceClient.from_connection_string(storage_connection_string)
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    blob_client.upload_blob(buffer, overwrite=True)
    print(f"Upload of {blob_name} completed successfully.")

def download_buffer_from_blob(storage_connection_string, container_name, blob_name):
    """
    Download a blob from Azure Blob Storage and return it as a buffer.
    """
    blob_service_client = BlobServiceClient.from_connection_string(storage_connection_string)
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    
    # Download blob as a stream
    downloaded_blob = blob_client.download_blob()
    buffer = io.BytesIO(downloaded_blob.readall())
    buffer.seek(0)  # Rewind the buffer to the beginning after reading

    print(f"Download of {blob_name} completed successfully.")
    return buffer


# # Azure Blob Storage functions
# def upload_pickle_to_blob(container_name, blob_name, data_object):
#     blob_service_client = BlobServiceClient.from_connection_string(config.storage_connection_string)
#     blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
#     serialized_data = pickle.dumps(data_object)
#     blob_client.upload_blob(serialized_data, overwrite=True)

# def download_pickle_from_blob(container_name, blob_name):
#     blob_service_client = BlobServiceClient.from_connection_string(config.storage_connection_string)
#     blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
#     blob_data = blob_client.download_blob().readall()
#     data_object = pickle.loads(blob_data)
#     return data_object