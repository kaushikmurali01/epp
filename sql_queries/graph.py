from utils import get_nearest_stations


def get_graph_query(facility_id, meter_type, from_date, to_date, stations):
    GRAPH_QUERY = f"""WITH TempData AS (
        SELECT 
            date_trunc('hour', date_time) AS hourly_date_time,
            AVG(temp) AS avg_temp
        FROM 
            epp.weather_data_records
        WHERE 
            station_id IN {stations}
            AND date_time::date BETWEEN '{from_date}' AND '{to_date}'
        GROUP BY 
            date_trunc('hour', date_time)
    ), RawData AS (
        SELECT 
            date_trunc('hour', start_date) AS hourly_start_date,
            purchased_from_grid,
            SUM(avg_reading) AS total_hourly_reading
        FROM (
            SELECT 
                start_date,
                end_date,
                purchased_from_grid,
                AVG(reading) AS avg_reading
            FROM 
                epp.meter_hourly_entries
            WHERE 
                facility_id = {facility_id}
                AND meter_type = {meter_type}
                AND start_date::date BETWEEN '{from_date}' AND '{to_date}'
            GROUP BY 
                start_date, end_date, purchased_from_grid
        ) AS subquery
        GROUP BY 
            date_trunc('hour', start_date), 
            purchased_from_grid
    )
    SELECT 
        r.hourly_start_date,
        r.purchased_from_grid,
        r.total_hourly_reading,
        TO_CHAR(ROUND(t.avg_temp, 2), 'FM999999999.99') AS avg_temp
    FROM 
        RawData r
    LEFT JOIN 
        TempData t ON r.hourly_start_date = t.hourly_date_time
    ORDER BY 
        r.hourly_start_date, r.purchased_from_grid;
    """
    return GRAPH_QUERY
