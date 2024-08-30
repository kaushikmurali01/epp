# Weather Query
weather_query = "select year, month, sum(temp),sum(rel_hum), sum(precip_amount),sum(wind_spd),sum(station_press)  from weather_data_records where facility_id = 336 group by year, month order by year, month"

# Summary Queries Start
# Outliers Query
outlier_summary = "WITH quartiles AS (SELECT  meter_id, MAX(end_date) as end_date, MIN(start_date) as start_date FROM epp.meter_hourly_entries WHERE reading NOT IN ( 'NaN') AND facility_id = {facility_id} GROUP BY  meter_id) SELECT e.meter_type, e.meter_name as m_id, r.meter_id,  CASE WHEN e.meter_type = 1 THEN 'ELECTRICITY' WHEN e.meter_type = 2 THEN 'WATER' WHEN e.meter_type = 3 THEN 'NG' ELSE 'Unknown' END AS meter_name, COUNT(e.id) AS total_records, TO_CHAR(MIN(e.start_date), 'YYYY/MM/DD HH24:MI') AS time_stamp_start, TO_CHAR(MAX(e.end_date), 'YYYY/MM/DD HH24:MI') AS time_stamp_end, CASE WHEN e.reading < r.lower_bound THEN 'Lower limit' WHEN e.reading > r.upper_bound THEN 'Upper limit' ELSE 'Within bounds' END AS bound_type FROM epp.meter_hourly_entries e JOIN (SELECT  meter_id, percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) AS Q3, (percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) - percentile_cont(0.25) WITHIN GROUP (ORDER BY reading)) AS IQR, (percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) - {meter_factor} * (percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) - percentile_cont(0.25) WITHIN GROUP (ORDER BY reading))) AS lower_bound, (percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) + {meter_factor} * (percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) - percentile_cont(0.25) WITHIN GROUP (ORDER BY reading))) AS upper_bound FROM meter_hourly_entries WHERE reading NOT IN ( 'NaN') AND facility_id = {facility_id} GROUP BY  meter_id) r ON e.meter_id = r.meter_id WHERE e.reading NOT IN ( 'NaN') AND e.start_date >= (SELECT MAX(start_date) from quartiles where meter_id > 0) AND e.end_date <=  (SELECT MIN(end_date) from quartiles where meter_id > 0) AND (e.reading < r.lower_bound OR e.reading > r.upper_bound) AND e.is_independent_variable = {is_independent_variable} {date_filter} GROUP BY e.meter_type, meter_name, r.meter_id, bound_type ORDER BY bound_type DESC, e.meter_type;"
temp_outlier_summary = "WITH quartiles AS (SELECT  meter_id, MAX(end_date) as end_date, MIN(start_date) as start_date FROM epp.meter_hourly_entries WHERE reading NOT IN ( 'NaN') AND facility_id = {facility_id} GROUP BY  meter_id) SELECT w.station_id as meter_id, 'weather' as m_id, 'TEMPERATURE' AS meter_name, COUNT(w.id) AS total_records, TO_CHAR(MIN(w.date_time), 'YYYY/MM/DD HH24:MI') AS time_stamp_start, TO_CHAR(MAX(w.date_time + interval '1 hour'), 'YYYY/MM/DD HH24:MI') AS time_stamp_end, CASE WHEN w.temp < r.lower_bound THEN 'Lower limit' WHEN w.temp > r.upper_bound THEN 'Upper limit' ELSE 'Within bounds' END AS bound_type FROM weather_data_records w JOIN (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY temp) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY temp) AS Q3, (percentile_cont(0.75) WITHIN GROUP (ORDER BY temp) - percentile_cont(0.25) WITHIN GROUP (ORDER BY temp)) AS IQR, (percentile_cont(0.25) WITHIN GROUP (ORDER BY temp) - {station_id} * (percentile_cont(0.75) WITHIN GROUP (ORDER BY temp) - percentile_cont(0.25) WITHIN GROUP (ORDER BY temp))) AS lower_bound, (percentile_cont(0.75) WITHIN GROUP (ORDER BY temp) + {meter_factor} * (percentile_cont(0.75) WITHIN GROUP (ORDER BY temp) - percentile_cont(0.25) WITHIN GROUP (ORDER BY temp))) AS upper_bound FROM weather_data_records WHERE station_id = {station_id} GROUP BY station_id) r ON w.station_id =  {station_id} WHERE w.temp NOT IN ( 'NaN') AND (w.temp < r.lower_bound OR w.temp > r.upper_bound) GROUP BY w.station_id, bound_type ORDER BY bound_type DESC;"
temp_outlier_summary_lower_bound_list = "WITH quartiles AS (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY temp) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY temp) AS Q3 FROM weather_data_records WHERE temp NOT IN ( 'NaN') AND station_id = {meter_id} GROUP BY station_id), outlier_ranges AS (SELECT Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - {METER_FACTOR} * (Q3 - Q1)) AS lower_bound, (Q3 + {METER_FACTOR} * (Q3 - Q1)) AS upper_bound FROM quartiles) SELECT TO_CHAR(w.date_time, 'YYYY/MM/DD HH24:MI') AS start_date, TO_CHAR(w.date_time + interval '1 hour', 'YYYY/MM/DD HH24:MI') AS end_date, w.station_id as meter_id, 104 as meter_type, temp as reading FROM  weather_data_records w WHERE w.station_id = {meter_id} AND w.temp NOT IN ('NaN') AND w.temp < (select lower_bound from outlier_ranges ) order by start_date asc LIMIT {page_size} OFFSET ({page_number} - 1) * {page_size};"
temp_outlier_summary_upper_bound_list = "WITH quartiles AS (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY temp) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY temp) AS Q3 FROM weather_data_records WHERE temp NOT IN ('NaN') AND station_id = {meter_id} GROUP BY station_id), outlier_ranges AS (SELECT Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - {METER_FACTOR} * (Q3 - Q1)) AS lower_bound, (Q3 + {METER_FACTOR} * (Q3 - Q1)) AS upper_bound FROM quartiles) SELECT TO_CHAR(w.date_time, 'YYYY/MM/DD HH24:MI') AS start_date, TO_CHAR(w.date_time + interval '1 hour', 'YYYY/MM/DD HH24:MI') AS end_date, w.station_id as meter_id, 104 as meter_type, temp as reading FROM  weather_data_records w WHERE w.station_id = {meter_id} AND w.temp NOT IN ( 'NaN') AND  w.temp  > (select upper_bound from outlier_ranges ) order by start_date asc LIMIT {page_size} OFFSET ({page_number} - 1) * {page_size};"


