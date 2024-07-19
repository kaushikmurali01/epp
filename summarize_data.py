import pandas as pd
from check_data_sufficiency import check_data_sufficiency


# def summarize_data(raw_df, weather_df, granularity='hourly'):
#     # Convert to datetime
#     raw_df['ReadingDate'] = pd.to_datetime(raw_df['ReadingDate'])
#     weather_df['date_time'] = pd.to_datetime(weather_df['date_time'])
#     columns_to_drop = []
#     # Drop unnecessary columns
#     weather_df.drop(columns=['climate_id', 'year', 'month', 'day', 'time', 'temp_flag', 'dew_point_temp', 
#                        'dew_point_temp_flag', 'rel_hum', 'rel_hum_flag', 'precip_amount', 'precip_amount_flag', 
#                        'station_press', 'station_press_flag','wind_dir', 'wind_dir_flag', 'wind_spd', 'wind_spd_flag',
#                        'visibility_km','visibility_flag', 'hmdx', 'hmdx_flag', 'wind_chill', 'wind_chill_flag', 'weather'], inplace=True)

#     # Select required columns
#     selected_columns = ['longitude', 'latitude', 'date_time', 'temp', 'station_name']
#     weather_df = weather_df[selected_columns]

#     # Ensure datetime conversion
#     raw_df['ReadingDate'] = pd.to_datetime(raw_df['ReadingDate'])
#     weather_df['date_time'] = pd.to_datetime(weather_df['date_time'])

#     # Set index and resample
#     raw_df.set_index('ReadingDate', inplace=True)
#     raw_df_numeric = raw_df.select_dtypes(include=['float64', 'int64'])
#     raw_df_hourly = raw_df_numeric.resample('H').sum()

#     # Merge DataFrames
#     merged_df = pd.merge(weather_df, raw_df_hourly, left_on='date_time', right_index=True, how='right')
#     merged_df.rename(columns={'date_time': 'Date'}, inplace=True)
#     # Add additional columns
#     merged_df['DayNumber'] = merged_df['Date'].dt.day
#     merged_df['WeekNumber'] = merged_df['Date'].dt.strftime('%W').astype(int) + 1
#     merged_df['MonthNumber'] = merged_df['Date'].dt.month
#     merged_df['MonthName'] = merged_df['Date'].dt.month_name()
#     merged_df.rename(columns={'temp': 'Temperature'}, inplace=True)

#     # Assuming 'kW' is the column to be renamed to 'EnergyConsumption'
#     if 'kW' in merged_df.columns:
#         merged_df.rename(columns={'kW': 'EnergyConsumption'}, inplace=True)
#     required_columns = ['Temperature', 'EnergyConsumption']
#     # Check data sufficiency


#     if granularity == 'hourly':
#         sufficiency = check_data_sufficiency(merged_df,required_columns, granularity)
#         return merged_df, sufficiency
#     elif granularity == 'daily':
#         merged_df['Date'] = merged_df['Date'].dt.date
#         merged_df['DayNumber'] = merged_df['Date'].apply(lambda x: x.day)  # Extract day component
#         # Group by 'Date' and aggregate other columns
#         daily_summary = merged_df.groupby('Date').agg({
#             'Temperature': 'mean',
#             'EnergyConsumption': 'sum',
#             'DayNumber': 'first',  
#             'WeekNumber': 'first',  
#             'MonthNumber': 'first',  
#             'MonthName': 'first'  
#         }).reset_index()

#         # sufficiency = check_data_sufficiency(daily_summary, required_columns, granularity)
#         return daily_summary
#     elif granularity == 'monthly':
#         merged_df['Date'] = merged_df['Date'].dt.month
#         # Group by 'Date' and aggregate other columns
#         monthly_summary = merged_df.groupby('Date').agg({
#             'Temperature': 'mean',
#             'EnergyConsumption': 'sum', 
#             'MonthNumber': 'first',  
#             'MonthName': 'first'  
#         }).reset_index()
#         # sufficiency = check_data_sufficiency(monthly_summary, required_columns, granularity)
#         return monthly_summary


