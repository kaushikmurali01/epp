from sql_queries.data_exploration_queries import outlier_summary, observed_data_summary, missing_data_summary, \
    temp_outlier_summary, temp_observed_data_summary, temp_missing_data_summary


# Summary Function Start
def get_outlier_summary(facility_id, factor, independent_variable):
    return outlier_summary.format(factor, factor, facility_id, independent_variable)


def get_temp_outlier_summary(facility_id, factor):
    return temp_outlier_summary.format(factor, factor, facility_id, facility_id)


def get_observed_data_summary(facility_id, factor, independent_variable):
    return observed_data_summary.format(facility_id, factor, factor, independent_variable)


def get_temp_observed_data_summary(facility_id, factor):
    return temp_observed_data_summary.format(facility_id, factor, factor, facility_id)


def get_missing_data_summary(facility_id, independent_variable):
    return missing_data_summary.format(facility_id, independent_variable)


def get_temp_missing_data_summary(facility_id):
    return temp_missing_data_summary.format(facility_id)

# Summary Function End

#
# def get_temperature_summary(facility_id, factor):
#     return temperature_data_summary.format(facility_id, factor, factor, facility_id)
#
#
# def get_outlier_detail(facility_id, factor, independent_variable, meter_type, upper=False):
#     if upper:
#         return upper_bound_outlier_detail.format(facility_id, factor, factor, facility_id, independent_variable,
#                                                  meter_type)
#     return lower_bound_outlier_detail.format(facility_id, factor, factor, facility_id, independent_variable, meter_type)
#
#
# def get_observed_data_detail(facility_id, factor, independent_variable, meter_type):
#     return observed_data_detail.format(facility_id, factor, factor, facility_id, independent_variable, meter_type)
#
#
# def get_missing_data_detail(facility_id, independent_variable, meter_type):
#     return missing_data_detail.format(meter_type, facility_id, independent_variable)