# Observed Data
observed_data_summary = "WITH quartiles AS (SELECT  meter_id, percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) AS Q3, MAX(end_date) as end_date, MIN(start_date) as start_date FROM epp.meter_hourly_entries WHERE reading NOT IN ( 'NaN') AND facility_id = {} GROUP BY  meter_id), outlier_ranges AS (SELECT  Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - {} * (Q3 - Q1)) AS lower_bound, (Q3 + {} * (Q3 - Q1)) AS upper_bound, meter_id FROM quartiles) SELECT e.meter_type,e.meter_name as m_id, CASE WHEN e.meter_type = 1 THEN 'ELECTRICITY' WHEN e.meter_type = 2 THEN 'WATER' WHEN e.meter_type = 3 THEN 'NG' ELSE 'Unknown' END AS meter_name, r.meter_id, COUNT(e.id) AS total_records, TO_CHAR(MIN(e.start_date), 'YYYY/MM/DD HH24:MI') AS time_stamp_start, TO_CHAR(MAX(e.end_date), 'YYYY/MM/DD HH24:MI') AS time_stamp_end FROM meter_hourly_entries e JOIN outlier_ranges r ON e.meter_id = r.meter_id WHERE e.reading NOT IN ( 'NaN') AND e.reading >= r.lower_bound AND e.reading <= r.upper_bound AND e.start_date >= (SELECT MAX(start_date) from quartiles where meter_id > 0) AND e.end_date <=  (SELECT MIN(end_date) from quartiles where meter_id > 0) AND e.is_independent_variable = {} {} GROUP BY e.meter_type, meter_name, r.meter_id ORDER BY e.meter_type;"
temp_observed_data_summary = "WITH quartiles AS (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY temp) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY temp) AS Q3 FROM weather_data_records WHERE temp NOT IN ( 'NaN') AND station_id = {} GROUP BY station_id), outlier_ranges AS (SELECT Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - {} * (Q3 - Q1)) AS lower_bound, (Q3 + {} * (Q3 - Q1)) AS upper_bound FROM quartiles) SELECT 'TEMPERATURE' AS meter_name, COUNT(w.id) AS total_records, TO_CHAR(MIN(w.date_time), 'YYYY/MM/DD HH24:MI') AS time_stamp_start, TO_CHAR(MAX(w.date_time + interval '1 hour'), 'YYYY/MM/DD HH24:MI') AS time_stamp_end,w.station_id AS meter_id, 'weather' as m_id FROM weather_data_records w JOIN outlier_ranges r ON w.temp NOT IN ( 'NaN') AND w.temp >= r.lower_bound AND w.temp <= r.upper_bound AND w.station_id = {} WHERE w.date_time >= '{}' and w.date_time <= '{}'  GROUP BY w.station_id;"

