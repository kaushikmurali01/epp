import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output
from datetime import timedelta
import pandas as pd
import plotly.express as px
import plotly.graph_objs as go
# Load data
# data = pd.read_excel('C:/Users/Akash Jain/Downloads/Untitled spreadsheet.xlsx')

import requests
import json
import pandas as pd

# Define the URL
url = 'https://ams-enerva-dev.azure-api.net/v1/summary_visualisation?facility_id=336'

# Send the request and get the response
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Convert the JSON response to a dictionary
    df = response.json()
    
    # Convert the dictionary to a DataFrame
    data = pd.DataFrame(df)
    
    # Display the DataFrame
    print(data)
else:
    print(f"Request failed with status code: {response.status_code}")
data['Start Date'] = pd.to_datetime(data['start_date'])

# Create separate dataframes for each scenario
data_true = data[data['purchased_from_grid'] == True].copy()
data_false = data[data['purchased_from_grid'] == False].copy()

# Aggregate the data by 'Start Date'
data_true_grouped = data_true.groupby('Start Date').agg({'reading': 'sum'}).reset_index()
data_false_grouped = data_false.groupby('Start Date').agg({'reading': 'sum'}).reset_index()
data_all_grouped = data.groupby('Start Date').agg({'reading': 'sum'}).reset_index()

# Add a column to identify each scenario
data_true_grouped['Scenario'] = 'Purchased From Grid: True'
data_false_grouped['Scenario'] = 'Purchased From Grid: False'
data_all_grouped['Scenario'] = 'All'

# Combine all dataframes into a single dataframe
combined_data = pd.concat([data_true_grouped, data_false_grouped, data_all_grouped])

# Rename columns for ease of use
combined_data.rename(columns={'Start Date': 'date', 'reading': 'value'}, inplace=True)

# Function to resample data
def resample_data(df, frequency):
    # Convert 'date' column to datetime if it isn't already
    df['date'] = pd.to_datetime(df['date'])
    
    # Set 'date' as index
    df = df.set_index('date')
    
    # Select only numeric columns for resampling
    numeric_df = df.select_dtypes(include='number')
    
    # Resample based on frequency
    if frequency == 'M':
        resampled_df = numeric_df.resample('M').mean().reset_index()
    elif frequency == 'W':
        resampled_df = numeric_df.resample('W').mean().reset_index()
    elif frequency == 'D':
        resampled_df = numeric_df.resample('D').mean().reset_index()
    else:
        resampled_df = df.reset_index()  # hourly

    return resampled_df


# Resample data initially to prevent recalculations
data_daily = resample_data(combined_data, 'D')
data_weekly = resample_data(combined_data, 'W')
data_monthly = resample_data(combined_data, 'M')

app = dash.Dash(__name__)
fig = go.Figure()
app.layout = html.Div([
    dcc.DatePickerRange(
        id='date-picker-range',
        start_date=combined_data['date'].min(),
        end_date=combined_data['date'].max(),
    ),
    dcc.Graph(id='line-chart')
])


# Dropdown for parameters
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
                {"label": "Hourly", "method": "update", "args": [{"x": [combined_data['date']], "y": [combined_data['value']]}]},
                {"label": "Daily", "method": "update", "args": [{"x": [data_daily['date']], "y": [data_daily['value']]}]},
                {"label": "Weekly", "method": "update", "args": [{"x": [data_weekly['date']], "y": [data_weekly['value']]}]},
                {"label": "Monthly", "method": "update", "args": [{"x": [data_monthly['date']], "y": [data_monthly['value']]}]},
            ],
            "direction": "down",
        },
        {
            "buttons": [
                {"label": "Last 7 Days", "method": "relayout", "args": [{"xaxis.range": [combined_data['date'].max() - timedelta(days=7), combined_data['date'].max()]}]},
                {"label": "Last 30 Days", "method": "relayout", "args": [{"xaxis.range": [combined_data['date'].max() - timedelta(days=30), combined_data['date'].max()]}]},
                {"label": "Last 1 Year", "method": "relayout", "args": [{"xaxis.range": [combined_data['date'].max() - timedelta(days=365), combined_data['date'].max()]}]},
            ],
            "direction": "down",
        }
    ]
)

# Add range slider
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


@app.callback(
    Output('line-chart', 'figure'),
    [Input('date-picker-range', 'start_date'),
     Input('date-picker-range', 'end_date')]
)
def update_line_chart(start_date, end_date):
    filtered_data = combined_data[(combined_data['date'] >= start_date) & (combined_data['date'] <= end_date)]
    for scenario in combined_data['Scenario'].unique():
        scenario_data = combined_data[combined_data['Scenario'] == scenario]
        fig.add_trace(go.Scatter(x=scenario_data['date'], y=scenario_data['value'], mode='lines', name=scenario))
    return fig

if __name__ == '__main__':
    app.run_server(debug=True, port = 5005)
