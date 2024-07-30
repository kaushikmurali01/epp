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

min_max_date_query = """select min(start_date) as min_date, max(start_date) as max_date from meter_hourly_entries where facility_id={} and meter_type={} and is_active=true"""
