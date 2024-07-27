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
