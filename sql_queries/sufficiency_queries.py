daily_hourly_sufficiency = """WITH date_range AS (
    SELECT 
        '2023-01-01 02:00'::timestamp AS start_date,
        '2023-01-02 10:00'::timestamp AS end_date,
        4 AS unique_meters
),
hourly_diff AS (
    SELECT 
        EXTRACT(EPOCH FROM (end_date - start_date)) / 3600 AS total_hours
    FROM 
        date_range
),
adjusted_hours AS (
    SELECT
        (total_hours + 1) AS adjusted_hours -- Adding 1 to include both start and end hours
    FROM
        hourly_diff
)
SELECT 
    ROUND((adjusted_hours * unique_meters)) AS expected_readings
FROM 
    adjusted_hours, date_range;
"""
sufficiency_query= """ WITH date_range AS (
    SELECT generate_series(
        '{start_date}'::timestamp,
        '{end_date} 23:00:00'::timestamp,
        '1 hour'::interval
    ) AS hour
),
meter_data AS (
    SELECT DISTINCT ON (meter_id, date_trunc('hour', start_date))
        meter_id,
        meter_name,
        date_trunc('hour', start_date) AS hour,
        date_trunc('day', start_date) AS day,
        date_trunc('month', start_date) AS month
    FROM meter_hourly_entries
    WHERE facility_id = {facility_id}
    AND start_date >= '{start_date}' AND start_date < '{end_date_one}'
    ORDER BY meter_id, date_trunc('hour', start_date), start_date
),
hourly_sufficiency AS (
    SELECT
        md.meter_id,
        md.meter_name,
        COUNT(md.hour) AS hourly_sufficiency
    FROM date_range dr
    LEFT JOIN meter_data md ON dr.hour = md.hour
    GROUP BY md.meter_id, md.meter_name
),
daily_sufficiency AS (
    SELECT
        meter_id,
        meter_name,
        COUNT(DISTINCT day)  AS daily_sufficiency
    FROM meter_data
    GROUP BY meter_id, meter_name
),
monthly_sufficiency AS (
    SELECT
        meter_id,
        meter_name,
        COUNT(DISTINCT month) AS monthly_sufficiency
    FROM meter_data
    GROUP BY meter_id, meter_name
)
SELECT 
    COALESCE(h.meter_id, d.meter_id, m.meter_id) AS meter_id,
    COALESCE(h.meter_name, d.meter_name, m.meter_name) AS meter_name,
    h.hourly_sufficiency AS hourly_sufficiency_percentage,
    d.daily_sufficiency AS daily_sufficiency_percentage,
    m.monthly_sufficiency AS monthly_sufficiency_percentage
FROM hourly_sufficiency h
FULL OUTER JOIN daily_sufficiency d USING (meter_id, meter_name)
FULL OUTER JOIN monthly_sufficiency m USING (meter_id, meter_name)
ORDER BY meter_id"""