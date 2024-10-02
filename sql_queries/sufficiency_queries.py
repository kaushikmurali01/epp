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
        CASE 
			WHEN is_independent_variable = true THEN independent_variable_id
			ELSE meter_id
		END AS meter_id,
        meter_name,
        date_trunc('hour', start_date) AS hour,
        date_trunc('day', start_date) AS day,
        date_trunc('month', start_date) AS month
    FROM epp.meter_hourly_entries
    WHERE facility_id = {facility_id}
    AND start_date >= '{start_date}' AND start_date < '{end_date_one}' {IVids} 
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
        month,
        CONCAT(TRIM(TO_CHAR(month, 'Month')),' ', TO_CHAR(month, 'yyyy')) AS month_name,
        COUNT(DISTINCT day)  AS monthly_sufficiency
    FROM meter_data
    GROUP BY meter_id, meter_name, month
)
SELECT 
    COALESCE(h.meter_id, d.meter_id, m.meter_id) AS meter_id,
    COALESCE(h.meter_name, d.meter_name, m.meter_name) AS meter_name,
    h.hourly_sufficiency AS hourly_sufficiency_percentage,
    d.daily_sufficiency AS daily_sufficiency_percentage,
    m.monthly_sufficiency AS monthly_sufficiency_percentage,
	m.month_name
