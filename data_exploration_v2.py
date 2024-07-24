import pandas as pd

from constants import METER_FACTOR
from dbconnection import dbtest
from get_sql_queries import get_observed_data_summary, get_missing_data_summary, get_outlier_summary


class DataExplorationSummaryV2:
    def __init__(self, facility_id, summary_type):
        self.facility_id = facility_id
        self.summary_type = summary_type
        self.query = None
        self.raw_df = pd.DataFrame()
        self.observed_data = True if summary_type == "observe_data" else False
        self.missing_data = True if summary_type == "missing_data" else False
        self.outliers = True if summary_type == "outliers" else False

    def setup_query(self):
        if self.missing_data:
            self.query = get_missing_data_summary(self.facility_id, False)
        elif self.outliers:
            self.query = get_outlier_summary(self.facility_id, METER_FACTOR, False)
        else:
            self.query = get_observed_data_summary(self.facility_id, METER_FACTOR, False)
        self.raw_df = dbtest(self.query)

    def process(self):
        self.setup_query()
        return self.raw_df.to_dict(orient='records')


