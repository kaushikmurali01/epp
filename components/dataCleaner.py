import numpy as np
import pandas as pd

from dbconnection import dbtest
from sql_queries.data_cleaning import get_outliers


def detect_outliers_iqr_new(df, column):
    # Calculate quartiles
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)

    # Calculate IQR
    IQR = Q3 - Q1

    # Calculate bounds (same logic as SQL query)
    lower_bound = max(1, Q1 - 3 * IQR)  # Using max to ensure non-negative value
    upper_bound = Q3 + 3 * IQR
    outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)]
    return outliers, lower_bound, upper_bound


    # return {
    #     'first_quartile': Q1,
    #     'third_quartile': Q3,
    #     'lower_bound': lower_bound,
    #     'upper_bound': upper_bound
    # }

def detect_outliers_iqr(df, column, facility_id, meter_type):
    min_date, max_date = df['Date'].min(), df['Date'].max()
    min_date = min_date.strftime('%Y-%m-%d %H:%M:%S')
    max_date = max_date.strftime('%Y-%m-%d %H:%M:%S')

    query = get_outliers(facility_id, meter_type, min_date, max_date, factor=3)
    outlier_df = dbtest(query)
    upper_bound, lower_bound = round(outlier_df['upper_bound'][0], 2), round(outlier_df['lower_bound'][0], 2)
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


#
#
# def clean_raw_data(dataframe):
#     df = dataframe.copy()
#
#     # Identifying unique meter names based on conditions
#     meter_columns = df[df['meter_type'].isin([1, 2, 3])]['meter_name'].unique()
#     iv_columns = df[df['meter_type'].isna()]['meter_name'].unique()
#
#     # Creating a pivot table
#     new_df = df.pivot_table(values='reading',
#                             index='start_date',
#                             columns='meter_name',
#                             aggfunc='first')
#     print(len(new_df), 'Initial')
#
#     # Handling missing temporary columns
#     temp_columns = ['Temp1', 'Temp2', 'Temp3']
#     for col in temp_columns:
#         if col not in new_df.columns:
#             new_df[col] = np.nan
#
#     # Rename 'start_date' to 'Date' before further processing
#     new_df.reset_index(inplace=True)
#     new_df.rename(columns={'start_date': 'Date'}, inplace=True)
#
#     # Sort by 'Date'
#     new_df.sort_values('Date', inplace=True)
#
#     # Temperature assignment and handling
#     new_df['Temperature'] = new_df['Temp1']
#     new_df['Temperature'] = new_df['Temperature'].interpolate()
#
#     # Reordering columns
#     columns_order = ['Date', 'EnergyConsumption', 'Temperature'] + list(iv_columns) + temp_columns
#     new_df = new_df.rename(columns={meter_columns[0]: 'EnergyConsumption'})
#     new_df = new_df[columns_order]
#
#     # Handling nulls in 'Temperature'
#     df = replace_consecutive_nulls(new_df, 'Temperature', ['Temp2', 'Temp3'])
#
#     # Dropping records with zero or negative 'EnergyConsumption'
#     missing = df[df['EnergyConsumption'] < 1]
#     print(len(missing), 'Missing Length')
#     print(len(df), 'Before Dropping Negative and 0')
#     df = df[df['EnergyConsumption'] > 0]
#     print(len(df), 'After Dropping Negative and 0')
#
#     # Outlier detection and removal
#     outliers, lower_bound, upper_bound = detect_outliers_iqr(df, 'EnergyConsumption', factor=3)
#     df = df[(df['EnergyConsumption'] < upper_bound) & (df['EnergyConsumption'] > lower_bound)]
#     print(len(df), 'Dropping Outliers, Lower:{} Upper:{}'.format(lower_bound, upper_bound))
#
#     # Final column selection
#     output_df = df[['Date', 'EnergyConsumption', 'Temperature'] + list(iv_columns)]
#     output_df['Date'] = pd.to_datetime(output_df['Date']).dt.strftime('%Y-%m-%d %H:%M:%S')
#
#     return output_df.to_dict()


def clean_raw_data(dataframe, facility_id, meter_type):
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
    new_df.reset_index(inplace=True)
    new_df.rename(columns={'start_date': 'Date'}, inplace=True)

    # Sort the dataframe by start_date
    new_df.sort_values('Date', inplace=True)

    new_df['Temperature'] = new_df['Temp1']

    # new_df = new_df.rename(columns={meter_columns[0]: 'EnergyConsumption', 'start_date': 'Date'})

    def add_energy_columns(new_df, column_list, new_column_name):
        new_df[new_column_name] = new_df[column_list].sum(axis=1, skipna=True)

    # Specify the columns you want to sum

    # Call the function to add the energy columns
    add_energy_columns(new_df, meter_columns, 'EnergyConsumption')
    columns_order = ['Date', 'EnergyConsumption', 'Temperature']
    columns_order.extend(iv_columns)
    columns_order.extend(temp_columns)
    new_df = new_df[columns_order]

    # Apply the function
    df = replace_consecutive_nulls(new_df, 'Temperature', ['Temp2', 'Temp3'])

    new_df = df
    new_df['Temperature'] = new_df.Temperature.interpolate()
    output_columns = ['Date', 'EnergyConsumption', 'Temperature']
    output_columns.extend([i for i in iv_columns])
    new_df = new_df.drop(new_df[new_df['EnergyConsumption'] < 1].index)
    # Apply the function to the EnergyConsumption column
    outliers, lower_bound, upper_bound = detect_outliers_iqr_new(new_df, 'EnergyConsumption')
    #outliers, lower_bound, upper_bound = detect_outliers_iqr(new_df, 'EnergyConsumption', facility_id, meter_type)
    new_df = new_df[~new_df['Date'].isin(list(outliers.Date.values))]
    # new_df = new_df[(new_df['EnergyConsumption'] < upper_bound) & (new_df['EnergyConsumption'] > lower_bound)]
    output_col = ['Date', 'EnergyConsumption', 'Temperature']
    output_col.extend(iv_columns)
    output_df = new_df[output_col]
    output_df = output_df[output_df['EnergyConsumption'] > 0]
    output_df['Date'] = pd.to_datetime(output_df['Date']).dt.strftime('%Y-%m-%d %H:%M:%S')
    # output_df.reset_index(inplace=True)
    return output_df.to_dict()