temp_observed_data_summary_list = "WITH quartiles AS (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY temp) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY temp) AS Q3 FROM weather_data_records WHERE temp NOT IN ( 'NaN') AND station_id = {meter_id} GROUP BY station_id), outlier_ranges AS (SELECT Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - {METER_FACTOR} * (Q3 - Q1)) AS lower_bound, (Q3 + {METER_FACTOR} * (Q3 - Q1)) AS upper_bound FROM quartiles) SELECT TO_CHAR(w.date_time, 'YYYY/MM/DD HH24:MI') AS start_date, TO_CHAR(w.date_time + interval '1 hour', 'YYYY/MM/DD HH24:MI') AS end_date, w.station_id as meter_id, 104 as meter_type, temp as reading FROM  weather_data_records w WHERE w.station_id = {meter_id} AND w.temp NOT IN ( 'NaN') AND w.temp >= (select lower_bound from outlier_ranges ) AND w.temp <=  (select upper_bound from outlier_ranges ) {query_date_filter} order by start_date asc LIMIT {page_size} OFFSET ({page_number} - 1) * {page_size};"
outlier_summary_lower_bound_list= "WITH quartiles AS (SELECT meter_id, percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) AS Q3 FROM epp.meter_hourly_entries WHERE reading NOT IN ( 'NaN') AND facility_id = {facility_id} AND meter_id = {meter_id} GROUP BY meter_id), outlier_ranges AS (SELECT (Q1 - {METER_FACTOR} * (Q3 - Q1)) AS lower_bound, (Q3 + {METER_FACTOR} * (Q3 - Q1)) AS upper_bound, meter_id FROM quartiles) SELECT start_date, end_date, meter_id, meter_type, reading FROM epp.meter_hourly_entries e WHERE e.reading NOT IN ('NaN') AND e.reading < (SELECT lower_bound FROM outlier_ranges) AND e.is_independent_variable = {is_independent_variable} AND facility_id = {facility_id} AND meter_id = {meter_id} LIMIT {page_size} OFFSET ({page_number} - 1) * {page_size};"
outlier_summary_upper_bound_list= "WITH quartiles AS (SELECT meter_id, percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) AS Q3 FROM epp.meter_hourly_entries WHERE reading NOT IN ( 'NaN') AND facility_id = {facility_id} AND meter_id = {meter_id} GROUP BY meter_id), outlier_ranges AS (SELECT (Q1 - {METER_FACTOR} * (Q3 - Q1)) AS lower_bound, (Q3 + {METER_FACTOR} * (Q3 - Q1)) AS upper_bound, meter_id FROM quartiles) SELECT start_date, end_date, meter_id, meter_type, reading FROM epp.meter_hourly_entries e WHERE e.reading NOT IN ( 'NaN') AND e.reading > (SELECT upper_bound FROM outlier_ranges) AND e.is_independent_variable = {is_independent_variable} AND facility_id = {facility_id} AND meter_id = {meter_id} LIMIT {page_size} OFFSET ({page_number} - 1) * {page_size};"

