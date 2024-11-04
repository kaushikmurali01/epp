BASELINE_OBSERVED_PREDICTED = """
SELECT 
    facility_id,
    (value->>'observed')::float as observed,
    to_timestamp((value->>'Timestamp')::bigint/1000) AT TIME ZONE '{}' AS start_date,
    (to_timestamp((value->>'Timestamp')::bigint/1000) AT TIME ZONE '{}' + interval '1 hour') as end_date,
    (value->>'predicted')::float as predicted,
    (value->>'temperature')::float as temperature
FROM epp.baseline_model_output_data,
     jsonb_array_elements(output_data::jsonb) as value
WHERE facility_id = {} and meter_type={} ORDER BY start_date;
"""
PERFORMANCE_OBSERVED_PREDICTED = """
SELECT 
    facility_id,
    (value->>'observed')::float as observed,
    to_timestamp((value->>'Timestamp')::bigint/1000) AT TIME ZONE '{}' AS start_date,
    (to_timestamp((value->>'Timestamp')::bigint/1000) AT TIME ZONE '{}' + interval '1 hour') as end_date,
    (value->>'predicted')::float as predicted,
    (value->>'temperature')::float as temperature
FROM epp.scoring_data_output,
     jsonb_array_elements(scoring_data::jsonb) as value
WHERE facility_id = {} and meter_type={} ORDER BY start_date;
"""
COMBINED = """
SELECT 
    facility_id,
    'baseline_model_output_data' as source,
    (value->>'observed')::float as observed,
    to_timestamp((value->>'Timestamp')::bigint/1000) AT TIME ZONE '{}' AS start_date,
    (to_timestamp((value->>'Timestamp')::bigint/1000) AT TIME ZONE '{}' + interval '1 hour') as end_date,
    (value->>'predicted')::float as predicted,
    (value->>'temperature')::float as temperature
FROM epp.baseline_model_output_data,
     jsonb_array_elements(output_data::jsonb) as value
WHERE facility_id = {} and meter_type={} ORDER BY start_date

UNION ALL

SELECT 
    facility_id,
    'scoring_data_output' as source,
    (value->>'observed')::float as observed,
    to_timestamp((value->>'Timestamp')::bigint/1000) AT TIME ZONE '{}' AS start_date,
    (to_timestamp((value->>'Timestamp')::bigint/1000) AT TIME ZONE '{}' + interval '1 hour') as end_date,
    (value->>'predicted')::float as predicted,
    (value->>'temperature')::float as temperature
FROM epp.scoring_data_output,
     jsonb_array_elements(scoring_data::jsonb) as value
WHERE facility_id = {}
ORDER BY start_date;
"""
