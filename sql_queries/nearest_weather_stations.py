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
