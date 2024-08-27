data_cleaning_query = """WITH base_data AS (
    SELECT 
        DATE_TRUNC('hour', start_date::timestamp) AS start_date,
        meter_id,
        CASE 
            WHEN meter_id = {} THEN 'Temp1'
            WHEN meter_id = {} THEN 'Temp2'
            WHEN meter_id = {} THEN 'Temp3'
            ELSE meter_name
        END AS meter_name,
        reading,
        meter_type
    FROM epp.combined_meter_weather_readings
    WHERE (facility_id = {} OR meter_id IN ({}, {}, {}))
      AND start_date BETWEEN '{}' AND '{}'
),
meter_types AS (
    SELECT DISTINCT meter_name,
        CASE 
            WHEN meter_type IN (1, 2, 3) THEN 'meter'
            WHEN meter_type = 0 THEN 'iv'
            WHEN meter_type = 104 THEN 'temp'
            ELSE 'other'
        END AS meter_category
    FROM base_data
)
SELECT 
    bd.start_date,
    bd.meter_id,
    bd.meter_name,
    bd.meter_type,
    CASE 
        WHEN mt.meter_category = 'meter' THEN SUM(bd.reading)
        ELSE AVG(bd.reading)
    END AS reading
FROM base_data bd
JOIN meter_types mt ON bd.meter_name = mt.meter_name
GROUP BY 
    bd.start_date,
    bd.meter_id,
    bd.meter_name,
    bd.meter_type,
    mt.meter_category
ORDER BY 
    bd.start_date,
    bd.meter_name;"""


def get_data_cleaning_query(temp1, temp2, temp3, start_date, end_date, facility_id, meter_type):
    return f"""
    WITH base_data AS (
        SELECT DATE_TRUNC('hour', start_date::timestamp) AS start_date,
               CASE
                   WHEN is_independent_variable THEN independent_variable_id
                   ELSE meter_id
               END AS meter_id,
               CASE 
                   WHEN meter_id = {temp1} THEN 'Temp1'
                   WHEN meter_id = {temp2} THEN 'Temp2'
                   WHEN meter_id = {temp3} THEN 'Temp3'
                   ELSE meter_name 
               END AS meter_name,
               reading,
               meter_type,
               CASE 
                   WHEN meter_type IN (1, 2, 3) THEN 'meter'
                   WHEN meter_type = 0 THEN 'iv'
                   WHEN meter_type = {facility_id} THEN 'temp'
                   ELSE 'other'
               END AS meter_category
        FROM (
            SELECT start_date, meter_id, independent_variable_id, is_independent_variable, 
                   meter_name, reading, meter_type, facility_id
            FROM epp.meter_hourly_entries
            WHERE is_active = true 
              AND start_date BETWEEN '{start_date}' AND '{end_date}'
              AND facility_id = {facility_id} AND meter_type = {meter_type}
            
            UNION ALL
            
            SELECT date_time AS start_date, station_id AS meter_id, 
                   NULL AS independent_variable_id, false AS is_independent_variable,
                   station_name AS meter_name, temp AS reading, 104 AS meter_type, 
                   NULL::integer AS facility_id
            FROM epp.weather_data_records 
            WHERE station_id IN ({temp1}, {temp2}, {temp3})
              AND date_time BETWEEN '{start_date}' AND '{end_date}'
        ) combined_data
    )
    SELECT start_date,
           meter_id,
           meter_name,
           meter_type,
           CASE 
               WHEN meter_category = 'meter' THEN SUM(reading)
               ELSE AVG(reading)
           END AS reading
    FROM base_data
    GROUP BY start_date, meter_id, meter_name, meter_type, meter_category
    ORDER BY start_date, meter_name;
    """