#observed_data_summary_list with pagination
observed_data_summary_list= "WITH quartiles AS (SELECT meter_id, percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) AS Q3 FROM epp.meter_hourly_entries WHERE reading NOT IN ('NaN') AND facility_id = {facility_id} AND meter_id = {meter_id} GROUP BY meter_id), outlier_ranges AS (SELECT (Q1 - {METER_FACTOR} * (Q3 - Q1)) AS lower_bound, (Q3 + {METER_FACTOR} * (Q3 - Q1)) AS upper_bound, meter_id FROM quartiles) SELECT start_date, end_date, meter_id, meter_type, reading FROM epp.meter_hourly_entries e WHERE e.reading NOT IN ('NaN') AND e.reading >= (SELECT lower_bound FROM outlier_ranges) AND e.reading <= (SELECT upper_bound FROM outlier_ranges) AND e.is_independent_variable = {is_independent_variable} AND facility_id = {facility_id} AND meter_id = {meter_id} {query_date_filter} LIMIT {page_size} OFFSET ({page_number} - 1) * {page_size};"


# Missing Data
missing_data_summary_list= "SELECT start_date, end_date, meter_id, meter_type, reading FROM epp.meter_hourly_entries WHERE facility_id = {facility_id} and meter_id={meter_id} AND ( reading = 'NaN' OR reading IS NULL) AND is_independent_variable = {is_independent_variable} LIMIT {page_size} OFFSET ({page_number} - 1) * {page_size}"
missing_data_summary = """WITH date_range AS (
	SELECT  
		meter_id, 
		MAX(end_date) as end_date, 
		MIN(start_date) as start_date 
	FROM epp.meter_hourly_entries 
	WHERE reading NOT IN ( 'NaN') AND facility_id = {facility_id} 
    AND is_independent_variable = {is_independent_variable}
	GROUP BY  meter_id
), cte AS (
    SELECT 
        *,
        LAG(start_date) OVER (ORDER BY id) AS prev_start_date,
	    LAG(end_date) OVER (ORDER BY id) AS prev_end_date
    FROM meter_hourly_entries where facility_id={facility_id} 
    AND is_independent_variable = {is_independent_variable}
	AND start_date >= (SELECT MAX(start_date) from date_range where meter_id > 0) 
	AND end_date <=  (SELECT MIN(end_date) from date_range where meter_id > 0)
    {date_filter}
	order by start_date
), missing_date_range AS (
	SELECT 
		meter_id,
        meter_type,
        CASE WHEN meter_type = 1 THEN 'ELECTRICITY' WHEN meter_type = 2 THEN 'WATER' WHEN meter_type = 3 THEN 'NG' ELSE 'Unknown' END AS meter_name,
		meter_name as m_id, 
		ROUND(CAST(EXTRACT(EPOCH FROM (end_date - start_date)) / 3600 AS NUMERIC), 0) AS interval_start_end_date,
		CASE 
			WHEN prev_end_date IS NULL THEN 0
			ELSE ROUND(CAST(EXTRACT(EPOCH FROM (start_date - prev_end_date)) / 3600 AS NUMERIC), 0)
		END AS total_records,
		prev_end_date as time_stamp_start,
		start_date as time_stamp_end
	FROM cte 
	ORDER BY total_records desc 
), undefined_missing_data AS (
	SELECT 
		meter_type,
		meter_name as m_id, 
		CASE WHEN meter_type = 1 THEN 'ELECTRICITY' WHEN meter_type = 2 THEN 'WATER' WHEN meter_type = 3 THEN 'NG' ELSE 'Unknown' END AS meter_name, 
		COUNT(id) AS total_records, 
		TO_CHAR(MIN(start_date), 'YYYY/MM/DD HH24:MI') AS time_stamp_start, TO_CHAR(MAX(end_date), 'YYYY/MM/DD HH24:MI') AS time_stamp_end, 
		meter_id 
	FROM epp.meter_hourly_entries 
	WHERE facility_id = {facility_id} AND ( reading = 'NaN' OR reading IS NULL OR reading < 0) 
		AND start_date >= (SELECT MAX(start_date) from date_range where meter_id > 0) 
		AND end_date <=  (SELECT MIN(end_date) from date_range where meter_id > 0) 
		AND is_independent_variable = {is_independent_variable}
        {date_filter}
	GROUP BY meter_name, meter_type, meter_id ORDER BY meter_type
)
SELECT meter_type, meter_name, m_id, total_records, TO_CHAR(time_stamp_start::timestamp, 'YYYY/MM/DD HH24:MI') as time_stamp_start, TO_CHAR(time_stamp_end::timestamp, 'YYYY/MM/DD HH24:MI') as time_stamp_end, meter_id, 0 as missing_type FROM undefined_missing_data
UNION
SELECT meter_type, meter_name, m_id, total_records, TO_CHAR(time_stamp_start::timestamp, 'YYYY/MM/DD HH24:MI') as time_stamp_start, TO_CHAR(time_stamp_end::timestamp, 'YYYY/MM/DD HH24:MI') as time_stamp_end, meter_id, 1 as missing_type FROM missing_date_range WHERE total_records > 1"""
temp_missing_data_summary = "WITH quartiles AS (SELECT  meter_id, MAX(end_date) as end_date, MIN(start_date) as start_date FROM epp.meter_hourly_entries WHERE reading NOT IN ( 'NaN') AND facility_id = {} GROUP BY  meter_id) SELECT 'TEMPERATURE' AS meter_name, COUNT(id) AS total_records, TO_CHAR(MIN(date_time), 'YYYY/MM/DD HH24:MI') AS time_stamp_start, TO_CHAR(MAX(date_time + interval '1 hour'), 'YYYY/MM/DD HH24:MI') AS time_stamp_end, station_id as meter_id, 'weather' as m_id, 0 as missing_type FROM weather_data_records WHERE station_id = {} AND (temp = 'NaN' OR temp IS NULL) AND date_time >= (SELECT MAX(start_date) from quartiles where meter_id > 0) AND date_time <= (SELECT MIN(end_date) from quartiles where meter_id > 0)  {} GROUP BY station_id;"
temp_missing_data_summary_list = "SELECT TO_CHAR(w.date_time, 'YYYY/MM/DD HH24:MI') AS start_date, TO_CHAR(w.date_time + interval '1 hour', 'YYYY/MM/DD HH24:MI') AS end_date, w.station_id as meter_id, 104 as meter_type, temp as reading FROM  weather_data_records w WHERE w.station_id = {meter_id} AND (temp = 'NaN' OR temp IS NULL) order by start_date asc LIMIT {page_size} OFFSET ({page_number} - 1) * {page_size};"

