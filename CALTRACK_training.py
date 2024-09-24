import os
import io
import pickle
import gc
import pandas as pd
import numpy as np
import pytz
import json
import holidays
from eemeter import eemeter as em
from eemeter.eemeter.models.hourly.metrics import ModelMetrics
from eemeter.eemeter.models.hourly.segmentation import iterate_segmented_dataset, segment_time_series
from eemeter.eemeter.models.hourly.design_matrices import create_caltrack_hourly_segmented_design_matrices, create_caltrack_hourly_preliminary_design_matrix
from eemeter.eemeter.models.hourly.model import caltrack_hourly_prediction_feature_processor
import sklearn.linear_model as lr
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt
from eemeter.eemeter.models.daily.data import DailyBaselineData
from eemeter.eemeter.models.daily import DailyModel
from scipy import stats
from statsmodels.stats.stattools import durbin_watson
from statsmodels.regression.linear_model import OLS
from statsmodels.tools import add_constant
import statsmodels.api as sm

def generate_dataframes_from_master(date_periods, master_data):
    # Convert the start and end times to datetime
    master_data['Timestamp'] = pd.to_datetime(master_data['Timestamp'])
    
    # Update start and end times in date_periods to datetime
    for period in date_periods:
        date_periods[period]['start'] = pd.to_datetime(date_periods[period]['start'])
        date_periods[period]['end'] = pd.to_datetime(date_periods[period]['end'])
    
    # Extract data for each period dynamically
    period_dataframes = {}
    for period in date_periods:
        period_data = master_data[(master_data['Timestamp'] >= date_periods[period]['start']) & 
                                  (master_data['Timestamp'] <= date_periods[period]['end'])]
        period_dataframes[period] = period_data

    return period_dataframes

