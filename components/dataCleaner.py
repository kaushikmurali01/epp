import numpy as np
import pandas as pd


def detect_outliers_iqr(df, column, factor=3):
    # Calculate Q1, Q3, and IQR
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1

    # Calculate the outlier range
    lower_bound = Q1 - factor * IQR
    upper_bound = Q3 + factor * IQR

    # Identify outliers
    outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)]

    return outliers, lower_bound, upper_bound


def replace_consecutive_nulls(df, primary_col, replacement_cols, consecutive_count=6):
    df = df.copy()
    null_series = df[primary_col].isnull()
    # Identify groups of consecutive nulls
    null_groups = (null_series != null_series.shift()).cumsum()
    null_sequences = null_groups[null_series].value_counts().sort_index()

    for group, length in null_sequences.items():
        if length == consecutive_count:
            # Interpolate for exactly 6 consecutive nulls
            mask = (null_groups == group) & null_series
            df.loc[mask, primary_col] = df.loc[mask, primary_col].interpolate()
        elif length > consecutive_count:
            # Use replacement columns for more than 6 consecutive nulls
            mask = (null_groups == group) & null_series
            for replacement_col in replacement_cols:
                df.loc[mask, primary_col] = df.loc[mask, primary_col].fillna(df.loc[mask, replacement_col])
                mask = (null_groups == group) & df[primary_col].isnull()
                if not mask.any():
                    break
    return df


def clean_raw_data(dataframe):
    df = dataframe.copy()
    meter_columns = df[df['meter_type'].isin([1, 2, 3])]['meter_name'].unique()
    iv_columns = df[df['meter_type'].isna()]['meter_name'].unique()
    new_df = df.pivot_table(values='reading',
                            index='start_date',
                            columns='meter_name',
                            aggfunc='first',
                            )
    new_df_columns = new_df.columns
    temp_columns = ['Temp1', 'Temp2', 'Temp3']
    for col in temp_columns:
        if col not in new_df_columns:
            new_df[col] = np.nan
    # Reset the index to make start_date a column
    new_df.reset_index(inplace=True)

    # Sort the dataframe by start_date
    new_df.sort_values('start_date', inplace=True)

    new_df['Temperature'] = new_df['Temp1']

    new_df = new_df.rename(columns={meter_columns[0]: 'EnergyConsumption', 'start_date': 'Date'})

    columns_order = ['Date', 'EnergyConsumption', 'Temperature']
    columns_order.extend(iv_columns)
    columns_order.extend(temp_columns)
    new_df = new_df[columns_order]

    # Apply the function
    df = replace_consecutive_nulls(new_df, 'Temperature', ['Temp2', 'Temp3'])

    new_df = df
    new_df['Temperature'] = new_df.Temperature.interpolate()
    output_columns = ['Date', 'EnergyConsumption', 'Temperature']
    output_columns.extend([i for i in iv_columns ])
    new_df = new_df.drop(new_df[new_df['EnergyConsumption'] <= 0].index)
    new_df.reset_index()
    # Apply the function to the EnergyConsumption column
    outliers, lower_bound, upper_bound = detect_outliers_iqr(new_df, 'EnergyConsumption', factor=3)
    new_df = new_df[(new_df['EnergyConsumption'] < upper_bound) & (new_df['EnergyConsumption'] > lower_bound)]
    output_col = ['Date', 'EnergyConsumption', 'Temperature']
    output_col.extend(iv_columns)
    output_df = new_df[output_col]
    output_df = output_df[output_df['EnergyConsumption'] != 0]
    output_df['Date'] = pd.to_datetime(output_df['Date']).dt.strftime('%Y-%m-%d %H:%M:%S')
    return output_df.to_dict()