# Summary Queries Ends





# Temperature Data
temperature_data_summary = "WITH quartiles AS (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY temp) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY temp) AS Q3 FROM weather_data_records WHERE temp NOT IN ( 'NaN') AND station_id = {}), outlier_ranges AS (SELECT Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - {} * (Q3 - Q1)) AS lower_bound, (Q3 + {} * (Q3 - Q1)) AS upper_bound FROM quartiles) SELECT 'TEMPERATURE' AS meter_name, 104 AS meter_type, COUNT(id) AS total_records, MIN(date_time) AS start_date, MAX(date_time + INTERVAL '1 hour') AS end_date, TO_CHAR(MIN(date_time), 'YYYY/MM/DD HH24:MI') AS time_stamp_start, TO_CHAR(MAX(date_time + INTERVAL '1 hour'), 'YYYY/MM/DD HH24:MI') AS time_stamp_end, CASE WHEN temp < lower_bound THEN 'Lower limit' WHEN temp > upper_bound THEN 'Upper limit' END AS bound_type FROM weather_data_records JOIN outlier_ranges ON station_id = {} AND temp NOT IN ( 'NaN') AND (temp < lower_bound OR temp > upper_bound) GROUP BY meter_name, meter_type, bound_type ORDER BY bound_type DESC;"

# Outlier Detail

