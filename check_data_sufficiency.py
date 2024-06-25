def check_data_sufficiency(df, required_columns, granularity):
    if granularity == 'hourly':
        unique_dates = df['Date'].dt.date.unique()
        expected_rows = 24 * len(unique_dates)  # 24 hours for each unique day
    else:
        unique_dates = df['Date'].dt.date.unique()  # Use 'Date' column for daily
        expected_rows = len(unique_dates)  # 1 row for each unique day
    
    # Check for rows where all required columns are non-missing
    sufficient_rows = df.dropna(subset=required_columns).shape[0]
    
    sufficiency = (sufficient_rows / expected_rows) * 100
    
    # Debug #prints
    #print(f"Unique Dates: {len(unique_dates)}")
    #print(f"Expected Rows: {expected_rows}")
    #print(f"Sufficient Rows: {sufficient_rows}")
    #print(f"Sufficiency: {sufficiency}%")
    
    return sufficiency