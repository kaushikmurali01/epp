# Independent Variable Triggers
CREATE_TRIGGER = """
CREATE OR REPLACE FUNCTION process_meter_entries()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the new entry has is_independent_variable set to true
    IF NEW.is_independent_variable AND NEW.is_active THEN
        -- Insert the transformed entry into iv_hourly_entries
        INSERT INTO epp.iv_hourly_entries (
            start_date,
            end_date,
            meter_id,
            independent_variable_id,
            is_independent_variable,
            meter_name,
            reading,
            meter_type,
            facility_id
        )
        SELECT
            generate_series(date_trunc('hour', NEW.start_date), date_trunc('hour', NEW.end_date) - interval '1 hour', '1 hour'),
            generate_series(date_trunc('hour', NEW.start_date) + interval '1 hour', date_trunc('hour', NEW.end_date), '1 hour'),
            NEW.meter_id,
            NEW.independent_variable_id,
            NEW.is_independent_variable,
            NEW.meter_name,
            NEW.reading,  -- Assuming direct insertion; modify as needed for hourly conversion
            NEW.meter_type,
            NEW.facility_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_meter_entries
AFTER INSERT ON epp.meter_hourly_entries
FOR EACH ROW
EXECUTE PROCEDURE process_meter_entries();
"""

DELETE_TRIGGER = """
CREATE OR REPLACE FUNCTION delete_iv_entries()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete entries from iv_hourly_entries where they match the deleted meter entry
    DELETE FROM epp.iv_hourly_entries
    WHERE meter_id = OLD.meter_id
      AND start_date = OLD.start_date
      AND end_date = OLD.end_date
      AND independent_variable_id = OLD.independent_variable_id
      AND is_independent_variable = OLD.is_independent_variable;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_meter_entries
AFTER DELETE ON epp.meter_hourly_entries
FOR EACH ROW
EXECUTE PROCEDURE delete_iv_entries();

"""

PUSH_EXISTING_DATA_TO_IV_TABLE = """
INSERT INTO epp.iv_hourly_entries (
    start_date,
    end_date,
    meter_id,
    independent_variable_id,
    is_independent_variable,
    meter_name,
    reading,
    meter_type,
    facility_id
)
SELECT
    generate_series(date_trunc('hour', start_date), date_trunc('hour', end_date) - interval '1 hour', '1 hour') AS start_date,
    generate_series(date_trunc('hour', start_date) + interval '1 hour', date_trunc('hour', end_date), '1 hour') AS end_date,
    meter_id,
    independent_variable_id,
    is_independent_variable,
    meter_name,
    reading, -- Adjust this if needed for hourly conversion
    meter_type,
    facility_id
FROM epp.meter_hourly_entries
WHERE is_independent_variable = TRUE AND is_active = TRUE;
"""

# Meter
CREATE_ENERGY_ENTRIES = """
CREATE OR REPLACE FUNCTION process_energy_data_entries() RETURNS TRIGGER AS $$
BEGIN 
    -- Only process active, non-independent variable entries
    IF NOT (NEW.is_independent_variable) AND (NEW.is_active) THEN 
        -- Insert or update hourly entries with summed readings
        INSERT INTO epp.energy_hourly_entries (
            start_date, 
            end_date, 
            meter_id, 
            meter_name, 
            reading, 
            meter_type, 
            facility_id
        )
        VALUES (
            date_trunc('hour', NEW.start_date),
            date_trunc('hour', NEW.start_date) + interval '1 hour',
            NEW.meter_id, 
            NEW.meter_name, 
            NEW.reading, 
            NEW.meter_type, 
            NEW.facility_id
        )
        ON CONFLICT (start_date, meter_id) DO UPDATE 
        SET reading = epp.energy_hourly_entries.reading + EXCLUDED.reading;
    END IF;

    -- Return the NEW row to indicate successful processing for the trigger
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_energy_entries
AFTER INSERT ON epp.meter_hourly_entries
FOR EACH ROW
EXECUTE PROCEDURE process_energy_data_entries();
"""

DELETE_ENERGY_ENTRIES = """
CREATE OR REPLACE FUNCTION delete_energy_entries() RETURNS TRIGGER AS $$
BEGIN 
    -- Delete entries from energy_hourly_entries for the same hour as the deleted meter entry
    DELETE FROM epp.energy_hourly_entries 
    WHERE 
        meter_id = OLD.meter_id AND 
        start_date = date_trunc('hour', OLD.start_date);
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_energy_entries
AFTER DELETE ON epp.meter_hourly_entries
FOR EACH ROW
EXECUTE FUNCTION delete_energy_entries();
"""

