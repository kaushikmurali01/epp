import os
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

def adjust_and_finalize_data(processed_data,preserved_columns, modelling_independent_variables):
    # Preserve columns that need to be kept regardless of their presence in modelling_independent_variables
    # preserved_columns = ['observed', 'temperature']
    all_required_columns = modelling_independent_variables + preserved_columns
    
    # Step 1: Remove any columns not needed (not in modelling_independent_variables or preserved_columns)
    processed_data = processed_data.loc[:, processed_data.columns.isin(all_required_columns)]
    
    # Step 2: Add missing modelling independent variables with default values of zero
    missing_cols = [col for col in modelling_independent_variables if col not in processed_data.columns]
    for col in missing_cols:
        processed_data[col] = 0

    # Ensure the columns order is correct for consistency
    # Including preserved columns at the end to maintain structure
    final_columns_order = [col for col in modelling_independent_variables if col in processed_data.columns] + preserved_columns
    processed_data = processed_data[final_columns_order]

    return processed_data


def create_iterator(scoring_data, segment_type, model_process_variables):
    # Define segment types
    prediction_segment_type = {
        "single": "single",
        "three_month_weighted": "one_month",
    }[segment_type]
    
    # Create segmentation
    prediction_segmentation = segment_time_series(scoring_data.asfreq('h').index, prediction_segment_type, drop_zero_weight_segments=True)
    
    # Proceed with iteration
    return iterate_segmented_dataset(
        scoring_data['temperature'].to_frame("temperature_mean").asfreq('h'),
        segmentation=prediction_segmentation,
        feature_processor=caltrack_hourly_prediction_feature_processor,
        feature_processor_kwargs={
            "occupancy_lookup": model_process_variables['occupancy_lookup'],
            "occupied_temperature_bins": model_process_variables['occupied_temperature_bins'],
            "unoccupied_temperature_bins": model_process_variables['unoccupied_temperature_bins'],
        },
        feature_processor_segment_name_mapping=model_process_variables['feature_processor_segment_name_mapping'],
    )

def scoring_hourly_model(scoring_data, model, config):
    # Generate iterator with provided configuration
    iterator = create_iterator(scoring_data[['observed', 'temperature']].copy(), config['segment_type'], config)
    predictions = {}
    
    # Predict using the provided model
    for segment_name, segmented_data in iterator:
        segmented_data = segmented_data.dropna()
        X = segmented_data.join(pd.get_dummies(segmented_data['hour_of_week'], prefix="weekday_hour", drop_first=True).astype(int)).drop(columns={'hour_of_week'})
        X = X.join(scoring_data[config['independent_variables']])
        X.drop(columns=["weight"], inplace=True)
        
        try:
            EN_predict = model[segment_name].predict(X) * segmented_data.weight
            EN_predict = EN_predict[segmented_data.weight > 0].reindex(scoring_data.index)
            predictions[segment_name] = EN_predict
        except Exception as e:
            print(f"Baseline model doesn't have a regression for {segment_name}. Error: {e}")
    
    # Combine predictions and add to scoring data
    predictions = pd.DataFrame(predictions)
    scoring_data['predicted'] = pd.DataFrame({"predicted": predictions.sum(axis=1, min_count=1)})
    return scoring_data


def scoring_daily_model(processed_reporting_data, eemeter_model, linear_model, independent_variables):
    # Check if resampling is needed for reporting data
    if processed_reporting_data.index.freqstr != 'D':
        daily_grouped_reporting = processed_reporting_data.resample('D').agg({'temperature': 'mean', 'observed': 'sum'})
    else:
        daily_grouped_reporting = processed_reporting_data
    
    # Use the loaded eemeter model to predict on reporting data
    reporting_data_daily = DailyBaselineData(daily_grouped_reporting, is_electricity_data=True)
    reporting_predictions = eemeter_model.predict(reporting_data_daily)
    
    # Convert temperature to Celsius and calculate residuals
    reporting_predictions['temperature'] = (reporting_predictions['temperature'] - 32) * 5 / 9
    reporting_predictions['residual'] = reporting_predictions['predicted'] - reporting_predictions['observed']
    
    # Use the linear regression model if it exists and independent variables are defined
    if linear_model is not None and independent_variables:
        # Ensure independent variables exist in the processed reporting data
        missing_variables = [var for var in independent_variables if var not in daily_grouped_reporting.columns]
        if missing_variables:
            print(f"Missing independent variables: {missing_variables}. Skipping linear model predictions.")
        else:
            # Prepare data for the linear model
            X_scoring = daily_grouped_reporting[independent_variables]
            # Predict adjustments using the linear model and calculate final predictions
            reporting_predictions['predicted'] += linear_model.predict(X_scoring)
            reporting_predictions['residual'] = reporting_predictions['predicted'] - reporting_predictions['observed']
    else:
        if linear_model is None:
            print("Linear model is not available. Skipping linear model predictions.")
        elif not independent_variables:
            print("No independent variables defined. Skipping linear model predictions.")
    
    return reporting_predictions
