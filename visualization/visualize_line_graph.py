# from flask import Flask, jsonify, request, render_template_string
# from datetime import timedelta
# import pandas as pd
# import plotly.graph_objs as go
# import requests
#
#
# # Define the URL
# url = 'https://ams-enerva-dev.azure-api.net/v1/summary_visualisation?facility_id=336'
#
# # Send the request and get the response
# response = requests.get(url)
#
# # Check if the request was successful
# if response.status_code == 200:
#     # Convert the JSON response to a dictionary
#     df = response.json()
#
#     # Convert the dictionary to a DataFrame
#     data = pd.DataFrame(df)
#
#     # Display the DataFrame
#     print(data)
# else:
#     print(f"Request failed with status code: {response.status_code}")
#
# data['Start Date'] = pd.to_datetime(data['start_date'])
#
# # Create separate dataframes for each scenario
# data_true = data[data['purchased_from_grid'] == True].copy()
# data_false = data[data['purchased_from_grid'] == False].copy()
#
# # Aggregate the data by 'Start Date'
# data_true_grouped = data_true.groupby('Start Date').agg({'reading': 'sum'}).reset_index()
# data_false_grouped = data_false.groupby('Start Date').agg({'reading': 'sum'}).reset_index()
# data_all_grouped = data.groupby('Start Date').agg({'reading': 'sum'}).reset_index()
#
# # Add a column to identify each scenario
# data_true_grouped['Scenario'] = 'Purchased From Grid: True'
# data_false_grouped['Scenario'] = 'Purchased From Grid: False'
# data_all_grouped['Scenario'] = 'All'
#
# # Combine all dataframes into a single dataframe
# combined_data = pd.concat([data_true_grouped, data_false_grouped, data_all_grouped])
#
# # Rename columns for ease of use
# combined_data.rename(columns={'Start Date': 'date', 'reading': 'value'}, inplace=True)
#
#
# # Function to resample data
# def resample_data(df, frequency):
#     # Convert 'date' column to datetime if it isn't already
#     df['date'] = pd.to_datetime(df['date'])
#
#     # Set 'date' as index
#     df = df.set_index('date')
#
#     # Select only numeric columns for resampling
#     numeric_df = df.select_dtypes(include='number')
#
#     # Resample based on frequency
#     if frequency == 'M':
#         resampled_df = numeric_df.resample('M').mean().reset_index()
#     elif frequency == 'W':
#         resampled_df = numeric_df.resample('W').mean().reset_index()
#     elif frequency == 'D':
#         resampled_df = numeric_df.resample('D').mean().reset_index()
#     else:
#         resampled_df = df.reset_index()  # hourly
#
#     return resampled_df
#
#
# # Resample data initially to prevent recalculations
# data_daily = resample_data(combined_data, 'D')
# data_weekly = resample_data(combined_data, 'W')
# data_monthly = resample_data(combined_data, 'M')


from flask import Flask, jsonify, request, render_template_string
from datetime import timedelta
import pandas as pd
import plotly.graph_objs as go
import requests

from visualization.data_exploration import DataExplorationVisualisation


class DataVisualizer:
    def __init__(self, url, facility_id, meter_id):
        self.facility_id = facility_id
        self.meter_id = meter_id
        self.url = url
        self.data = self.fetch_data()
        self.combined_data = self.process_data()
        self.data_daily = self.resample_data(self.combined_data, 'D')
        self.data_weekly = self.resample_data(self.combined_data, 'W')
        self.data_monthly = self.resample_data(self.combined_data, 'M')

    def fetch_data(self):
        visualisation = DataExplorationVisualisation(self.facility_id)
        response = visualisation.fetch_data()
        if response:
            return pd.DataFrame(response)
        else:
            print(f"Request failed with status code: {response.status_code}")
            return pd.DataFrame()

    def process_data(self):
        self.data['Start Date'] = pd.to_datetime(self.data['start_date'])

        data_true = self.data[self.data['purchased_from_grid'] == True].copy()
        data_false = self.data[self.data['purchased_from_grid'] == False].copy()

        data_true_grouped = data_true.groupby('Start Date').agg({'reading': 'sum'}).reset_index()
        data_false_grouped = data_false.groupby('Start Date').agg({'reading': 'sum'}).reset_index()
        data_all_grouped = self.data.groupby('Start Date').agg({'reading': 'sum'}).reset_index()

        data_true_grouped['Scenario'] = 'Purchased From Grid: True'
        data_false_grouped['Scenario'] = 'Purchased From Grid: False'
        data_all_grouped['Scenario'] = 'All'

        combined_data = pd.concat([data_true_grouped, data_false_grouped, data_all_grouped])
        combined_data.rename(columns={'Start Date': 'date', 'reading': 'value'}, inplace=True)

        return combined_data

    def resample_data(self, df, frequency):
        df['date'] = pd.to_datetime(df['date'])
        df = df.set_index('date')
        numeric_df = df.select_dtypes(include='number')

        if frequency == 'M':
            resampled_df = numeric_df.resample('M').mean().reset_index()
        elif frequency == 'W':
            resampled_df = numeric_df.resample('W').mean().reset_index()
        elif frequency == 'D':
            resampled_df = numeric_df.resample('D').mean().reset_index()
        else:
            resampled_df = df.reset_index()

        return resampled_df

    def get_filtered_data(self, start_date, end_date):
        return self.combined_data[(self.combined_data['date'] >= start_date) & (self.combined_data['date'] <= end_date)]

    def generate_figure(self, filtered_data):
        fig = go.Figure()
        for scenario in filtered_data['Scenario'].unique():
            scenario_data = filtered_data[filtered_data['Scenario'] == scenario]
            fig.add_trace(go.Scatter(x=scenario_data['date'], y=scenario_data['value'], mode='lines', name=scenario))
        return fig
