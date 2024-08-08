# nearest_weather_stations = """
# WITH facility_location AS (
#     SELECT latitude, longitude
#     FROM epp.facility
#     WHERE id = {}
# ),
# station_stats AS (
#     SELECT
#         station_name,
#         station_id,
#         latitude,
#         longitude,
#         climate_id,
#
#         COUNT(*) AS total_records,
#         ROUND(COUNT(temp) * 100.0 / NULLIF(COUNT(*), 0), 2) AS temp_sufficiency
#     FROM epp.weather_data_records
#     GROUP BY station_id, station_name, latitude, longitude ,climate_id
#     HAVING COUNT(temp) * 100.0 / NULLIF(COUNT(*), 0) > 80
# )
# SELECT
#     s.station_name,
#     s.station_id,
#     s.latitude,
#     s.longitude,
#     s.temp_sufficiency,
#     s.total_records,
#     s.climate_id,
#
#     6371 * 2 * ASIN(SQRT(
#         POWER(SIN(RADIANS(f.latitude - s.latitude) / 2), 2) +
#         COS(RADIANS(s.latitude)) * COS(RADIANS(f.latitude)) *
#         POWER(SIN(RADIANS(f.longitude - s.longitude) / 2), 2)
#     )) AS distance_km
# FROM station_stats s, facility_location f
# ORDER BY distance_km ASC
# LIMIT {};
# """


nearest_weather_stations = """
WITH facility_location AS (
    SELECT latitude, longitude 
    FROM epp.facility 
    WHERE id = {}
)
SELECT 
    s.station_name, 
    s.station_id, 
    s.latitude, 
    s.longitude, 
    s.temp_sufficiency, 
    s.total_records, 
    s.climate_id, 
    6371 * 2 * ASIN(SQRT(
        POWER(SIN(RADIANS(f.latitude - s.latitude) / 2), 2) + 
        COS(RADIANS(s.latitude)) * COS(RADIANS(f.latitude)) * 
        POWER(SIN(RADIANS(f.longitude - s.longitude) / 2), 2)
    )) AS distance_km 
FROM weather_data_agg s, facility_location f
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

min_max_date_query = """select min(start_date) as min_date, max(end_date) as max_date from epp.meter_hourly_entries where facility_id={} and meter_type={} and is_active=true"""
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
select min(start_date) as min_date, max(start_date) as max_date from meter_hourly_entries where facility_id={} and meter_type=1 and start_date > '{}'
"""