FROM hourly_sufficiency h
FULL OUTER JOIN daily_sufficiency d USING (meter_id, meter_name)
FULL OUTER JOIN monthly_sufficiency m USING (meter_id, meter_name)
ORDER BY meter_id"""

sufficiencies_hourly = """ 
WITH hourly_data AS (
    SELECT 
        meter_id,
        meter_name,
        facility_id,
        date_trunc('hour', start_date) AS hour,
        COUNT(id) AS hourly_count
    FROM epp.meter_hourly_entries
    WHERE facility_id = {facility_id}
      AND start_date BETWEEN '{start_date}' AND '{end_date} 23:59:59'
	  {IVids}
    GROUP BY meter_id, meter_name, facility_id, date_trunc('hour', start_date)
	order by  hour
), hourly_sufficiency_percentage AS (
	SELECT 
		h.meter_id,
		h.meter_name,
		count(h.hourly_count),
		(count(h.hourly_count) / (EXTRACT(EPOCH FROM ('{end_date} 23:59:59'::timestamp - '{start_date}'::timestamp)) / 3600)) * 100 AS hourly_percentage
	FROM hourly_data h
	where hourly_count > 0
	GROUP BY h.meter_id, h.meter_name
	ORDER BY h.meter_id
)
select cast(avg(hourly_percentage) as decimal(10,2))  as percentage from hourly_sufficiency_percentage
"""
sufficiency_daily = """ 
WITH hourly_data AS (
    SELECT 
        meter_id,
        meter_name,
        facility_id,
        date_trunc('day', start_date) AS hour,
        COUNT(id) AS hourly_count
    FROM epp.meter_hourly_entries
    WHERE facility_id = {facility_id}
      AND start_date BETWEEN '{start_date}' AND '{end_date} 23:59:59'
	  {IVids}
    GROUP BY meter_id, meter_name, facility_id, date_trunc('day', start_date)
	order by  hour
), hourly_sufficiency_percentage AS (
	SELECT 
		h.meter_id,
		h.meter_name,
		(count(h.hourly_count) / (EXTRACT(EPOCH FROM ('{end_date} 23:59:59'::timestamp - '{start_date}'::timestamp)) / 86400)) * 100 AS daily_percentage
	FROM hourly_data h
	where hourly_count >=24
	GROUP BY h.meter_id, h.meter_name
	ORDER BY h.meter_id
)
select cast(avg(daily_percentage) as decimal(10,2))  as percentage from hourly_sufficiency_percentage
"""

sufficiency_daily_old = """ 
with daily_data AS (
	SELECT
		meter_id,
		meter_name,
		facility_id,
		date_trunc('day', start_date) AS day,
		COUNT(id) AS daily_count
	FROM epp.meter_hourly_entries
	WHERE facility_id = {facility_id}   
		AND start_date BETWEEN '{start_date}'::timestamp AND '{end_date} 23:59:59'::timestamp
         {IVids}
	GROUP BY meter_id, meter_name, facility_id, date_trunc('day', start_date)
	order by day 
), daily_sufficiency_percentage AS (
	SELECT 
		d.meter_id,
		d.meter_name,
		count(d.daily_count),
		(count(d.daily_count) / (EXTRACT(EPOCH FROM ('{end_date} 23:59:59'::timestamp - '{start_date}'::timestamp)) / 86400)) * 100 AS daily_percentage
	FROM daily_data d
	where daily_count > 0
	GROUP BY d.meter_id, d.meter_name
	ORDER BY d.meter_id
)
select cast(avg(daily_percentage) as decimal(10,2))  as percentage   from daily_sufficiency_percentage
"""
sufficiencies_monthly = """
with RECURSIVE DateList AS (
    SELECT '{start_date}'::DATE AS month_start
    UNION ALL
    SELECT (month_start + INTERVAL '1 month')::DATE
    FROM DateList
    WHERE month_start < '{end_date}'::DATE
), monthly_data AS (
    SELECT
        meter_id,
        meter_name,
        facility_id,
        date_trunc('month', start_date) AS month,
        COUNT(DISTINCT date_trunc('hour', start_date)) AS days_in_month,
        COUNT(reading) AS monthly_count
    FROM epp.meter_hourly_entries
    WHERE facility_id = {facility_id}
      AND start_date BETWEEN '{start_date}'::timestamp AND '{end_date} 23:59:59'::timestamp
      
     {IVids}
    GROUP BY meter_id, meter_name, facility_id, date_trunc('month', start_date)
), monthly_per as(
	select 
		meter_id, 
		meter_name, 
		month, 
		days_in_month, 
		TRIM(TO_CHAR(month, 'Month')) || ' ' || TO_CHAR(month, 'YYYY') AS month_year,
        CASE
            WHEN TO_CHAR(month, 'YYYYMM') = TO_CHAR('{start_date}'::date, 'YYYYMM') THEN ((DATE_TRUNC('MONTH', '{start_date}'::DATE) + INTERVAL '1 MONTH - 1 day')::DATE - '{start_date}'::DATE + 1)::FLOAT  
            WHEN TO_CHAR(month, 'YYYYMM') = TO_CHAR('{end_date}'::date, 'YYYYMM') THEN TO_CHAR('{end_date}'::date, 'dd')::FLOAT 
            ELSE DATE_PART('days', (DATE_TRUNC('month', month) + INTERVAL '1 month - 1 day')::date ) ::FLOAT
        END AS totoal_days,
        CASE
            WHEN TO_CHAR(month, 'YYYYMM') = TO_CHAR('{start_date}'::date, 'YYYYMM') THEN days_in_month*100/(24*((DATE_TRUNC('MONTH', '{start_date}'::DATE) + INTERVAL '1 MONTH - 1 day')::DATE - '{start_date}'::DATE + 1)::FLOAT ) 
            WHEN TO_CHAR(month, 'YYYYMM') = TO_CHAR('{end_date}'::date, 'YYYYMM') THEN days_in_month*100/(TO_CHAR('{end_date}'::date, 'dd')::FLOAT *24)
            ELSE days_in_month*100/(24*DATE_PART('days', (DATE_TRUNC('month', month) + INTERVAL '1 month - 1 day')::date )::FLOAT) 
        END AS perecnt
	from monthly_data
), monthsdata as (
	SELECT TO_CHAR(month_start, 'YYYYMM') AS mm, 60 as value, TRIM(TO_CHAR(month_start, 'Month')) || ' ' || TO_CHAR(month_start, 'YYYY') AS month
	FROM DateList where month_start between '{start_date}' and '{end_date}'
), percentage_query as (
select cast(avg(perecnt) as decimal(10,2)) as value , month_year as month, TRIM(TO_CHAR(month, 'YYYYMM')) as mm 
from monthly_per group by month_year, month order by mm asc
)
select COALESCE(pq.value, 0.00) AS value, md.month as month, md.mm as mm  from percentage_query as pq right join monthsdata as md on md.mm=pq.mm

"""