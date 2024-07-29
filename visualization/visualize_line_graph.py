from flask import Flask, jsonify, request, render_template_string
from datetime import timedelta
import pandas as pd
import plotly.graph_objs as go
import requests

from visualization.data_exploration import DataExplorationVisualisation


class DataVisualizer:
    def __init__(self, facility_id, meter_id):
        self.facility_id = facility_id
        self.meter_id = meter_id
        self.url = None
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
        fig.update_layout(
            xaxis=dict(
                rangeselector=dict(
                    buttons=list([
                        dict(count=7, label="7d", step="day", stepmode="backward"),
                        dict(count=1, label="1m", step="month", stepmode="backward"),
                        dict(count=6, label="6m", step="month", stepmode="backward"),
                        dict(count=1, label="YTD", step="year", stepmode="todate"),
                        dict(count=1, label="1y", step="year", stepmode="backward"),
                        dict(step="all")
                    ])
                ),
                rangeslider=dict(visible=True),
                type="date"
            )
        )
        combined_data = self.combined_data
        data_daily = self.data_daily
        data_weekly = self.data_weekly
        data_monthly = self.data_monthly

        fig.update_layout(
            updatemenus=[
                {
                    "buttons": [
                        {"label": "Line Chart", "method": "update", "args": [{"type": "scatter", "mode": "lines"}]},
                        {"label": "Dot Chart", "method": "update", "args": [{"type": "scatter", "mode": "markers"}]},
                    ],
                    "direction": "down",
                },
                {
                    "buttons": [
                        {"label": "Hourly", "method": "update",
                         "args": [{"x": [combined_data['date']], "y": [combined_data['value']]}]},
                        {"label": "Daily", "method": "update",
                         "args": [{"x": [data_daily['date']], "y": [data_daily['value']]}]},
                        {"label": "Weekly", "method": "update",
                         "args": [{"x": [data_weekly['date']], "y": [data_weekly['value']]}]},
                        {"label": "Monthly", "method": "update",
                         "args": [{"x": [data_monthly['date']], "y": [data_monthly['value']]}]},
                    ],
                    "direction": "down",
                },
                {
                    "buttons": [
                        {"label": "Last 7 Days", "method": "relayout", "args": [
                            {"xaxis.range": [combined_data['date'].max() - timedelta(days=7),
                                             combined_data['date'].max()]}]},
                        {"label": "Last 30 Days", "method": "relayout", "args": [
                            {"xaxis.range": [combined_data['date'].max() - timedelta(days=30),
                                             combined_data['date'].max()]}]},
                        {"label": "Last 1 Year", "method": "relayout", "args": [
                            {"xaxis.range": [combined_data['date'].max() - timedelta(days=365),
                                             combined_data['date'].max()]}]},
                    ],
                    "direction": "down",
                }
            ]
        )
        return fig
