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