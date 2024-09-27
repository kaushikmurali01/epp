import pandas as pd

from constants import METER_FACTOR
from dbconnection import dbtest
from get_sql_queries import get_observed_data_summary, get_missing_data_summary, get_outlier_summary, get_temp_missing_data_summary, get_temp_outlier_summary, get_temp_observed_data_summary
from sql_queries.data_exploration_queries import observed_data_summary_list, missing_data_summary_list,outlier_summary_lower_bound_list, outlier_summary_upper_bound_list, temp_observed_data_summary_list, temp_missing_data_summary_list,temp_outlier_summary_lower_bound_list, temp_outlier_summary_upper_bound_list, missing_data_summary, outlier_summary, temp_outlier_summary, observed_data_summary, daterangequery
from utils import get_nearest_stations
from datetime import datetime, timedelta


class DataExplorationSummaryV2:
    def __init__(self, facility_id, summary_type, meter_name, meter_id, min_date, max_date):
        self.facility_id = facility_id
        self.summary_type = summary_type
        self.meter_name = meter_name
        self.meter_id = meter_id
        self.query = None
        self.temperature_query = None
        self.raw_df = pd.DataFrame()
        self.temp_df = pd.DataFrame()
        self.observed_data = True if summary_type == "observe_data" else False
        self.missing_data = True if summary_type == "missing_data" else False
        self.outliers = True if summary_type == "outliers" else False
        self.start_date = min_date if min_date == None else datetime.strptime(min_date, '%Y-%m-%d')
        self.end_date = max_date if max_date == None else (datetime.strptime(max_date, '%Y-%m-%d') + timedelta(days=1))
    def date_filter(self):
        query_date_filter= ''
        if self.missing_data:
            query_date_filter =  f" AND start_date >= '{self.start_date}' AND end_date <= '{self.end_date}' "
        elif self.outliers:
            query_date_filter =  f" AND e.start_date >= '{self.start_date}' AND e.end_date <= '{self.end_date}' "
        else:
            query_date_filter = f" AND e.start_date >= '{self.start_date}' AND e.end_date <= '{self.end_date}' "
        return  query_date_filter
    def date_filter_temp(self):
        query_date_filter= ''
        if self.missing_data:
            query_date_filter =  f" AND date_time >= '{self.start_date}' AND date_time <= '{self.end_date}' "
        elif self.outliers:
            query_date_filter =  f" AND w.date_time >= '{self.start_date}' AND w.date_time <= '{self.end_date}' "
        else:
            query_date_filter = f" AND w.date_time >= '{self.start_date}' AND w.date_time <= '{self.end_date}' "
        return  query_date_filter

    def setup_query(self):
        get_station_id = get_nearest_stations(self.facility_id)
        station_id= tuple(get_station_id['station_id'].tolist())
        query_date_filter = ""  if  (self.start_date == None and self.end_date == None) else self.date_filter()
        if self.missing_data:
            self.query = missing_data_summary.format(facility_id = self.facility_id, is_independent_variable = False, date_filter= query_date_filter)
        elif self.outliers:
            self.query = outlier_summary.format(facility_id = self.facility_id, meter_factor = METER_FACTOR, is_independent_variable= False, date_filter=query_date_filter)
        else:
            self.query = observed_data_summary.format(facility_id = self.facility_id, meter_factor = METER_FACTOR, is_independent_variable= False, date_filter=query_date_filter)
        self.raw_df = dbtest(self.query)
        query_date_filter = ""  if  (self.start_date == None and self.end_date == None) else self.date_filter_temp()
        if self.missing_data:
            self.temperature_query = get_temp_missing_data_summary(self.facility_id, station_id[0], query_date_filter )
        elif self.outliers:
            self.temperature_query = temp_outlier_summary.format(facility_id = self.facility_id, station_id= station_id[0], meter_factor =METER_FACTOR)
        else:
            if (self.start_date == None and self.end_date == None):
                s_date = self.raw_df['time_stamp_start'].tolist()[0] if  len(self.raw_df)>0 else (datetime.now() - timedelta(days=2*365.25)).strftime('%Y/%m/%d  %H:%M')
                e_date = self.raw_df['time_stamp_end'].tolist()[0] if  len(self.raw_df)>0 else  datetime.now().strftime('%Y/%m/%d  %H:%M')
                start_date = datetime.strptime(s_date, "%Y/%m/%d %H:%M").strftime("%Y-%m-%d")
                end_date = datetime.strptime(e_date, "%Y/%m/%d %H:%M").strftime("%Y-%m-%d")
            else :
                start_date = self.start_date
                end_date =  self.end_date

            self.temperature_query = get_temp_observed_data_summary(station_id[0], METER_FACTOR,start_date,end_date )        

        self.temp_df = dbtest(self.temperature_query)


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

    def setup_listing_query(self, page_size, page_no, bound):
        if self.meter_name == '104':
            if  (self.start_date == None and self.end_date == None) :
                query = daterangequery.format(facility_id = self.facility_id)
                dateRangeData = dbtest(query)
                self.start_date  = dateRangeData['start_date'].tolist()[0] 
                self.end_date = dateRangeData['end_date'].tolist()[0]
            
            query_date_filter = self.date_filter_temp()
            if self.missing_data:
                self.query = temp_missing_data_summary_list.format(facility_id = self.facility_id, meter_id = self.meter_id, is_independent_variable= False, page_number=page_no, page_size=page_size)
            elif self.outliers:
                if bound == 'Lower limit':
                    outliers_query = temp_outlier_summary_lower_bound_list
                else:
                    outliers_query = temp_outlier_summary_upper_bound_list
                self.query = outliers_query.format(facility_id = self.facility_id, meter_id = self.meter_id, METER_FACTOR= METER_FACTOR, is_independent_variable= False, page_number=page_no, page_size=page_size)
            else:
                self.query = temp_observed_data_summary_list.format(facility_id = self.facility_id, meter_id = self.meter_id, METER_FACTOR= METER_FACTOR, is_independent_variable= False, page_number=page_no, page_size=page_size, query_date_filter=query_date_filter)
        else:
            query_date_filter = ""  if  (self.start_date == None and self.end_date == None) else self.date_filter()
            if self.missing_data:
                self.query = missing_data_summary_list.format(facility_id = self.facility_id, meter_id = self.meter_id, is_independent_variable= False, page_number=page_no, page_size=page_size)
            elif self.outliers:
                if bound == 'Lower limit':
                    outliers_query = outlier_summary_lower_bound_list
                else:
                    outliers_query = outlier_summary_upper_bound_list
                self.query = outliers_query.format(facility_id = self.facility_id, meter_id = self.meter_id, METER_FACTOR= METER_FACTOR, is_independent_variable= False, page_number=page_no, page_size=page_size)
            else:
                self.query = observed_data_summary_list.format(facility_id = self.facility_id, meter_id = self.meter_id, METER_FACTOR= METER_FACTOR, is_independent_variable= False, page_number=page_no, page_size=page_size, query_date_filter=query_date_filter)
        self.raw_df = dbtest(self.query)
        

    def get_paginated_list(self, page_size, page_no, bound= None):
        self.setup_listing_query(page_size, page_no, bound)
        paginated_df = self.raw_df.to_dict(orient='records')
        
        
        return paginated_df
