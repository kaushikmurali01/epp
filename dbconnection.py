import psycopg2
from sshtunnel import SSHTunnelForwarder
import pandas as pd
import psycopg2.extras


def dbtest(query):
    with SSHTunnelForwarder(
         ('172.183.211.211', 22),
         ssh_private_key="C:/Users/Akash Jain/Downloads/vmkey.pem",
         ### in my case, I used a password instead of a private key
         ssh_username="ubuntu",
         # ssh_password="<mypasswd>", 
         remote_bind_address=('epp-dev-db.postgres.database.azure.com', 5432)) as server:
         server.start()
         #print("server connected")
    
         params = {
             'database': 'postgres',
             'user': 'epp',
             'password': '3pp#db9$',
             'host': 'localhost',
             'port': server.local_bind_port
             }
    
         conn = psycopg2.connect(**params)
         curs = conn.cursor()
         #print("database connected")
         curs.execute(query)
         rows = curs.fetchall()
         # Fetch all rows from the result set
         colnames = [desc[0] for desc in curs.description]
        
        # Create DataFrame from rows
         df = pd.DataFrame(rows, columns=colnames)
        
         return df
    

def db_execute(query, values):
    with SSHTunnelForwarder(
        ('172.183.211.211', 22),
        ssh_private_key="C:/Users/Akash Jain/Downloads/vmkey.pem",
        ssh_username="ubuntu",
        remote_bind_address=('epp-dev-db.postgres.database.azure.com', 5432)
    ) as server:
        server.start()
        #print("server connected")

        params = {
            'database': 'postgres',
            'user': 'epp',
            'password': '3pp#db9$',
            'host': 'localhost',
            'port': server.local_bind_port
        }

        conn = psycopg2.connect(**params)
        curs = conn.cursor()
        #print("database connected")
        
        psycopg2.extras.execute_batch(curs, query, values)
        conn.commit()
        curs.close()
        conn.close()
        #print("Data inserted successfully")

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