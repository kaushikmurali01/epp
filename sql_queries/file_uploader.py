min_max_data = min_max_data = """
    SELECT 
        MIN(start_date)::timestamp AS lower_limit, 
        MAX(start_date)::timestamp AS upper_limit 
    FROM meter_hourly_entries 
    WHERE facility_id={} AND meter_id={}
"""
# min_max_data.format(facility_id, meter_type)
insert_query_facility_meter_hourly_entries = """
    INSERT INTO facility_meter_hourly_entries (
        facility_id, facility_meter_detail_id, meter_id, created_by, media_url
    ) VALUES (%s, %s, %s, %s, %s)
"""
