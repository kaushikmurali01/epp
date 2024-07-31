import pandas as pd
import psycopg2
import psycopg2.extras
from sshtunnel import SSHTunnelForwarder
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import pickle
from azure.storage.blob import BlobServiceClient
import io
import json

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


def db_execute(query, values, fetch=False):
    try:
        conn = get_db_connection()
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
    conn = get_db_connection()
    curs = conn.cursor()

    # with SSHTunnelForwarder(
    #     (config.ssh_ip, 22),
    #     ssh_private_key=config.private_key_path,
    #     ssh_username=config.ssh_user,
    #     remote_bind_address=(config.ssh_bind_address, 5432)
    # ) as server:
    #     server.start()
    #     params = {
    #     'database': config.DATABASE_NAME,
    #     'user': config.USER,
    #     'password': config.PASSWORD,
    #     'host': config.DB_HOST,
    #     'port': config.PORT
    #     }
    # conn = psycopg2.connect(**params)
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df


def upload_blob_from_buffer(blob_name, buffer):

    storage_connection_string = f"DefaultEndpointsProtocol=https;AccountName={config.account_name};AccountKey={config.storage_account_key};EndpointSuffix={config.end_point_suffix}"
    blob_service_client = BlobServiceClient.from_connection_string(storage_connection_string)
    blob_client = blob_service_client.get_blob_client(container=config.container_name, blob=blob_name)
    blob_client.upload_blob(buffer, overwrite=True)
    print(f"Upload of {blob_name} completed successfully.")

def download_buffer_from_blob(blob_name):
    
    """
    Download a blob from Azure Blob Storage and return it as a buffer.
    """
    storage_connection_string = f"DefaultEndpointsProtocol=https;AccountName={config.account_name};AccountKey={config.storage_account_key};EndpointSuffix={config.end_point_suffix}"
    blob_service_client = BlobServiceClient.from_connection_string(storage_connection_string)
    blob_client = blob_service_client.get_blob_client(container=config.container_name, blob=blob_name)
    
    # Download blob as a stream
    downloaded_blob = blob_client.download_blob()
    buffer = io.BytesIO(downloaded_blob.readall())
    buffer.seek(0)  # Rewind the buffer to the beginning after reading
    # Unpickle the buffer to get the original object
    obj = pickle.load(buffer)
    
    print(f"Download and unpickling of {blob_name} completed successfully.")
    return obj