BULK_ENERGY_ENTRIES = """
CREATE OR REPLACE FUNCTION bulk_convert_energy_entries() RETURNS VOID AS $$
BEGIN
    -- Delete existing entries to start fresh
    DELETE FROM epp.energy_hourly_entries;

    -- Insert summed hourly entries
    INSERT INTO epp.energy_hourly_entries (
        start_date, 
        end_date, 
        meter_id, 
        meter_name, 
        reading, 
        meter_type, 
        facility_id
    )
    SELECT 
        date_trunc('hour', start_date) AS start_date,
        date_trunc('hour', start_date) + interval '1 hour' AS end_date,
        meter_id,
        meter_name,
        SUM(reading) AS reading,
        meter_type,
        facility_id
    FROM 
        epp.meter_hourly_entries
    WHERE 
        is_independent_variable = false 
        AND is_active = true
    GROUP BY 
        date_trunc('hour', start_date),
        meter_id,
        meter_name,
        meter_type,
        facility_id;
END;
$$ LANGUAGE plpgsql;

SELECT bulk_convert_energy_entries();

"""

PERFORMANCE_DATA_INSERTION = """
-- First, create the target table if it doesn't exist
CREATE TABLE IF NOT EXISTS epp.performance_calculated_data (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER,
    meter_type TEXT,
    observed FLOAT,
    start_date TIMESTAMP,
    predicted FLOAT,
    temperature FLOAT
);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION epp.process_scoring_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert the exploded data into the performance_calculated_data table
    INSERT INTO epp.performance_calculated_data (
        facility_id,
        meter_type,
        observed,
        start_date,
        predicted,
        temperature
    )
    SELECT 
        NEW.facility_id,
        NEW.meter_type,
        (json_array_elements(NEW.scoring_data::json)->>'observed')::float as observed,
        to_timestamp((json_array_elements(NEW.scoring_data::json)->>'Timestamp')::bigint/1000) as start_date,
        (json_array_elements(NEW.scoring_data::json)->>'predicted')::float as predicted,
        (json_array_elements(NEW.scoring_data::json)->>'temperature')::float as temperature;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE OR REPLACE TRIGGER scoring_data_insert_trigger
    AFTER INSERT ON epp.scoring_data_output
    FOR EACH ROW
    EXECUTE FUNCTION epp.process_scoring_data();
"""

UPDATE_EXISTING_PERFORMANCE_RECORDS = """
INSERT INTO epp.performance_calculated_data (
    facility_id,
    meter_type,
    observed,
    start_date,
    predicted,
    temperature
)
SELECT 
    facility_id,
    meter_type,
    (json_array_elements(scoring_data::json)->>'observed')::float as observed,
    to_timestamp((json_array_elements(scoring_data::json)->>'Timestamp')::bigint/1000) as start_date,
    (json_array_elements(scoring_data::json)->>'predicted')::float as predicted,
    (json_array_elements(scoring_data::json)->>'temperature')::float as temperature
FROM epp.scoring_data_output;
"""

# Baseline
BASELINE_DATA_INSERTION = """
-- First, create the target table if it doesn't exist
CREATE TABLE IF NOT EXISTS epp.processed_baseline_data (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER,
    meter_type INTEGER,
    start_date TIMESTAMP,
    observed FLOAT,
    predicted FLOAT,
    temperature FLOAT
);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION epp.process_baseline_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert new records from output_data JSON array into processed_baseline_data
    INSERT INTO epp.processed_baseline_data (
        facility_id,
        meter_type,
        start_date,
        observed,
        predicted,
        temperature
    )
    SELECT
        NEW.facility_id,
        NEW.meter_type,
        to_timestamp((json_array_elements(NEW.output_data::json)->>'Timestamp')::bigint / 1000) as start_date,
        (json_array_elements(NEW.output_data::json)->>'observed')::float as observed,
        (json_array_elements(NEW.output_data::json)->>'predicted')::float as predicted,
        (json_array_elements(NEW.output_data::json)->>'temperature')::float as temperature
    ;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE OR REPLACE TRIGGER baseline_data_insert_trigger
AFTER INSERT ON epp.baseline_model_output_data
FOR EACH ROW
EXECUTE FUNCTION epp.process_baseline_data();
"""

UPDATE_EXISTING_BASELINE_RECORDS = """
INSERT INTO epp.processed_baseline_data (
    facility_id,
    meter_type,
    start_date,
    observed,
    predicted,
    temperature
)
SELECT
    facility_id,
    meter_type,
    to_timestamp((json_array_elements(output_data::json)->>'Timestamp')::bigint / 1000) as start_date,
    (json_array_elements(output_data::json)->>'observed')::float as observed,
    (json_array_elements(output_data::json)->>'predicted')::float as predicted,
    (json_array_elements(output_data::json)->>'temperature')::float as temperature
FROM epp.baseline_model_output_data;

"""