# upper_bound_outlier_detail = "WITH quartiles AS (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) AS Q3 FROM meter_hourly_entries WHERE reading NOT IN (0, 'NaN') AND facility_id = 336), outlier_ranges AS (SELECT Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - 1.5 * (Q3 - Q1)) AS lower_bound, (Q3 + 1.5 * (Q3 - Q1)) AS upper_bound FROM quartiles) SELECT e.start_date, e.end_date, e.reading FROM meter_hourly_entries e JOIN outlier_ranges o ON e.facility_id = 336 WHERE e.reading NOT IN (0, 'NaN') AND (e.reading > o.upper_bound) AND e.is_independent_variable = False AND e.meter_type = 1 ORDER BY e.meter_type, e.start_date, e.end_date;"
upper_bound_outlier_detail = "WITH quartiles AS (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) AS Q3 FROM epp.meter_hourly_entries WHERE reading NOT IN ( 'NaN') AND facility_id = {}), outlier_ranges AS (SELECT Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - {} * (Q3 - Q1)) AS lower_bound,      (Q3 + {} * (Q3 - Q1)) AS upper_bound FROM quartiles) SELECT e.start_date, e.end_date, e.reading FROM meter_hourly_entries e JOIN outlier_ranges o ON e.facility_id = {} WHERE e.reading NOT IN ( 'NaN') AND (e.reading > o.upper_bound) AND e.is_independent_variable = {} AND e.meter_type = {} ORDER BY e.meter_type, e.start_date, e.end_date;"

# lower_bound_outlier_detail = "WITH quartiles AS (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) AS Q3 FROM meter_hourly_entries WHERE reading NOT IN (0, 'NaN') AND facility_id = 336), outlier_ranges AS (SELECT Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - 1.5 * (Q3 - Q1)) AS lower_bound, (Q3 + 1.5 * (Q3 - Q1)) AS upper_bound FROM quartiles) SELECT e.start_date, e.end_date, e.reading FROM meter_hourly_entries e JOIN outlier_ranges o ON e.facility_id = 336 WHERE e.reading NOT IN (0, 'NaN') AND (e.reading < o.lower_bound) AND e.is_independent_variable = False AND e.meter_type = 1 ORDER BY e.meter_type, e.start_date, e.end_date;"
lower_bound_outlier_detail = "WITH quartiles AS (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) AS Q3 FROM epp.meter_hourly_entries WHERE reading NOT IN ( 'NaN') AND facility_id = 336), outlier_ranges AS (SELECT Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - 1.5 * (Q3 - Q1)) AS lower_bound, (Q3 + 1.5 * (Q3 - Q1)) AS upper_bound FROM quartiles) SELECT e.start_date, e.end_date, e.reading FROM meter_hourly_entries e JOIN outlier_ranges o ON e.facility_id = 336 WHERE e.reading NOT IN ( 'NaN') AND (e.reading < o.lower_bound) AND e.is_independent_variable = False AND e.meter_type = 1 ORDER BY e.meter_type, e.start_date, e.end_date;"

# Observed Data Detail
# observed_data_detail = "WITH quartiles AS (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) AS Q3 FROM meter_hourly_entries WHERE reading NOT IN (0, 'NaN') AND facility_id = 336), outlier_ranges AS (SELECT Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - 1.5 * (Q3 - Q1)) AS lower_bound, (Q3 + 1.5 * (Q3 - Q1)) AS upper_bound FROM quartiles) SELECT e.start_date, e.end_date, e.reading FROM meter_hourly_entries e JOIN outlier_ranges o ON e.reading NOT IN (0, 'NaN') AND e.facility_id = 336 AND e.reading >= o.lower_bound AND e.reading <= o.upper_bound WHERE e.is_independent_variable = False AND e.meter_type = 1 ORDER BY e.start_date, e.end_date;"
observed_data_detail = "WITH quartiles AS (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY reading) AS Q1, percentile_cont(0.75) WITHIN GROUP (ORDER BY reading) AS Q3 FROM epp.meter_hourly_entries WHERE reading NOT IN ( 'NaN') AND facility_id =    {}), outlier_ranges AS (SELECT Q1, Q3, (Q3 - Q1) AS IQR, (Q1 - {} * (Q3 - Q1)) AS lower_bound, (Q3 + {} * (Q3 - Q1)) AS upper_bound FROM quartiles) SELECT e.start_date, e.end_date, e.reading FROM meter_hourly_entries e JOIN outlier_ranges o ON e.reading NOT IN ( 'NaN') AND e.facility_id = {} AND e.reading >= o.lower_bound AND e.reading <= o.upper_bound WHERE e.is_independent_variable = {} AND e.meter_type = {} ORDER BY e.start_date, e.end_date limit 50;"

