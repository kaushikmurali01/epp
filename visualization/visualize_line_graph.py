import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output
import pandas as pd
import plotly.express as px

# Load data
data = pd.read_excel('C:/Users/Akash Jain/Downloads/Untitled spreadsheet.xlsx')
data['Start Date'] = pd.to_datetime(data['Start Date (Required)'])

# Create separate dataframes for each scenario
data_true = data[data['Purchased From Grid'] == True].copy()
data_false = data[data['Purchased From Grid'] == False].copy()

# Calculate the total meter reading for each scenario (excluding datetime columns)
data_true_grouped = data_true.groupby('Start Date').agg({'Mean Meter Reading': 'sum'}).reset_index()
data_false_grouped = data_false.groupby('Start Date').agg({'Mean Meter Reading': 'sum'}).reset_index()
data_all_grouped = data.groupby('Start Date').agg({'Mean Meter Reading': 'sum'}).reset_index()

# Add a column to identify each scenario
data_true_grouped['Scenario'] = 'Grid Import'
data_false_grouped['Scenario'] = 'Generation'
data_all_grouped['Scenario'] = 'Facility Comsumption'

# Combine all dataframes into a single dataframe
combined_data = pd.concat([data_true_grouped, data_false_grouped, data_all_grouped])
app = dash.Dash(__name__)

app.layout = html.Div([
    dcc.DatePickerRange(
        id='date-picker-range',
        start_date=combined_data['Start Date'].min(),
        end_date=combined_data['Start Date'].max(),
    ),
    dcc.Graph(id='line-chart')
])

@app.callback(
    Output('line-chart', 'figure'),
    [Input('date-picker-range', 'start_date'),
     Input('date-picker-range', 'end_date')]
)
def update_line_chart(start_date, end_date):
    filtered_data = combined_data[(combined_data['Start Date'] >= start_date) & (combined_data['Start Date'] <= end_date)]
    fig = px.line(filtered_data, x='Start Date', y='Mean Meter Reading', color='Scenario', 
                  title='Energy Consumption Over Time')
    return fig
if __name__ == '__main__':
    app.run_server(debug=True)
