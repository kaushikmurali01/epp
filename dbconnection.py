import psycopg2
from sshtunnel import SSHTunnelForwarder
import pandas as pd
import psycopg2.extras
import config


def dbtest(query):
    with SSHTunnelForwarder(
            (config.ssh_ip, 22),
            ssh_username=config.ssh_user,
            ssh_private_key=config.private_key_path,
        #    ssh_password=config.ssh_password,  # Assuming you use a password
            remote_bind_address=(config.ssh_bind_address, 5432)
    ) as server:
        server.start()
        params = {
            'database': config.db_creds[0],
            'user': config.db_creds[1],
            'password': config.db_creds[2],
            'host': config.db_creds[3],
            'port': server.local_bind_port
        }

        conn = psycopg2.connect(**params)
        curs = conn.cursor()
        curs.execute(query)
        rows = curs.fetchall()
        colnames = [desc[0] for desc in curs.description]
        df = pd.DataFrame(rows, columns=colnames)

        curs.close()
        conn.close()

        return df


def db_execute(query, values):
    with SSHTunnelForwarder(
            (config.ssh_ip, 22),
            ssh_private_key=config.private_key_path,
            ssh_username=config.ssh_user,
            remote_bind_address=(config.ssh_bind_address, 5432)
    ) as server:
        server.start()
        # print("server connected")

        params = {
            'database': config.db_creds[0],
            'user': config.db_creds[1],
            'password': config.db_creds[2],
            'host': config.db_creds[3],
            'port': server.local_bind_port
        }

        conn = psycopg2.connect(**params)
        curs = conn.cursor()
        # print("database connected")

        psycopg2.extras.execute_batch(curs, query, values)
        conn.commit()
        curs.close()
        conn.close()
        # print("Data inserted successfully")


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
    conn = dbtest()
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
    conn = dbtest()
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df


# def db_execute_single(query, values):
#     query_with_returning = query + " RETURNING id"
#     with SSHTunnelForwarder(
#             (config.ssh_ip, 22),
#             ssh_private_key=config.private_key_path,
#             ssh_username=config.ssh_user,
#             remote_bind_address=(config.ssh_bind_address, 5432)
#     ) as server:
#         server.start()
#
#     params = {
#         'database': config.db_creds[0],
#         'user': config.db_creds[1],
#         'password': config.db_creds[2],
#         'host': config.db_creds[3],
#         'port': server.local_bind_port
#     }
#
#     conn = psycopg2.connect(**params)
#     curs = conn.cursor()
#
#     # Execute the query and fetch the generated ID
#     print(query_with_returning, '\n\n\n',values)
#     curs.execute(query_with_returning, values)
#     generated_id = curs.fetchone()[0]  # Fetch the first (and only) row and get the ID
#
#     conn.commit()
#     curs.close()
#     conn.close()
#
#     return generated_id
def db_execute_single(query, values):
    query_with_returning = query + " RETURNING id"

    # Initialize and start the SSH tunnel
    with SSHTunnelForwarder(
            (config.ssh_ip, 22),
            ssh_private_key=config.private_key_path,
            ssh_username=config.ssh_user,
            remote_bind_address=(config.ssh_bind_address, 5432)
    ) as server:
        server.start()  # Ensure the server is started before accessing local_bind_port

        # Setup database connection parameters
        params = {
            'database': config.db_creds[0],
            'user': config.db_creds[1],
            'password': config.db_creds[2],
            'host': '127.0.0.1',  # Use local host since we're using SSH tunneling
            'port': server.local_bind_port
        }

        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        curs = conn.cursor()

        try:
            # Execute the query and fetch the generated ID
            print(query_with_returning, '\n\n\n', values)
            curs.execute(query_with_returning, values)
            generated_id = curs.fetchone()[0]  # Fetch the first (and only) row and get the ID

            conn.commit()
        except Exception as e:
            conn.rollback()
            print(f"Error executing query: {e}")
            generated_id = None
        finally:
            curs.close()
            conn.close()

    return generated_id

# ToDO Need to improve this function to insert data into table using hourly entry file
def bulk_insert_df(df, table_name):
    # Generate the column names and the values placeholders
    cols = ','.join(list(df.columns))
    vals_placeholder = ','.join(['%s' for _ in df.columns])

    # Generate the SQL query
    query = f"INSERT INTO {table_name} ({cols}) VALUES ({vals_placeholder})"

    # Convert DataFrame to list of tuples using itertuples, excluding the index
    tuples = list(df.itertuples(index=False, name=None))

    # Define the db_execute function
    def db_execute(query, values):
        with SSHTunnelForwarder(
                (config.ssh_ip, 22),
                ssh_private_key=config.private_key_path,
                ssh_username=config.ssh_user,
                remote_bind_address=(config.ssh_bind_address, 5432)
        ) as server:
            server.start()
            # print("server connected")

            params = {
                'database': config.db_creds[0],
                'user': config.db_creds[1],
                'password': config.db_creds[2],
                'host': config.db_creds[3],
                'port': server.local_bind_port
            }

            conn = psycopg2.connect(**params)
            curs = conn.cursor()
            # print("database connected")

            psycopg2.extras.execute_batch(curs, query, values)
            conn.commit()
            curs.close()
            conn.close()

    # Execute the bulk insert
    db_execute(query, tuples)