class EnergyModel:
    def __init__(self, timezone='US/Eastern'):
        self.timezone = pytz.timezone(timezone)
            
    # Function to convert string values to float
    def convert_strings_to_floats(self,df, column_name):
        def convert(value):
            try:
                if isinstance(value, str):
                    return float(value)
                return value
            except ValueError:
                return value  # or handle the error as needed
    
        df[column_name] = df[column_name].apply(convert)
        return df
        
    def load_process_data(self,data_path):
        self.data_path = data_path
        if isinstance(self.data_path, str):
            df = pd.read_excel(self.data_path)
        else:
            df = self.data_path
        # Define the EST and UTC time zones
        est_timezone = pytz.timezone('US/Eastern')
        utc_timezone = pytz.utc
        est_offset = pytz.FixedOffset(-300)  # UTC-5:00
        # Convert 'Timestamp' column to datetime objects
        df['Timestamp'] = pd.to_datetime(df['Timestamp'], format='mixed')
        
        # Localize the Timestamp to EST
        try:
            df['Timestamp'] = df['Timestamp'].apply(lambda x: est_offset.localize(x))
        except:
            pass

        # OAT column identification and data preparation
        filtered_df = df
        oat_col = next(col for col in filtered_df.columns if 'OAT' in col)
        
        # Rename columns and convert temperatures
        filtered_df = filtered_df.rename(columns={
            'Timestamp': 'Timestamp',
            'Energy Use': 'observed',
            oat_col: 'temperature'
        })
        filtered_df = self.convert_strings_to_floats(filtered_df, "temperature")
        
        filtered_df['temperature'] = filtered_df['temperature'] * 9 / 5 + 32
        
        # Set the DataFrame index
        filtered_df.set_index('Timestamp', inplace=True)
        print("pre dropna: ", filtered_df.shape)
        # Clean up the DataFrame
        filtered_df.dropna(inplace=True)
        print("post dropna: ", filtered_df.shape)
        
        # Define columns to keep
        columns_to_keep = ['Timestamp', 'observed', 'temperature']
        self.keep_columns_set = set(columns_to_keep)
        
        self.data_to_process = filtered_df.copy()

    def is_holiday(self,holiday_flag = False):
        if holiday_flag == True:
            # Define the holidays in Canada
            canada_holidays = holidays.Canada(prov='ON')
            
            dates_range = pd.date_range(start=self.data_to_process.index.min(), 
                                        end=self.data_to_process.index.max()).tz_localize(None)
            holidays_in_range = [date for date in dates_range if date in canada_holidays]
            holidays_in_range = np.array([ts.to_datetime64() for ts in holidays_in_range], dtype='datetime64[ns]')
            
            self.data_to_process["is_holiday"] = pd.DataFrame(np.isin(self.data_to_process.index.date.astype("datetime64[ns]"), holidays_in_range.astype("datetime64[ns]")).astype(np.int8), index=self.data_to_process.index)
            self.independent_variables.extend(['is_holiday'])
            
    def extract_timestamp_features(self, dummy_vars):
        # print(dummy_vars)
        # Convert the timestamp column to datetime if it is not already
        data = self.data_to_process.copy()
        data.index = pd.to_datetime(data.index)
    
        if 'Hours' in dummy_vars:
            data['Hours'] = data.index.hour
        if 'Months' in dummy_vars:
            data['Months'] = data.index.month
        if 'Years' in dummy_vars:
            data['Years'] = data.index.year
        if 'Weeks' in dummy_vars:
            data['Weeks'] = data.index.isocalendar().week
        if 'Dates' in dummy_vars:
            data['Dates'] = data.index.date
        if 'Weekdays' in dummy_vars:
            data['Weekdays'] = data.index.weekday
        if 'Weekdays_hours' in dummy_vars:
            data['Weekdays_hours'] = data.index.weekday * 24 + data.index.hour
        # display(data)
        self.data_to_process = data.copy()

    def create_dummies(self, column_names):
        new_dummy_vars = []
        for column_name in column_names:
            unique_values = self.data_to_process[column_name].dropna().unique()
            if len(unique_values) == 2:
                # Assume the column is already binary
                self.data_to_process[column_name] = pd.Categorical(self.data_to_process[column_name]).codes
                new_dummy_vars.extend([column_name])
                # self.independent_variables.extend(dummies.columns.tolist())
                # print(f"Column '{column_name}' is binary. Coded to 0 and 1.")
            else:
                # Create dummy variables if not binary
                dummies = pd.get_dummies(self.data_to_process[column_name], prefix=column_name, drop_first=True)
                new_dummy_vars.extend(dummies.columns.tolist())
                self.data_to_process = pd.concat([self.data_to_process, dummies], axis=1)
                self.data_to_process.drop(column_name, axis=1, inplace=True)
                # print(f"Created dummy variables for '{column_name}' and original column dropped.")
        
        self.independent_variables.extend(new_dummy_vars)
     
    def indep_vars_processing(self,columns_to_remove = [],additional_indep_cat_vars = [],additional_indep_cont_vars = [],additional_dummy_vars = [], holiday_flag = False):
        self.independent_variables = []
        #Columns to remove
        if len(columns_to_remove) != 0:
            self.data_to_process = self.data_to_process.drop(columns_to_remove,axis = 1)
        #Add More Independent variables
        #adding holiday variable (CANADA)
        all_columns = set(self.data_to_process.columns)
        # self.other_columns = list(all_columns - self.keep_columns_set)
        self.is_holiday(holiday_flag = holiday_flag)
        # additional independent variables if categorical
        self.extract_timestamp_features(additional_dummy_vars)
        self.create_dummies(additional_indep_cat_vars + additional_dummy_vars)
        self.independent_variables.extend(additional_indep_cont_vars)

        return self.data_to_process
        
    def feature_engineering_eemeter_hourly_model(self,baseline_data,segment_type):
        self.segment_type = segment_type
        self.training_data = baseline_data
        print(self.training_data.head())
        # Fit the baseline model
        baseline_data_hourly = em.HourlyBaselineData(self.training_data[['observed', 'temperature']], is_electricity_data=True)
        self.baseline_data_hourly = baseline_data_hourly
        self.baseline_segmented_model_hourly = em.HourlyModel(settings={'segment_type': segment_type}).fit(baseline_data_hourly)
        
        design_matrix = create_caltrack_hourly_preliminary_design_matrix(
        self.training_data['observed'].to_frame("value").asfreq('h'), self.training_data['temperature'].asfreq('h'))
        # print('Posting fitting baseline..')
        # print(self.training_data)
        self.prediction_segment_name_mapping = {
                    "single": None,
            "three_month_weighted": {
                "jan": "dec-jan-feb-weighted",
                "feb": "jan-feb-mar-weighted",
                "mar": "feb-mar-apr-weighted",
                "apr": "mar-apr-may-weighted",
                "may": "apr-may-jun-weighted",
                "jun": "may-jun-jul-weighted",
                "jul": "jun-jul-aug-weighted",
                "aug": "jul-aug-sep-weighted",
                "sep": "aug-sep-oct-weighted",
                "oct": "sep-oct-nov-weighted",
                "nov": "oct-nov-dec-weighted",
                "dec": "nov-dec-jan-weighted",
                "holiday": "holiday",
            },
        
        }[self.segment_type]
        
        self.segmented_design_matrices = create_caltrack_hourly_segmented_design_matrices(
            design_matrix,
            segment_time_series(design_matrix.index, self.segment_type),
            self.baseline_segmented_model_hourly.model_process_variables.occupancy_lookup,
            self.baseline_segmented_model_hourly.model_process_variables.occupied_temperature_bins,
            self.baseline_segmented_model_hourly.model_process_variables.unoccupied_temperature_bins,
        )
 
    def create_iterator(self,scoring_data):
        prediction_segment_type = {
            "single": "single",
            "three_month_weighted": "one_month",
        }[self.segment_type]
        prediction_segmentation = segment_time_series(scoring_data.asfreq('h').index, prediction_segment_type, drop_zero_weight_segments=True)
        self.prediction_segmentation = prediction_segmentation
        return iterate_segmented_dataset(
            scoring_data['temperature'].to_frame("temperature_mean").asfreq('h'),
            segmentation=prediction_segmentation,
            feature_processor=caltrack_hourly_prediction_feature_processor,
            feature_processor_kwargs={
                "occupancy_lookup": self.baseline_segmented_model_hourly.model_process_variables.occupancy_lookup,
                "occupied_temperature_bins": self.baseline_segmented_model_hourly.model_process_variables.occupied_temperature_bins,
                "unoccupied_temperature_bins": self.baseline_segmented_model_hourly.model_process_variables.unoccupied_temperature_bins,
            },
            feature_processor_segment_name_mapping=self.prediction_segment_name_mapping,
        )
    
           
    def training_hourly_model(self):
        self.model_segment_name_mapping = {
            'single': {"all": "all"},
            "three_month_weighted": {
                "dec-jan-feb-weighted": "jan",
                "jan-feb-mar-weighted": 'feb',
                "feb-mar-apr-weighted": 'mar',
                "mar-apr-may-weighted": 'apr',
                "apr-may-jun-weighted": 'may',
                "may-jun-jul-weighted": 'jun',
                "jun-jul-aug-weighted": 'jul',
                "jul-aug-sep-weighted": 'aug',
                "aug-sep-oct-weighted": 'sep',
                "sep-oct-nov-weighted": 'oct',
                "oct-nov-dec-weighted": 'nov',
                "nov-dec-jan-weighted": 'dec',
            },
        
        }[self.segment_type]
        
        weight=pd.DataFrame()
        self.model={}
        self.feature_coefficients={}
        self.intercept={}
        self.regression_formula={}
        for segment_name, segmented_data in self.segmented_design_matrices.items():
            segmented_data = segmented_data.dropna()
            X = segmented_data.join(pd.get_dummies(segmented_data['hour_of_week'], prefix="weekday_hour", drop_first=True).astype(int)).drop(columns={'hour_of_week'})
            X = X.join(self.training_data[self.independent_variables]) # additional independent variable
            self.X =  X
            if X["weight"].sum() == 0:
                weight = None
            else:
                weight = X["weight"]
            X.drop(columns={'weight', 'meter_value'}, inplace=True)
            model_en = lr.LinearRegression(n_jobs=-1)
            model_en.fit(X=X, y=self.training_data['observed'].iloc[:-1], sample_weight=weight)
            self.model[self.model_segment_name_mapping[segment_name]] = model_en
            self.feature_coefficients[self.model_segment_name_mapping[segment_name]] = list(zip(self.model[self.model_segment_name_mapping[segment_name]].feature_names_in_, self.model[self.model_segment_name_mapping[segment_name]].coef_))
            self.intercept[self.model_segment_name_mapping[segment_name]] = self.model[self.model_segment_name_mapping[segment_name]].intercept_
            self.regression_formula[self.model_segment_name_mapping[segment_name]] = f"{self.intercept[self.model_segment_name_mapping[segment_name]]:+.4f} " + " + ".join(
                [f"{coef:+.4f} * {feat}" for feat, coef in self.feature_coefficients[self.model_segment_name_mapping[segment_name]]])
            
    def scoring_hourly_model(self,scoring_data):
        # Prediction logic...
        iterator = self.create_iterator(scoring_data[['observed', 'temperature']].copy())
        predictions = {}
        for segment_name, segmented_data in iterator:
            segmented_data = segmented_data.dropna()
            # print(segmented_data.shape)
            X = segmented_data.join(pd.get_dummies(segmented_data['hour_of_week'], prefix="weekday_hour", drop_first=True).astype(int)).drop(columns={'hour_of_week'})
            # self.X = X.copy()
            X = X.join(scoring_data[self.independent_variables])
            X.drop(columns=["weight"], inplace=True)
            self.X_test = X
            try:
                EN_predict=self.model[segment_name].predict(X) * segmented_data.weight
                EN_predict = EN_predict[segmented_data.weight > 0].reindex(scoring_data.index)
                predictions[segment_name] = EN_predict
               
            except Exception as e:
                print(f"Baseline model doesn't have a regression for {segment_name}. Error: {e}")
        
        predictions = pd.DataFrame(predictions)
        scoring_data['predicted'] = pd.DataFrame({"predicted": predictions.sum(axis=1, min_count=1)})
        return scoring_data
 
    def training_daily_model(self, processed_baseline_data, ignore_disqualification=False):
        # Check if resampling is needed for baseline data
        if processed_baseline_data.index.freqstr != 'D':
            daily_grouped_baseline = processed_baseline_data.resample('D').agg({'temperature': 'mean', 'observed': 'sum'})
        else:
            daily_grouped_baseline = processed_baseline_data
    
        # Setting up the daily model for baseline data
        baseline_data_daily = DailyBaselineData(daily_grouped_baseline, is_electricity_data=True)
        self.model_daily = DailyModel(settings={
            'is_weekday': {1: True, 2: True, 3: True, 4: True, 5: True, 6: False, 7: False},
            'season': {1: 'winter', 2: 'winter', 3: 'shoulder', 4: 'shoulder', 5: 'shoulder',
                       6: 'summer', 7: 'summer', 8: 'summer', 9: 'summer', 10: 'shoulder',
                       11: 'winter', 12: 'winter'}
        })
    
        # Fitting the model on the baseline data
        self.baseline_model_daily = self.model_daily.fit(baseline_data_daily, ignore_disqualification=ignore_disqualification)
        baseline_predictions = self.baseline_model_daily.predict(baseline_data_daily, ignore_disqualification=ignore_disqualification)
    
        # Adding temperature in Celsius and calculating residuals
        baseline_predictions['temperature'] = (baseline_predictions['temperature'] - 32) * 5/9
        baseline_predictions['residual'] = baseline_predictions['predicted'] - baseline_predictions['observed']
        # self.result = result
        # Linear regression on the daily aggregated data
        if len(self.independent_variables) != 0:
            # Preparing data for regression
            if processed_baseline_data.index.freqstr != 'D':
                X_train = processed_baseline_data[self.independent_variables].resample('D').agg('mean')
            else:
                X_train = processed_baseline_data[self.independent_variables]
            y = baseline_predictions['Residual']
            self.linear_model = lr.LinearRegression(n_jobs=-1)
            self.linear_model.fit(X_train, y)
            
            # Storing coefficients and predictions
            baseline_predictions['predicted'] = self.linear_model.predict(X_train) + baseline_predictions['predicted']
            baseline_predictions['residual'] = baseline_predictions['predicted'] - baseline_predictions['observed']
            # self.linear_model_coefficients = self.linear_model.coef_
        else:
            print("independent variables are missing from the DataFrame.")
            # self.processed_daily_data['predicted'] = result['predicted']
    
        self.baseline_predictions = baseline_predictions.copy() #optional
        
    def scoring_daily_model(self, processed_reporting_data, ignore_disqualification=False):
        # Check if resampling is needed for reporting data
        if processed_reporting_data.index.freqstr != 'D':
            daily_grouped_reporting = processed_reporting_data.resample('D').agg({'temperature': 'mean', 'observed': 'sum'})
        else:
            daily_grouped_reporting = processed_reporting_data

        # Using the model fitted on baseline data to predict on reporting data
        reporting_data_daily = DailyBaselineData(daily_grouped_reporting, is_electricity_data=True)
        reporting_predictions = self.baseline_model_daily.predict(reporting_data_daily, ignore_disqualification=ignore_disqualification)

        # Adding temperature in Celsius and calculating residuals for reporting data
        reporting_predictions['temperature'] = (reporting_predictions['temperature'] - 32) * 5 / 9
        reporting_predictions['Residual'] = reporting_predictions['observed'] - reporting_predictions['predicted']

        # Linear regression on the daily aggregated reporting data if the linear model and independent variables exist
        if hasattr(self, 'linear_model') and self.independent_variables:
            # Ensure independent variables exist in the processed reporting data
            missing_variables = [var for var in self.independent_variables if var not in processed_reporting_data.columns]
            if missing_variables:
                print(f"Missing independent variables: {missing_variables}. Skipping linear model predictions.")
            else:
                # Check if resampling is needed for independent variables
                if processed_reporting_data.index.freqstr != 'D':
                    X_scoring = processed_reporting_data[self.independent_variables].resample('D').agg('mean')
                else:
                    X_scoring = processed_reporting_data[self.independent_variables]
                
                # Predicting adjusted values using the linear model
                reporting_predictions['predicted'] = self.linear_model.predict(X_scoring) + reporting_predictions['predicted']
                reporting_predictions['Residual'] = reporting_predictions['observed'] - reporting_predictions['predicted']
        else:
            if not hasattr(self, 'linear_model'):
                print("Linear model is not available. Skipping linear model predictions.")
            if not self.independent_variables:
                print("No independent variables defined. Skipping linear model predictions.")
        
        print(reporting_predictions.head())
        # self.reporting_predictions = reporting_predictions.copy()
        return reporting_predictions
    
    def evaluate(self, scoring_data):
        # Evaluation metrics
        eval_data = scoring_data.copy().dropna()
        y_true = eval_data['observed']
        y_pred = eval_data['predicted']  # Assuming 'predicted' is a column in self.data

        # Basic metrics
        mse = mean_squared_error(y_true, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_true, y_pred)

        # Number of observations and features
        n = len(y_true)
        p = eval_data.drop(['observed', 'predicted'], axis=1, errors='ignore').shape[1]  # Number of features

        # Adjusted R-squared
        adj_r2 = 1 - ((1 - r2) * (n - 1) / (n - p - 1))

        # Mean Absolute Percentage Error (MAPE)
        mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100

        # Coefficient of variation of RMSE
        cv_rmse = (rmse / np.mean(y_true)) * 100

        # Autocorrelation function
        residuals = y_true - y_pred
        autocorr = np.corrcoef(np.array([residuals[:-1], residuals[1:]]))[0, 1]

        # Durbin-Watson statistic
        dw_stat = durbin_watson(residuals)

        # Normalized Mean Bias Error (NMBE)
        nmbe = (np.sum(y_true - y_pred) / (n * np.mean(y_true))) * 100

        # Prepare output
        results = {
            "Number of observations": n,
            "Coefficient of Determination, R2": f"{round(100 * r2, 2):.2f}%",
            "Adjusted R2": f"{round(100 * adj_r2, 2):.2f}%",
            "Root-mean-square error, RMSE R2": round(rmse, 2),
            "Coefficient of variation of RMSE": f"{round(cv_rmse, 2):.2f}%",
            "Mean Absolute Percentage Error (MAPE)": f"{round(mape, 2):.2f}%",
            "Auto correlation function": round(autocorr, 2),
            "Durbin-Watson (P>0)": round(dw_stat, 2),
            "Normalized Mean Bias Error (NMBE)": f"{round(nmbe, 2):.2f}%"
        }

        # Optionally return results
        return results
    def compute_baseline_peak_demand(self,baseline_data,model_type):
        df = baseline_data.copy()[['observed']].reset_index()
        ca_holidays = holidays.Canada(prov='ON')
        df['Timestamp'] = pd.to_datetime(df['Timestamp'])
        df['Date'] = df['Timestamp'].dt.date
        df['DayOfWeek'] = df['Timestamp'].dt.dayofweek
        df['Is_Holiday'] = df['Date'].apply(lambda x: x in ca_holidays)
        filtered_df = df[(df['Timestamp'].dt.month >= 6) & (df['Timestamp'].dt.month <= 8) &
                       (df['DayOfWeek'] < 5) & (~df['Is_Holiday'])].copy()
        if model_type.lower() == 'hourly':
            filtered_df.loc[:, 'Hour'] = filtered_df['Timestamp'].dt.hour
            peak_hours = filtered_df[(filtered_df['Hour'] >= 13) & (filtered_df['Hour'] < 19)]
            peak_demand = peak_hours['observed'].mean()
        elif model_type.lower() == 'daily':
            peak_demand = (filtered_df['observed'] * 6 / 24).mean()
        return peak_demand
        
    def get_readable_date(self,timestamp):
        # To include the ordinal suffix (st, nd, rd, th)
        day = timestamp.day
        if 4 <= day <= 20 or 24 <= day <= 30:
            suffix = "th"
        else:
            suffix = ["st", "nd", "rd"][day % 10 - 1]
        
        readable_date = f"{day}{suffix} {timestamp.strftime('%B %Y')}"
        return readable_date

    def get_baseline_summary(self, baseline_data, model_type, meter_type):
        if model_type.lower() == 'hourly':
            # Hourly Data: Ensure the baseline data is compared against 8760 hours
            total_expected_hours = 8760  # Expected hours for a full year
            total_available_hours = baseline_data.shape[0]
            
            if total_available_hours < total_expected_hours:
                baseline_data['Month'] = baseline_data.index.month
                # print(baseline_data['Month'].max())
                missing_hours = {month: 730 - baseline_data[baseline_data['Month'] == month].shape[0] 
                                for month in range(1, baseline_data['Month'].max()+1)}
                missing_hours = {month: hours for month, hours in missing_hours.items() if hours > 0}
                # print(missing_hours)
                avg_consumption_per_month = {
                    month: baseline_data[baseline_data['Month'] == month]['observed'].mean()
                    for month in missing_hours.keys()
                }
                # print(avg_consumption_per_month)
                extrapolated_energy = sum(
                    missing_hours[month] * avg_consumption_per_month[month]
                    for month in missing_hours.keys()
                )
            else:
                extrapolated_energy = 0
            # print('---------******************')
            # print(baseline_data['observed'].sum())
            # print(extrapolated_energy)
            baseline_energy_consumption_value = baseline_data['observed'].sum() + extrapolated_energy

        elif model_type.lower() == 'daily':
            # Daily Data: Compare against 365 days
            total_expected_days = 365  # Expected days for a full year
            total_available_days = baseline_data.shape[0]

            if total_available_days < total_expected_days:
                # Get the missing days per month
                baseline_data['Month'] = baseline_data.index.month
                missing_days = {month: 30 - baseline_data[baseline_data['Month'] == month].shape[0] 
                                for month in range(1, baseline_data['Month'].max()+1)}  # Rough estimate: 30 days per month
                
                # Only consider months with missing days
                missing_days = {month: days for month, days in missing_days.items() if days > 0}
                
                # Calculate average consumption for missing months
                avg_consumption_per_month = {
                    month: baseline_data[baseline_data['Month'] == month]['observed'].mean()
                    for month in missing_days.keys()
                }
                
                # Extrapolate the energy consumption for missing days
                extrapolated_energy = sum(
                    missing_days[month] * avg_consumption_per_month[month]
                    for month in missing_days.keys()
                )
            else:
                extrapolated_energy = 0  # No missing days

            # Calculate the total energy consumption including extrapolated energy
            baseline_energy_consumption_value = baseline_data['observed'].sum() + extrapolated_energy

        # Generate summary based on meter type
        baseline_energy_periods = f"{baseline_data.shape[0]} ({self.get_readable_date(baseline_data.index[0])} to {self.get_readable_date(baseline_data.index[-1])})"
        baseline_energy_consumption = f"{round(baseline_energy_consumption_value, 0)}"
        baseline_peak_demand = f"{round(self.compute_baseline_peak_demand(baseline_data, model_type), 0)}"
        
        if meter_type == 1:  # electricity
            summary = {
                "Baseline Energy Periods": baseline_energy_periods,
                "Baseline Energy Consumption": baseline_energy_consumption + " KWh",
                "Baseline Peak Demand": baseline_peak_demand + " KW"
            }
        else:  # water = 2, natural gas = 3
            summary = {
                "Baseline Energy Periods": baseline_energy_periods,
                "Baseline Energy Consumption": baseline_energy_consumption + " MJ",
            }
        
        return summary
            
    def training_hourly_model_sm(self):
        self.model_segment_name_mapping = {
            "three_month_weighted": {
                "dec-jan-feb-weighted": "jan",
                "jan-feb-mar-weighted": 'feb',
                "feb-mar-apr-weighted": 'mar',
                "mar-apr-may-weighted": 'apr',
                "apr-may-jun-weighted": 'may',
                "may-jun-jul-weighted": 'jun',
                "jun-jul-aug-weighted": 'jul',
                "jul-aug-sep-weighted": 'aug',
                "aug-sep-oct-weighted": 'sep',
                "sep-oct-nov-weighted": 'oct',
                "oct-nov-dec-weighted": 'nov',
                "nov-dec-jan-weighted": 'dec',
            },
        }[self.segment_type]
        
        weight = pd.DataFrame()
        self.model = {}
        self.feature_coefficients = {}
        self.intercept = {}
        self.regression_formula = {}
        self.p_values = {}
        self.t_stats = {}
        self.model_summaries = {}
        self.model_coefficients = {}
    
        for segment_name, segmented_data in self.segmented_design_matrices.items():
            segmented_data = segmented_data.dropna()
            X = segmented_data.join(pd.get_dummies(segmented_data['hour_of_week'], prefix="weekday_hour", drop_first=True).astype(int)).drop(columns={'hour_of_week'})
            X = X.join(self.training_data[self.independent_variables])  # additional independent variable
            self.X = X
            if X["weight"].sum() == 0:
                weight = None
            else:
                weight = X["weight"]
            X.drop(columns={'weight', 'meter_value'}, inplace=True)
            X = sm.add_constant(X)  # Add a constant column for intercept
    
            y = self.training_data['observed'].iloc[:-1]
    
            # Use statsmodels to get p-values and t-stats
            model = sm.OLS(y, X).fit()
            self.model[self.model_segment_name_mapping[segment_name]] = model
            self.feature_coefficients[self.model_segment_name_mapping[segment_name]] = list(zip(X.columns, model.params))
            self.intercept[self.model_segment_name_mapping[segment_name]] = model.params[0]
            self.regression_formula[self.model_segment_name_mapping[segment_name]] = f"{model.params[0]:+.4f} " + " + ".join(
                [f"{coef:.4f}*{name}" for name, coef in zip(X.columns[1:], model.params[1:])])
            
            # Storing p-values, t-stats, and model summary
            # self.p_values[self.model_segment_name_mapping[segment_name]] = model.pvalues
            # self.t_stats[self.model_segment_name_mapping[segment_name]] = model.tvalues
            # self.model_summaries[self.model_segment_name_mapping[segment_name]] = model.summary2().tables[1]
             # Save the model summary tables separately
            self.model_summaries[self.model_segment_name_mapping[segment_name]] = model.summary2().tables[0]
            self.model_coefficients[self.model_segment_name_mapping[segment_name]] = model.summary2().tables[1]
        
        # Saving the model summaries to a single Excel file with different sheets
        with pd.ExcelWriter('model_summaries.xlsx') as writer:
            for segment_name in self.model_segment_name_mapping.values():
                summary_df = self.model_summaries[segment_name]
                coefficients_df = self.model_coefficients[segment_name]
                summary_df.to_excel(writer, sheet_name=f'summary_{segment_name}')
                coefficients_df.to_excel(writer, sheet_name=f'coefficients_{segment_name}')


    def save_model_to_buffer(self, granularity):
        if granularity == 'hourly':
            model_buffer = io.BytesIO()
            pickle.dump(self.model, model_buffer)
            model_buffer.seek(0)  # Rewind the buffer to the beginning after writing

            # Configuration data for hourly model
            config_data = {
                'coefficients': self.feature_coefficients,
                'intercepts': self.intercept,
                'formulas': self.regression_formula,
                'segment_name_mapping': self.model_segment_name_mapping,
                "occupancy_lookup": self.baseline_segmented_model_hourly.model_process_variables.occupancy_lookup,
                "occupied_temperature_bins": self.baseline_segmented_model_hourly.model_process_variables.occupied_temperature_bins,
                "unoccupied_temperature_bins": self.baseline_segmented_model_hourly.model_process_variables.unoccupied_temperature_bins,
                "feature_processor_segment_name_mapping": self.prediction_segment_name_mapping,
                "independent_variables": self.independent_variables,
                "segment_type": self.segment_type
            }
        elif granularity == 'daily':
            # Combine both models into one dictionary
            combined_models = {
                'eemeter_model': self.baseline_model_daily
            }

            # Only add the linear model if it exists
            if hasattr(self, 'linear_model'):
                combined_models['linear_model'] = self.linear_model
            model_buffer = io.BytesIO()
            pickle.dump(combined_models, model_buffer)
            model_buffer.seek(0)  # Rewind to the beginning

            # Configuration data for daily model
            config_data = {
                "independent_variables": self.independent_variables,
            }
        else:
            raise ValueError("Invalid granularity specified. Choose 'hourly' or 'daily'.")

        # Serialize the configuration
        config_buffer = io.BytesIO()
        pickle.dump(config_data, config_buffer)
        config_buffer.seek(0)  # Rewind the buffer

        return model_buffer, config_buffer

    # def save_hourly_baseline_model(self, model_path, config_path=None):
    #     # Save the model
    #     with open(model_path, 'wb') as f:
    #         pickle.dump(self.model, f)
        
    #     # Optionally save model configurations and coefficients
    #     if config_path:
    #         config_data = {
    #             'coefficients': self.feature_coefficients,
    #             'intercepts': self.intercept,
    #             'formulas': self.regression_formula,
    #             'segment_name_mapping': self.model_segment_name_mapping,
    #             "occupancy_lookup": self.baseline_segmented_model_hourly.model_process_variables.occupancy_lookup,
    #             "occupied_temperature_bins": self.baseline_segmented_model_hourly.model_process_variables.occupied_temperature_bins,
    #             "unoccupied_temperature_bins": self.baseline_segmented_model_hourly.model_process_variables.unoccupied_temperature_bins,
    #         "feature_processor_segment_name_mapping": self.prediction_segment_name_mapping,
    #         "independent_variables" : self.independent_variables,
    #         "segment_type" : self.segment_type
            
    
    #         }
    #         with open(config_path, 'wb') as f:
    #             pickle.dump(config_data, f)

    
    # def save_hourly_baseline_model(self):
    #     # Serialize the model
    #     model_buffer = io.BytesIO()
    #     pickle.dump(self.model, model_buffer)
    #     model_buffer.seek(0)  # Rewind the buffer to the beginning after writing
    
    #     # Create configuration data
    #     config_data = {
    #         'coefficients': self.feature_coefficients,
    #         'intercepts': self.intercept,
    #         'formulas': self.regression_formula,
    #         'segment_name_mapping': self.model_segment_name_mapping,
    #         "occupancy_lookup": self.baseline_segmented_model_hourly.model_process_variables.occupancy_lookup,
    #         "occupied_temperature_bins": self.baseline_segmented_model_hourly.model_process_variables.occupied_temperature_bins,
    #         "unoccupied_temperature_bins": self.baseline_segmented_model_hourly.model_process_variables.unoccupied_temperature_bins,
    #         "feature_processor_segment_name_mapping": self.prediction_segment_name_mapping,
    #         "independent_variables": self.independent_variables,
    #         "segment_type": self.segment_type
    #     }
    
    #     # Serialize the configuration
    #     config_buffer = io.BytesIO()
    #     pickle.dump(config_data, config_buffer)
    #     config_buffer.seek(0)  # Rewind the buffer
    
    #     return model_buffer, config_buffer
        
    # def save_daily_baseline_model(self):
    #     # Serialize the eemeter model to a bytes buffer
    #     eemeter_model_buffer = io.BytesIO()
    #     pickle.dump(self.baseline_model_daily, eemeter_model_buffer)
    #     eemeter_model_buffer.seek(0)  # Reset the buffer pointer to the beginning
    
    #     # Serialize the linear model to a bytes buffer
    #     linear_model_buffer = io.BytesIO()
    #     pickle.dump(self.linear_model, linear_model_buffer)
    #     linear_model_buffer.seek(0)
    
    #     # Prepare configuration data and serialize it to a bytes buffer
    #     config_data = {
    #         "independent_variables": self.independent_variables,
    #         "segment_type": self.segment_type
    #     }
    #     config_buffer = io.BytesIO()
    #     pickle.dump(config_data, config_buffer)
    #     config_buffer.seek(0)
    #     return eemeter_model_buffer,linear_model_buffer, config_buffer
                
    # def save_daily_baseline_model(self, eemeter_model_path,linear_model_path, config_path=None):
    #     # Save the model
    #     with open(eemeter_model_path, 'wb') as f:
    #         pickle.dump(self.baseline_model_daily, f)
    #     with open(linear_model_path, 'wb') as f:
    #         pickle.dump(self.linear_model, f)
        
    #     # Optionally save model configurations and coefficients
    #     if config_path:
    #         config_data = {
    #         "independent_variables" : self.independent_variables,
    #         "segment_type" : self.segment_type
            
    
    #         }
    #         with open(config_path, 'wb') as f:
    #             pickle.dump(config_data, f)