def summarize_data(raw_df, weather_df, granularity='hourly'):
    # try:
    # Convert to datetime
    raw_df['ReadingDate'] = pd.to_datetime(raw_df['ReadingDate'])
    weather_df['date_time'] = pd.to_datetime(weather_df['date_time'])

    # Drop unnecessary columns
    columns_to_drop = ['climate_id', 'year', 'month', 'day', 'time', 'temp_flag', 'dew_point_temp',
                       'dew_point_temp_flag', 'rel_hum', 'rel_hum_flag', 'precip_amount', 'precip_amount_flag',
                       'station_press', 'station_press_flag', 'wind_dir', 'wind_dir_flag', 'wind_spd', 'wind_spd_flag',
                       'visibility_km', 'visibility_flag', 'hmdx', 'hmdx_flag', 'wind_chill', 'wind_chill_flag',
                       'weather']

    # Check if columns exist before dropping them
    columns_to_drop = [col for col in columns_to_drop if col in weather_df.columns]
    weather_df.drop(columns=columns_to_drop, inplace=True)

    # Select required columns
    selected_columns = ['longitude', 'latitude', 'date_time', 'temp', 'station_name']
    weather_df = weather_df[selected_columns]

    # Ensure datetime conversion
    raw_df['ReadingDate'] = pd.to_datetime(raw_df['ReadingDate'])
    weather_df['date_time'] = pd.to_datetime(weather_df['date_time'])

    # Debugging statements to check column names
    print("raw_df columns:", raw_df.columns)
    print("weather_df columns:", weather_df.columns)

    # Set index and resample
    raw_df.set_index('ReadingDate', inplace=True)
    raw_df_numeric = raw_df.select_dtypes(include=['float64', 'int64'])
    raw_df_hourly = raw_df_numeric.resample('H').sum()

    # Merge DataFrames
    merged_df = pd.merge(weather_df, raw_df_hourly, left_on='date_time', right_index=True, how='right')
    merged_df.rename(columns={'date_time': 'Date'}, inplace=True)

    # Add additional columns
    merged_df['DayNumber'] = merged_df['Date'].dt.day
    merged_df['WeekNumber'] = merged_df['Date'].dt.strftime('%W').astype(int) + 1
    merged_df['MonthNumber'] = merged_df['Date'].dt.month
    merged_df['MonthName'] = merged_df['Date'].dt.month_name()
    merged_df.rename(columns={'temp': 'Temperature'}, inplace=True)

    # Assuming 'kW' is the column to be renamed to 'EnergyConsumption'
    if 'kW' in merged_df.columns:
        merged_df.rename(columns={'kW': 'EnergyConsumption'}, inplace=True)

    required_columns = ['Temperature', 'EnergyConsumption']
    merged_df.to_csv("merger.csv")
    # Check data sufficiency
    if granularity == 'hourly':
        sufficiency = check_data_sufficiency(merged_df, required_columns, granularity)
        return merged_df, sufficiency
    elif granularity == 'daily':
        merged_df['Date'] = merged_df['Date'].dt.date
        merged_df['DayNumber'] = merged_df['Date'].apply(lambda x: x.day)
        daily_summary = merged_df.groupby('Date').agg({
            'Temperature': 'mean',
            'EnergyConsumption': 'sum',
            'DayNumber': 'first',
            'WeekNumber': 'first',
            'MonthNumber': 'first',
            'MonthName': 'first'
        }).reset_index()
        sufficiency = check_data_sufficiency(daily_summary, required_columns, granularity)
        return daily_summary, sufficiency
    elif granularity == 'monthly':
        monthly_summary = merged_df.resample('M', on='Date').agg({
            'Temperature': 'mean',
            'EnergyConsumption': 'sum',
            'MonthNumber': 'first',
            'MonthName': 'first'
        }).reset_index()
        sufficiency = check_data_sufficiency(monthly_summary, required_columns, granularity)
        return monthly_summary, sufficiency
    # except Exception as e:
    #     print(f"Error in summarize_data: {e}")
    #     return pd.DataFrame(), 0
