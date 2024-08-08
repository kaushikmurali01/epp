import pandas as pd

from constants import METER_FACTOR
from dbconnection import dbtest
from get_sql_queries import get_observed_data_summary, get_missing_data_summary, get_outlier_summary, \
    get_temp_missing_data_summary, get_temp_outlier_summary, get_temp_observed_data_summary


class DataExplorationSummaryV2:
    def __init__(self, facility_id, summary_type):
        self.facility_id = facility_id
        self.summary_type = summary_type
        self.query = None
        self.temperature_query = None
        self.raw_df = pd.DataFrame()
        self.temp_df = pd.DataFrame()
        self.observed_data = True if summary_type == "observe_data" else False
        self.missing_data = True if summary_type == "missing_data" else False
        self.outliers = True if summary_type == "outliers" else False

    def setup_query(self):
        if self.missing_data:
            self.query = get_missing_data_summary(self.facility_id, False)
            self.temperature_query = get_temp_missing_data_summary(self.facility_id)
        elif self.outliers:
            self.query = get_outlier_summary(self.facility_id, METER_FACTOR, False)
            self.temperature_query = get_temp_outlier_summary(self.facility_id, METER_FACTOR)
        else:
            self.query = get_observed_data_summary(self.facility_id, METER_FACTOR, False)
            self.temperature_query = get_temp_observed_data_summary(self.facility_id, METER_FACTOR)
        self.raw_df = dbtest(self.query)
        print(self.query)
        self.temp_df = dbtest(self.temperature_query)
        print(self.temperature_query)


    def process(self):
        self.setup_query()
        cols = self.raw_df.columns
        if len(self.temp_df):
            self.temp_df['meter_type'] = 104
            self.temp_df = self.temp_df[cols]
            self.raw_df = pd.concat([self.raw_df, self.temp_df], ignore_index=True)
            if self.outliers:
                self.raw_df.sort_values(by=['bound_type', 'meter_type'], inplace=True)
        return self.raw_df.to_dict(orient='records')
    
    def get_paginated_list(self, page_size, page_no):
        self.setup_query()
        start_idx = (page_no - 1) * page_size
        end_idx = start_idx + page_size

        paginated_df = self.raw_df.iloc[start_idx:end_idx]
        total_records = len(self.raw_df)
        total_pages = (total_records + page_size - 1) // page_size

        response = {
            'page_no': page_no,
            'page_size': page_size,
            'total_pages': total_pages,
            'total_records': total_records,
            'data': paginated_df.to_dict(orient='records')
        }
        
        return jsonify(response)
