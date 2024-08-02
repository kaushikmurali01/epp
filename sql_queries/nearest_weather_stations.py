nearest_weather_stations = """SELECT 
    station_id,
    station_name,
    latitude,
    longitude,
    6371 * acos(
        cos(radians({})) * 
        cos(radians(latitude)) * 
        cos(radians(longitude) - radians({})) + 
        sin(radians({})) * 
        sin(radians(latitude))
    ) AS distance_km
FROM 
    stations
ORDER BY 
    distance_km
LIMIT {};"""

nearest_weather_stations_new = """
WITH facility_location AS (
    SELECT latitude, longitude 
    FROM epp.facility 
    WHERE id = {}
),
station_stats AS (
    SELECT 
        station_name, 
        station_id, 
        latitude, 
        longitude,
        climate_id, 

        COUNT(*) AS total_records, 
        ROUND(COUNT(temp) * 100.0 / NULLIF(COUNT(*), 0), 2) AS temp_sufficiency 
    FROM epp.weather_data_records 
    GROUP BY station_id, station_name, latitude, longitude ,climate_id
    HAVING COUNT(temp) * 100.0 / NULLIF(COUNT(*), 0) > 80
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
FROM station_stats s, facility_location f
ORDER BY distance_km ASC 
LIMIT {};
"""

min_max_date_query = """select min(start_date) as min_date, max(start_date) as max_date from meter_hourly_entries where facility_id={} and meter_type={} and is_active=true"""
min_max_meter_date_query = """select min(start_date) as min_date, max(start_date) as max_date from meter_hourly_entries where facility_id={} and meter_id={} and is_active=true"""
