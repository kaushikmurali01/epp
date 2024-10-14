INDEPENDENT_VARIABLE_QUERY = """SELECT MAX(mhe.duration) AS max_duration, iv.name, iv.id
FROM epp.meter_hourly_entries AS mhe
JOIN epp.independent_variable AS iv ON mhe.independent_variable_id = iv.id
WHERE mhe.facility_id = {}
GROUP BY iv.name, iv.id;"""