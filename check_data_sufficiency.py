import pandas as pd


def check_data_sufficiency(df, required_columns, granularity):
    if not pd.api.types.is_datetime64_any_dtype(df['Date']):
        df['Date'] = pd.to_datetime(df['Date'])

    def calculate_sufficiency(df, required_columns, expected_rows):
        if expected_rows == 0:
            return None

        df = df[df['EnergyConsumption'] > 0]
        sufficient_rows = df.dropna(subset=required_columns).shape[0]
        sufficiency = (sufficient_rows / expected_rows) * 100
        return sufficiency

    sufficiency_results = {}

    if granularity == 'hourly':
        unique_dates = df['Date'].dt.floor('d').unique()
        num_days = len(unique_dates)
        expected_rows_hourly = 24 * num_days
        sufficiency_results['hourly'] = calculate_sufficiency(df, required_columns, expected_rows_hourly)

        daily_df = df.groupby(df['Date'].dt.date).first()
        expected_rows_daily = num_days
        sufficiency_results['daily'] = calculate_sufficiency(daily_df, required_columns, expected_rows_daily)

        unique_months = df['Date'].dt.to_period('M').unique()
        monthly_df = df.groupby(df['Date'].dt.to_period('M')).first()
        expected_rows_monthly = len(unique_months)
        sufficiency_results['monthly'] = calculate_sufficiency(monthly_df, required_columns, expected_rows_monthly)

    elif granularity == 'daily':
        unique_dates = df['Date'].dt.floor('d').unique()
        expected_rows = len(unique_dates)
        sufficiency_results['daily'] = calculate_sufficiency(df, required_columns, expected_rows)

        unique_months = df['Date'].dt.to_period('M').unique()
        monthly_df = df.groupby(df['Date'].dt.to_period('M')).first()
        expected_rows_monthly = len(unique_months)
        sufficiency_results['monthly'] = calculate_sufficiency(monthly_df, required_columns, expected_rows_monthly)

    elif granularity == 'monthly':
        unique_months = df['Date'].dt.to_period('M').unique()
        expected_rows = len(unique_months)
        sufficiency_results['monthly'] = calculate_sufficiency(df, required_columns, expected_rows)

    else:
        raise ValueError("Invalid granularity. Must be 'hourly', 'daily', or 'monthly'.")

    return sufficiency_results
