import pandas as pd


def process_excel(file):
    try:
        # Read the uploaded Excel file
        df = pd.read_excel(file)
        # Check if the required columns are present
        required_columns = ['Start Date (Required)', 'End Date (Required)', 'Meter Reading (Required)']
        if not all(column in df.columns for column in required_columns):
            return {"error": "Missing required columns"}

        # Drop rows with any missing values
        df = df.dropna(subset=required_columns)

        # Convert 'Start Date (Required)' and 'End Date (Required)' to datetime
        df['Start Date (Required)'] = pd.to_datetime(df['Start Date (Required)'], errors='coerce')
        df['End Date (Required)'] = pd.to_datetime(df['End Date (Required)'], errors='coerce')

        # Remove rows with invalid dates
        df = df.dropna(subset=['Start Date (Required)', 'End Date (Required)'])

        # Ensure 'Meter Reading (Required)' is numeric
        df['Meter Reading (Required)'] = pd.to_numeric(df['Meter Reading (Required)'], errors='coerce')

        # Remove rows with non-numeric meter readings
        df = df.dropna(subset=['Meter Reading (Required)'])

        # Further processing can be done here
        # For example, calculate the duration between Start and End Dates
        df['Duration'] = (df['End Date (Required)'] - df['Start Date (Required)']).dt.days

        # Convert the DataFrame to a list of dictionaries
        data = df.to_dict(orient='records')

        return {"data": data}
    except Exception as e:
        return {"error": str(e)}
