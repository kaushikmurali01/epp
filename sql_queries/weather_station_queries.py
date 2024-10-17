nearest_weather_stations = """
WITH facility_location AS (
    SELECT latitude, longitude 
    FROM epp.facility 
    WHERE id = {}
)
SELECT 
    s.in_use,
    s.name as station_name, 
    s.station_id, 
    s.latitude_decimal as latitude, 
    s.longitude_decimal as longitude, 
    s.climate_id, 
    6371 * 2 * ASIN(SQRT(
        POWER(SIN(RADIANS(f.latitude - s.latitude_decimal) / 2), 2) + 
        COS(RADIANS(s.latitude_decimal)) * COS(RADIANS(f.latitude)) * 
        POWER(SIN(RADIANS(f.longitude - s.longitude_decimal) / 2), 2)
    )) AS distance_km 
FROM epp.weather_stations s, facility_location f where s.hly_last_year = {}
ORDER BY distance_km ASC 
LIMIT {};
"""

weather_data_query = """
SELECT 
    year, 
    TO_CHAR(TO_DATE(month::text, 'MM'), 'Month') AS month_name, 
    month::integer, 
    ROUND(AVG(temp)::numeric, 2) AS temperature, 
    ROUND(AVG(rel_hum)::numeric, 2) AS average_humidity, 
    ROUND(AVG(precip_amount)::numeric, 2) AS average_precipitation, 
    ROUND(AVG(wind_spd)::numeric, 2) AS average_wind_speed, 
    ROUND(AVG(station_press)::numeric, 2) AS average_station_pressure 
FROM epp.weather_data_records 
WHERE station_id = {} AND 
date_time BETWEEN '{}' AND '{}'
GROUP BY year, month 
ORDER BY year, month;
"""

min_max_date_query = """select min(start_date) as min_date, max(start_date) as max_date from epp.meter_hourly_entries where facility_id={} and meter_type={} and is_active=true"""
min_max_meter_date_query = """select min(start_date) as min_date, max(end_date) as max_date from epp.meter_hourly_entries where facility_id={} and meter_id={} and is_active=true"""
min_max_date_query_iv = """select min(start_date) as min_date, max(end_date) as max_date from epp.meter_hourly_entries where facility_id={} and independent_variable_id={} and is_active=true"""
min_max_general = """select min(start_date) as min_date, max(end_date) as max_date from epp.meter_hourly_entries where facility_id={} and is_active=true and is_independent_variable=false"""

get_base_line_min_max = """
    SELECT 
      model_input_settings->>'baseline_start_date' AS baseline_start_date,
      model_input_settings->>'baseline_end_date' AS baseline_end_date,
      facility_id,
      meter_type
    FROM 
      epp.baseline_model_output_data
    WHERE 
      facility_id = {} -- Placeholder for facility_id
      AND meter_type = {}; -- Placeholder for meter_type
  """

min_max_performance = """
select min(start_date) as min_date, max(start_date) as max_date from epp.meter_hourly_entries where facility_id={} and meter_type={} and start_date::date > '{}'
"""

FRESH_STATIONS = """SELECT station_id 
FROM epp.weather_stations 
WHERE station_id IN {} 
  AND in_use = false;
"""
UPDATE_IN_USE = """UPDATE epp.weather_stations set in_use=true where station_id in {}"""


MISSING_RECORDS = """WITH date_series AS (
    SELECT generate_series('2018-01-01'::date, CURRENT_DATE, '1 month') AS first_day
),
all_station_months AS (
    SELECT
        s.station_id,
        date_trunc('month', ds.first_day) AS month_start
    FROM
        date_series ds
    CROSS JOIN
        (SELECT DISTINCT station_id FROM epp.weather_data_records) s
),
recorded_months AS (
    SELECT
        station_id,
        date_trunc('month', date_time) AS month_start,
        bool_or(temp IS NOT NULL) AS has_temp
    FROM
        epp.weather_data_records
    WHERE
        date_time >= '2018-01-01'  -- ensure we consider records starting from 2018
    GROUP BY
        station_id, date_trunc('month', date_time)
)
SELECT
    asm.station_id,
    EXTRACT(YEAR FROM asm.month_start) AS year,
    EXTRACT(MONTH FROM asm.month_start) AS month
FROM
    all_station_months asm
LEFT JOIN
    recorded_months rm ON asm.station_id = rm.station_id AND asm.month_start = rm.month_start
WHERE
    rm.station_id IS NULL OR rm.has_temp = false
ORDER BY
    asm.station_id, year, month;
"""