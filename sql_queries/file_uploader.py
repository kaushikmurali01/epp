min_max_data = min_max_data = """
    SELECT 
        MIN(start_date)::timestamp AS lower_limit, 
        MAX(start_date)::timestamp AS upper_limit 
    FROM combined_meter_weather_readings 
    WHERE facility_id={} AND meter_type={}
"""
# min_max_data.format(facility_id, meter_type)
