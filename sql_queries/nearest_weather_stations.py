nearest_weather_stations = """
WITH facility_location AS (
    SELECT latitude, longitude 
    FROM epp.facility 
    WHERE id = {}
)
SELECT 
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

# weather_data_query = """
# SELECT
#     year,
#     TO_CHAR(TO_DATE(month::text, 'MM'), 'Month') AS month_name,
#     month::integer,
#     ROUND(AVG(temp)::numeric, 2) AS temperature,
#     ROUND(AVG(rel_hum)::numeric, 2) AS average_humidity,
#     ROUND(AVG(precip_amount)::numeric, 2) AS average_precipitation,
#     ROUND(AVG(wind_spd)::numeric, 2) AS average_wind_speed,
#     ROUND(AVG(station_press)::numeric, 2) AS average_station_pressure
# FROM epp.weather_data_agg
# WHERE station_id in ({}) AND
# date_time BETWEEN '{}' AND '{}'
# GROUP BY year, month
# ORDER BY year, month;
# """

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
WHERE station_id in ({}) AND 
date_time BETWEEN '{}' AND '{}'
GROUP BY year, month 
ORDER BY year, month;
"""

min_max_date_query = """select min(start_date) as min_date, max(start_date) as max_date from epp.meter_hourly_entries where facility_id={} and meter_type={} and is_active=true"""
min_max_meter_date_query = """select min(start_date) as min_date, max(end_date) as max_date from epp.meter_hourly_entries where facility_id={} and meter_id={} and is_active=true"""
min_max_date_query_iv = """select min(start_date) as min_date, max(end_date) as max_date from epp.meter_hourly_entries where facility_id={} and independent_variable_id={} and is_active=true"""
min_max_general = """select min(start_date) as min_date, max(end_date) as max_date from epp.meter_hourly_entries where facility_id={} and is_active=true"""

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
select min(start_date) as min_date, max(start_date) as max_date from epp.meter_hourly_entries where facility_id={} and meter_type=1 and start_date > '{}'
"""
