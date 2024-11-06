BASELINE_OBSERVED_PREDICTED = """
SELECT 
    facility_id,
    (value->>'observed')::float as observed,
    to_timestamp((value->>'Timestamp')::bigint / 1000) AS start_date,
    to_timestamp((value->>'Timestamp')::bigint / 1000) + interval '1 hour' AS end_date,
    (value->>'predicted')::float as predicted,
    (value->>'temperature')::float as temperature
FROM epp.baseline_model_output_data,
     jsonb_array_elements(output_data::jsonb) as value
WHERE facility_id = {} and meter_type={} ORDER BY start_date;
"""

PERFORMANCE_OBSERVED_PREDICTED_P4P = """
SELECT 
    facility_id,
    (value->>'observed')::float AS observed,
    to_timestamp((value->>'Timestamp')::bigint / 1000) AS start_date,
    to_timestamp((value->>'Timestamp')::bigint / 1000) + interval '1 hour' AS end_date,
    (value->>'predicted')::float AS predicted,
    (value->>'temperature')::float AS temperature
FROM epp.scoring_data_output,
     jsonb_array_elements(scoring_data::jsonb) as value
WHERE facility_id = {} 
      and meter_type={}
          AND to_timestamp((value->>'Timestamp')::bigint / 1000)::date BETWEEN '{}' AND '{}';
"""

GET_P4P_SUBMIT = """
select * from epp.facility_save_performance where facility_id={} and meter_type = {}
"""

P4P_DATES = """
select 
	p4p_start_date1 as p1_start,
	p4p_end_date1 as p1_end,
	p4p_start_date2 as p2_start,
	p4p_end_date2 as p2_end,
	p4p_start_date3 as p3_start,
	p4p_end_date3 as p3_end
from epp.incentive_settings where facility_id={}
"""
