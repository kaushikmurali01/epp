import pandas as pd
import numpy as np
import holidays
import json

class P4P_metrics_calculation:
    def __init__(self, df, non_routine_df, model_type, off_peak_incentive, on_peak_incentive, minimum_savings, meter_type):
        self.df = df
        self.non_routine_df = non_routine_df if non_routine_df is not None else pd.DataFrame()
        self.model_type = model_type
        self.off_peak_incentive = off_peak_incentive
        self.on_peak_incentive = on_peak_incentive
        self.minimum_savings = minimum_savings
        self.meter_type = meter_type  # New attribute for meter type
        self.ca_holidays = holidays.Canada(prov='ON')

    def setup_dataframe(self):
        self.df['Timestamp'] = pd.to_datetime(self.df['Timestamp'])
        self.df['residual'] = self.df['predicted'] - self.df['observed']
        self.df['Date'] = self.df['Timestamp'].dt.date
        self.df['DayOfWeek'] = self.df['Timestamp'].dt.dayofweek
        self.df['IsHoliday'] = self.df['Date'].apply(lambda x: x in self.ca_holidays)

    def filter_summer_months(self):
        return self.df[(self.df['Timestamp'].dt.month >= 6) & (self.df['Timestamp'].dt.month <= 8) &
                       (self.df['DayOfWeek'] < 5) & (~self.df['IsHoliday'])]

    def calculate_peak_hours(self, filtered_df):
        if self.model_type.lower() == 'hourly':
            filtered_df['Hour'] = filtered_df['Timestamp'].dt.hour
            peak_hours = filtered_df[(filtered_df['Hour'] >= 13) & (filtered_df['Hour'] < 19)]
            peak_demand = peak_hours['residual'].mean()
            on_peak_energy_savings = peak_hours['residual'].sum()
        elif self.model_type.lower() == 'daily':
            peak_demand = (filtered_df['residual'] * 6 / 24).mean()
            on_peak_energy_savings = (filtered_df['residual'] * 6 / 24).sum()
        return peak_demand, on_peak_energy_savings

    def calculate_energy_savings(self, filtered_df, peak_demand, on_peak_energy_savings):
        adjusted_baseline_energy_consumption = self.df['predicted'].sum()
        reporting_period_energy_consumption = self.df['observed'].sum()
        non_routine_adjustment = self.non_routine_df['consumption'].sum() if not self.non_routine_df.empty else 0
        total_energy_savings = adjusted_baseline_energy_consumption - reporting_period_energy_consumption + non_routine_adjustment

        if self.meter_type == 1:  # Electricity
            off_peak_energy_savings = total_energy_savings - on_peak_energy_savings
            off_peak_energy_savings_incentive = self.off_peak_incentive * off_peak_energy_savings
            on_peak_energy_savings_incentive = self.on_peak_incentive * on_peak_energy_savings
            energy_savings_percentage = 100 * total_energy_savings / adjusted_baseline_energy_consumption
            if energy_savings_percentage > self.minimum_savings:
                performance_incentive = on_peak_energy_savings_incentive + off_peak_energy_savings_incentive
            else:
                performance_incentive = 0

            return {
                'adjusted_baseline_energy_consumption': adjusted_baseline_energy_consumption,
                'reporting_period_energy_consumption': reporting_period_energy_consumption,
                'non_routine_adjustment': non_routine_adjustment,
                'total_energy_savings': total_energy_savings,
                'off_peak_energy_savings': off_peak_energy_savings,
                'on_peak_energy_savings': on_peak_energy_savings,
                'off_peak_energy_savings_incentive': off_peak_energy_savings_incentive,
                'on_peak_energy_savings_incentive': on_peak_energy_savings_incentive,
                'performance_incentive': performance_incentive,
                'peak_demand_savings': peak_demand,
                'energy_savings_percentage': energy_savings_percentage
            }
        else:  # Natural gas or water
            return {
                'adjusted_baseline_energy_consumption': adjusted_baseline_energy_consumption,
                'reporting_period_energy_consumption': reporting_period_energy_consumption,
                'non_routine_adjustment': non_routine_adjustment,
                'total_energy_savings': total_energy_savings,
                'energy_savings_percentage': 100 * total_energy_savings / adjusted_baseline_energy_consumption
            }

    def calculate_metrics(self):
        self.setup_dataframe()
        filtered_df = self.filter_summer_months()
        peak_demand, on_peak_energy_savings = self.calculate_peak_hours(filtered_df)
        metrics = self.calculate_energy_savings(filtered_df, peak_demand, on_peak_energy_savings)
        return metrics