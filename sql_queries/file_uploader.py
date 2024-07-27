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

insert_query_facility_iv_files_table = """
    INSERT INTO independent_variable_file (
        independent_variable_id,  file_path
    ) VALUES (%s, %s)
"""

meter_file_processing_query = """
    SELECT DISTINCT 
        hme.facility_id, 
        hme.facility_meter_detail_id, 
        hme.meter_id,
        hme.created_by, 
        hme.media_url, 
        fmd.purchased_from_the_grid, 
        fmd.is_active,
        fmd.meter_type,
        fmd.meter_name,
        hme.processed
    FROM 
        epp.facility_meter_hourly_entries hme
    JOIN 
        epp.facility_meter_detail fmd
    ON 
        hme.facility_meter_detail_id = fmd.id
    WHERE
        hme.facility_id = {} AND
        fmd.is_active = 1 AND
        hme.processed = false
"""

iv_file_processing_query = """
    SELECT 
        iv.id AS independent_variable_id,
        iv.name AS independent_variable_name,
        ivf.file_path AS media_url,
        ivf.processed
    FROM 
        independent_variable AS iv
    JOIN 
        independent_variable_file AS ivf
    ON 
        iv.id = ivf.independent_variable_id
    WHERE 
        iv.facility_id = {} AND
        iv.is_active = true AND
        ivf.processed = false;
"""