# MissingData
# missing_data_detail = "SELECT e.start_date, e.end_date, e.reading FROM meter_hourly_entries AS e WHERE e.reading IN (0, 'NaN') AND e.meter_type = 3 AND e.facility_id = 336 AND e.is_independent_variable = False;"
missing_data_detail = "SELECT e.start_date, e.end_date, e.reading FROM epp.meter_hourly_entries AS e WHERE e.reading IN (0, 'NaN') AND e.meter_type = {} AND e.facility_id = {} AND e.is_independent_variable = {};"


OUTLIER_SETTING = """-- Complete unified query combining all three parts
WITH MeterReadings AS (
    SELECT 
        mhe.meter_id,
        fmd.meter_name,
        mhe.reading,
        CASE 
            WHEN mhe.meter_type = 1 THEN 'Electricity'
            WHEN mhe.meter_type = 2 THEN 'Water'
            WHEN mhe.meter_type = 3 THEN 'NG'
            ELSE 'Other'
        END AS meter_type
    FROM 
        epp.meter_hourly_entries mhe 
    JOIN 
        epp.facility_meter_detail fmd 
    ON 
        fmd.id = mhe.meter_id 
    WHERE 
        fmd.facility_id = {}
        AND mhe.reading > 0
),
MeterQuartiles AS (
    SELECT 
        meter_type,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY reading) AS Q1,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY reading) AS Q3,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY reading) - 
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY reading) AS IQR
    FROM MeterReadings
    GROUP BY meter_type
),
AverageReadings1 AS (
    SELECT 
        start_date, 
        end_date, 
        is_independent_variable AS "Independent Variable", 
        ROUND(CAST(AVG(reading) AS numeric), 2) AS average_readings
    FROM 
        epp.meter_hourly_entries
    WHERE 
        facility_id = {} 
        AND reading >= 0 
        AND is_independent_variable = true
    GROUP BY 
        start_date, 
        end_date, 
        is_independent_variable
),
Quartiles1 AS (
    SELECT 
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY average_readings) AS Q1,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY average_readings) AS Q3,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY average_readings) - 
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY average_readings) AS IQR
    FROM AverageReadings1
),
AverageReadings2 AS (
    SELECT 
        date_time, 
        ROUND(CAST(AVG(temp) AS numeric), 2) AS average_readings
    FROM 
        epp.weather_data_records
    WHERE 
        station_id IN {}
    GROUP BY 
        date_time 
),
Quartiles2 AS (
    SELECT 
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY average_readings) AS Q1,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY average_readings) AS Q3,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY average_readings) - 
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY average_readings) AS IQR
    FROM AverageReadings2
)

SELECT 
    meter_type AS meter_name,
    ROUND(CAST(IQR AS numeric), 2) as inter_quartile,
    Q1 as first_quartile,
    Q3 as third_quartile,
    ROUND(CAST((Q1 - 3 * IQR) AS numeric), 2) AS lower_limit,
    ROUND(CAST((Q3 + 3 * IQR) AS numeric), 2) AS upper_limit
FROM 
    MeterQuartiles

UNION ALL

SELECT
    'Independent Variable' AS meter_name,
    ROUND(CAST(IQR AS numeric), 2) as inter_quartile,
    Q1 as first_quartile,
    Q3 as third_quartile,
    ROUND(CAST((Q1 - 1.5 * IQR) AS numeric), 2) AS lower_limit,
    ROUND(CAST((Q3 + 1.5 * IQR) AS numeric), 2) AS upper_limit
FROM 
    Quartiles1

UNION ALL

SELECT
    'Temperature' AS meter_name,
    ROUND(CAST(IQR AS numeric), 2) as inter_quartile,
    Q1 as first_quartile,
    Q3 as third_quartile,
    ROUND(CAST((Q1 - 3 * IQR) AS numeric), 2) AS lower_limit,
    ROUND(CAST((Q3 + 3 * IQR) AS numeric), 2) AS upper_limit
FROM 
    Quartiles2;
"""

