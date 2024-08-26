import psycopg2.extras

import config
import psycopg2
import psycopg2.extras
import pandas as pd
from sshtunnel import SSHTunnelForwarder


def get_db_connection():
    if not config.LOCAL:
        server = SSHTunnelForwarder(
            (config.ssh_ip, 22),
            ssh_username=config.ssh_user,
            ssh_private_key=config.private_key_path,
            remote_bind_address=(config.ssh_bind_address, 5432)
        )
        server.start()
        params = {
            'database': config.db_creds[0],
            'user': config.db_creds[1],
            'password': config.db_creds[2],
            'host': config.db_creds[3],
            'port': server.local_bind_port
        }
        conn = psycopg2.connect(**params)
        return conn  # , server  # Return the server object for later stopping
    else:
        params = {
            'database': config.db_creds[0],
            'user': config.db_creds[1],
            'password': config.db_creds[2],
            'host': config.db_creds[3],
            'port': config.port  # Assuming the database is directly accessible on this port
        }
        return psycopg2.connect(**params)


def dbtest(query):
    conn = get_db_connection()
    curs = conn.cursor()
    curs.execute(query)
    rows = curs.fetchall()
    colnames = [desc[0] for desc in curs.description]
    df = pd.DataFrame(rows, columns=colnames)
    curs.close()
    conn.close()
    return df


def execute_query(query, params=None):
    """
    Executes a given SQL query with optional parameters.

    :param query: The SQL query to be executed.
    :param params: A tuple of parameters to be passed to the SQL query.
    :return: A tuple containing a boolean status and a message.
    """
    try:
        conn = get_db_connection()
        curs = conn.cursor()
        if params:
            curs.execute(query, params)
        else:
            curs.execute(query)
        conn.commit()  # Commit the transaction
        return True, "Query executed successfully"
    except psycopg2.Error as e:
        return False, f'Something went wrong: {e}'
    finally:
        if curs:
            curs.close()
        if conn:
            conn.close()


# def execute_query(query):
#     """
#
#     :param query: delete from independent_variable_file where processed = false and id=
#     :return:
#     """
#     try:
#         conn = get_db_connection()
#         curs = conn.cursor()
#         curs.execute(query)
#         curs.close()
#         conn.close()
#         return True, "Query Executed Successfully"
#     except:
#         return False, 'Something went wrong'


def db_execute(query, values):
    conn = get_db_connection()
    curs = conn.cursor()
    psycopg2.extras.execute_batch(curs, query, values)
    conn.commit()
    curs.close()
    conn.close()


def fetch_nearest_station_data(target_latitude, target_longitude):
    query = f"""
    WITH NearestStations AS (
        SELECT *,
               ST_Distance(
                   ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
                   ST_SetSRID(ST_MakePoint({target_longitude}, {target_latitude}), 4326)::geography
               ) AS distance
        FROM weather_data
        ORDER BY distance
        LIMIT 3
    )
    SELECT *
    FROM NearestStations
    ORDER BY distance
    LIMIT 1;
    """
    conn = get_db_connection()
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df


# Function to fetch additional nearest stations data
def fetch_additional_stations_data(target_latitude, target_longitude):
    query = f"""
    WITH NearestStations AS (
        SELECT *,
               ST_Distance(
                   ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
                   ST_SetSRID(ST_MakePoint({target_longitude}, {target_latitude}), 4326)::geography
               ) AS distance
        FROM weather_data
        ORDER BY distance
        LIMIT 3
    )
    SELECT *
    FROM NearestStations
    ORDER BY distance
    OFFSET 1
    LIMIT 2;
    """
    conn = get_db_connection()
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df


def db_execute_single(query, values):
    query_with_returning = query + " RETURNING id"
    conn = get_db_connection()
    curs = conn.cursor()

    try:
        curs.execute(query_with_returning, values)
        generated_id = curs.fetchone()[0]
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error executing query: {e}")
        generated_id = None
    finally:
        curs.close()
        conn.close()

    return generated_id


def refresh_materialised_view(view='epp.combined_meter_weather_readings'):
    query = f"REFRESH MATERIALIZED VIEW {view};"
    conn = get_db_connection()
    curs = conn.cursor()
    curs.execute(query, None)
    curs.close()
    conn.close()





def bulk_insert_df(df, table_name, record_id, file_table):
    cols = ','.join(list(df.columns))
    vals_placeholder = ','.join(['%s' for _ in df.columns])
    insert_query = f"INSERT INTO {table_name} ({cols}) VALUES ({vals_placeholder})"
    update_query = f"UPDATE {file_table} SET processed = true WHERE id = %s"
    tuples = list(df.itertuples(index=False, name=None))

    def db_execute(insert_query, update_query, insert_values, update_value):
        conn = get_db_connection()
        curs = conn.cursor()
        psycopg2.extras.execute_batch(curs, insert_query, insert_values)
        conn.commit()
        curs.execute(update_query, (update_value,))
        conn.commit()
        curs.close()
        conn.close()

    db_execute(insert_query, update_query, tuples, record_id)


def update_workflow(field, facility):
    query = "UPDATE epp.workflow set {} =true where facility_id ={}".format(field, facility)
    conn = get_db_connection()
    curs = conn.cursor()
    curs.execute(query)
    conn.commit()
    curs.close()
    conn.close()




