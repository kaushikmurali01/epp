import pandas as pd
import numpy as np
from visualizing_issues import visualize_outliers
import warnings
warnings.filterwarnings('ignore')
from geopy.distance import geodesic
from summarize_data import summarize_data

def detect_issues(summary_df, outlier_threshold=3):
    # print("Summary data coming here is - - -- - - -- - -- - - - -- - - - -- - -- ", summary_df)
    issues = {}

    # Ensure the index is datetime
    if not pd.api.types.is_datetime64_any_dtype(summary_df.index):
        summary_df.index = pd.to_datetime(summary_df.index, errors='coerce')
    
    # Set 'Date' as datetime if it exists
    if 'Date' in summary_df.columns:
        summary_df['Date'] = pd.to_datetime(summary_df['Date'], errors='coerce')

    # Calculate sufficiency for each month
    if 'Temperature' in summary_df.columns and 'EnergyConsumption' in summary_df.columns:
        summary_df['month'] = summary_df['Date'].dt.strftime('%B')
        summary_df['month_year'] = summary_df['Date'].dt.strftime('%B %Y')
        
        monthly_sufficiency = calculate_monthly_sufficiency(summary_df)
        issues['monthly_sufficiency'] = monthly_sufficiency

    # Detect outliers for each numeric column using IQR method
    numeric_columns = summary_df.select_dtypes(include=np.number).columns

        # Detect outliers for each numeric column using IQR method
    outliers_dict = {}
    for col in numeric_columns:
        q1 = summary_df[col].quantile(0.25)
        q3 = summary_df[col].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - outlier_threshold * iqr
        upper_bound = q3 + outlier_threshold * iqr

        outliers_mask = (summary_df[col] < lower_bound) | (summary_df[col] > upper_bound)
        outliers = summary_df.loc[outliers_mask, [col, 'Date']]
        if not outliers.empty:
            outliers_dict[col] = {row[col]: row['Date'].strftime('%Y-%m-%d %H:%M:%S') for _, row in outliers.iterrows()}

    if outliers_dict:
        issues['outliers'] = outliers_dict

    return issues

def calculate_monthly_sufficiency(df):
    df['month_year'] = df['Date'].dt.to_period('M')
    
    # Calculate expected rows (24 readings per day for each month)
    monthly_expected = df.groupby('month_year').apply(
        lambda x: 24 * x['Date'].dt.daysinmonth.iloc[0]
    )
    
    # Calculate non-null rows for 'Temperature' and 'EnergyConsumption'
    monthly_non_null = df.groupby('month_year').apply(
        lambda x: x.dropna(subset=['Temperature', 'EnergyConsumption']).shape[0]
    )
    
    # Calculate sufficiency percentage
    monthly_sufficiency = (monthly_non_null / monthly_expected) * 100
    
    sufficiency_output = [
        {'month': month.strftime('%B %Y'), 'value': f"{sufficiency:.2f}"}
        for month, sufficiency in monthly_sufficiency.items()
    ]
    return sufficiency_output


def handle_issues(summary_df, weather_df, issues, target_station, granularity):
    if 'missing_values' in issues:
        missing_values = issues['missing_values']
        
        if 'EnergyConsumption' in missing_values:
            summary_df = summary_df.dropna(subset=['EnergyConsumption'])
        
        if 'Temperature' in missing_values:
            print("Handling missing Temperature values...")
            summary_df['Date'] = pd.to_datetime(summary_df['Date'])
            summary_df = summary_df.set_index('Date')
            
            # Identify consecutive missing periods
            summary_df['missing_temp'] = summary_df['Temperature'].isna()
            summary_df['gap_id'] = (summary_df['missing_temp'] != summary_df['missing_temp'].shift(1)).cumsum()
            gaps = summary_df[summary_df['missing_temp']].groupby('gap_id').size()
            print(f"Identified gaps: {gaps}")
            
            if granularity == 'hourly':
                long_missing_periods = gaps[gaps > 6]
            else:  # daily granularity
                long_missing_periods = gaps[gaps > 1]
            long_missing_dates = summary_df[summary_df['gap_id'].isin(long_missing_periods.index)].index
            short_missing_dates = summary_df[~summary_df['gap_id'].isin(long_missing_periods.index)].index
            
            if not long_missing_dates.empty:
                print(f"Filling long missing periods: {long_missing_dates}")
                filled_data = get_nearest_station_data(weather_df, long_missing_dates, target_station, issues)
                
                # Remove duplicate indices from filled_data
                filled_data = filled_data[~filled_data.index.duplicated(keep='first')]
                
                print(f"Filled data: {filled_data}")
                summary_df.update(filled_data)
            
            if not short_missing_dates.empty:
                print(f"Interpolating short missing periods: {short_missing_dates}")
                summary_df['Temperature'].interpolate(method='time', inplace=True)
                
            summary_df.drop(columns=['missing_temp', 'gap_id'], inplace=True)
    
    return summary_df.reset_index()

def get_nearest_station_data(weather_df, missing_dates, target_station, issues):
    if weather_df.empty or target_station is None:
        print("No data available to process.")
        return pd.DataFrame()  # Return an empty DataFrame if there's no data to process

    target_coords = (target_station['latitude'], target_station['longitude'])
    print(f"Target coords: {target_coords}")

    # Calculate the distance to other stations
    weather_df['distance'] = weather_df.apply(
        lambda row: geodesic(target_coords, (row['latitude'], row['longitude'])).kilometers, axis=1)
    
    # Find the nearest station
    nearest_station = weather_df.loc[weather_df['distance'].idxmin()]['station_name']
    nearest_station_data = weather_df[weather_df['station_name'] == nearest_station]
    nearest_station_data['date_time'] = pd.to_datetime(nearest_station_data['date_time'])

    # Ensure the missing dates are in datetime format
    missing_dates = pd.to_datetime(missing_dates)

    # Fill missing data from the nearest station
    filled_data = nearest_station_data[nearest_station_data['date_time'].isin(missing_dates)]
    filled_data = filled_data[['date_time', 'temp']].set_index('date_time')
    
    print(f"Filled data from nearest station: {filled_data}")

    if not filled_data.empty:
        # Remove filled dates from the issues dictionary
        filled_dates = [ts.strftime('%Y-%m-%d %H:%M:%S') for ts in filled_data.index]
        issues['missing_values']['Temperature'] = [date for date in issues['missing_values']['Temperature'] if date not in filled_dates]
        if not issues['missing_values']['Temperature']:
            del issues['missing_values']['Temperature']

    return filled_data