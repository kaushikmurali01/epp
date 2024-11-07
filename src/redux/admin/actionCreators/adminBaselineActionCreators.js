import {
  FETCH_ADMIN_BASELINE_PERIOD_FAILURE,
  FETCH_ADMIN_BASELINE_PERIOD_REQUEST,
  FETCH_ADMIN_BASELINE_PERIOD_SUCCESS,
  FETCH_ADMIN_STATIONS_DETAILS_FAILURE,
  FETCH_ADMIN_STATIONS_DETAILS_REQUEST,
  FETCH_ADMIN_STATIONS_DETAILS_SUCCESS,
  ADMIN_INDEPENDENT_VARIABLE_LIST_FAILURE,
  ADMIN_INDEPENDENT_VARIABLE_LIST_REQUEST,
  ADMIN_INDEPENDENT_VARIABLE_LIST_SUCCESS,
  ADMIN_SUFFICIENCY_CHECK_FAILURE,
  ADMIN_SUFFICIENCY_CHECK_REQUEST,
  ADMIN_SUFFICIENCY_CHECK_SUCCESS,
  FETCH_ADMIN_ISSUE_DETAILS_REQUEST,
  FETCH_ADMIN_ISSUE_DETAILS_SUCCESS,
  FETCH_ADMIN_ISSUE_DETAILS_FAILURE,
  ADMIN_ADD_BASELINE_DB_REQUEST,
  ADMIN_ADD_BASELINE_DB_SUCCESS,
  ADMIN_ADD_BASELINE_DB_FAILURE,
  FETCH_ADMIN_BASELINE_DETAILS_DB_REQUEST,
  FETCH_ADMIN_BASELINE_DETAILS_DB_SUCCESS,
  FETCH_ADMIN_BASELINE_DETAILS_DB_FAILURE,
  UPDATE_ADMIN_BASELINE_DETAILS_DB_REQUEST,
  UPDATE_ADMIN_BASELINE_DETAILS_DB_SUCCESS,
  UPDATE_ADMIN_BASELINE_DETAILS_DB_FAILURE,
  FETCH_ADMIN_BASELINE_LIST_DB_REQUEST,
  FETCH_ADMIN_BASELINE_LIST_DB_FAILURE,
  ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_REQUEST,
  ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_SUCCESS,
  ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_FAILURE,
  SUBMIT_ADMIN_REJECTED_BASELINE_DB_REQUEST,
  SUBMIT_ADMIN_REJECTED_BASELINE_DB_SUCCESS,
  SUBMIT_ADMIN_REJECTED_BASELINE_DB_FAILURE,
  FETCH_ADMIN_BASELINE_LIST_DB_SUCCESS,
  SHOW_ADMIN_OBSERVE_DATA_REQUEST,
  SHOW_ADMIN_OBSERVE_DATA_SUCCESS,
  SHOW_ADMIN_OBSERVE_DATA_FAILURE,
  SUBMIT_ADMIN_BASELINE_D_T_REQUEST,
  SUBMIT_ADMIN_BASELINE_D_T_SUCCESS,
  SUBMIT_ADMIN_BASELINE_D_T_FAILURE,
  CLEAR_ADMIN_BASELINE_STATE,
  FETCH_ADMIN_DATA_EXPLORATION_SUMMARY_REQUEST,
  FETCH_ADMIN_DATA_EXPLORATION_SUMMARY_SUCCESS,
  FETCH_ADMIN_DATA_EXPLORATION_SUMMARY_FAILURE,
  FETCH_ADMIN_RAW_SUMMARY_METER_LIST_REQUEST,
  FETCH_ADMIN_RAW_SUMMARY_METER_LIST_SUCCESS,
  FETCH_ADMIN_RAW_SUMMARY_METER_LIST_FAILURE,
  FETCH_ADMIN_OUTLIERS_SETTINGS_REQUEST,
  FETCH_ADMIN_OUTLIERS_SETTINGS_SUCCESS,
  FETCH_ADMIN_OUTLIERS_SETTINGS_FAILURE,
  FETCH_FACILITY_THRESHOLD_REQUEST,
  FETCH_FACILITY_THRESHOLD_SUCCESS,
  FETCH_FACILITY_THRESHOLD_FAILURE,
  UPDATE_FACILITY_THRESHOLD_REQUEST,
  UPDATE_FACILITY_THRESHOLD_SUCCESS,
  UPDATE_FACILITY_THRESHOLD_FAILURE,
  FETCH_ADMIN_BASELINE_PREDICTED_DATA_REQUEST,
  FETCH_ADMIN_BASELINE_PREDICTED_DATA_SUCCESS,
  FETCH_ADMIN_BASELINE_PREDICTED_DATA_FAILURE,
} from "../actionTypes";

export const adminSufficiencyCheckRequest = () => ({
  type: ADMIN_SUFFICIENCY_CHECK_REQUEST,
});

export const adminSufficiencyCheckSuccess = (data) => ({
  type: ADMIN_SUFFICIENCY_CHECK_SUCCESS,
  payload: data,
});

export const adminSufficiencyCheckFailure = (error) => ({
  type: ADMIN_SUFFICIENCY_CHECK_FAILURE,
  payload: error,
});

export const adminIndependentVariableListRequest = () => ({
  type: ADMIN_INDEPENDENT_VARIABLE_LIST_REQUEST,
});

export const adminIndependentVariableListSuccess = (data) => ({
  type: ADMIN_INDEPENDENT_VARIABLE_LIST_SUCCESS,
  payload: data,
});

export const adminIndependentVariableListFailure = (error) => ({
  type: ADMIN_INDEPENDENT_VARIABLE_LIST_FAILURE,
  payload: error,
});

export const fetchAdminBaselinePeriodRequest = () => ({
  type: FETCH_ADMIN_BASELINE_PERIOD_REQUEST,
});

export const fetchAdminBaselinePeriodSuccess = (data) => ({
  type: FETCH_ADMIN_BASELINE_PERIOD_SUCCESS,
  payload: data,
});

export const fetchAdminBaselinePeriodFailure = (error) => ({
  type: FETCH_ADMIN_BASELINE_PERIOD_FAILURE,
  payload: error,
});

export const fetchAdminStationsDetailsRequest = () => ({
  type: FETCH_ADMIN_STATIONS_DETAILS_REQUEST,
});

export const fetchAdminStationsDetailsSuccess = (data) => ({
  type: FETCH_ADMIN_STATIONS_DETAILS_SUCCESS,
  payload: data,
});

export const fetchAdminStationsDetailsFailure = (error) => ({
  type: FETCH_ADMIN_STATIONS_DETAILS_FAILURE,
  payload: error,
});

export const fetchAdminIssueDetailsRequest = () => ({
  type: FETCH_ADMIN_ISSUE_DETAILS_REQUEST,
});

export const fetchAdminIssueDetailsSuccess = (data) => ({
  type: FETCH_ADMIN_ISSUE_DETAILS_SUCCESS,
  payload: data,
});

export const fetchAdminIssueDetailsFailure = (error) => ({
  type: FETCH_ADMIN_ISSUE_DETAILS_FAILURE,
  payload: error,
});

export const adminAddBaselineDbRequest = () => ({
  type: ADMIN_ADD_BASELINE_DB_REQUEST,
});

export const adminAddBaselineDbSuccess = (data) => ({
  type: ADMIN_ADD_BASELINE_DB_SUCCESS,
  payload: data,
});

export const adminAddBaselineDbFailure = (error) => ({
  type: ADMIN_ADD_BASELINE_DB_FAILURE,
  payload: error,
});

export const fetchAdminBaselineDetailsDbRequest = () => ({
  type: FETCH_ADMIN_BASELINE_DETAILS_DB_REQUEST,
});

export const fetchAdminBaselineDetailsDbSuccess = (data) => ({
  type: FETCH_ADMIN_BASELINE_DETAILS_DB_SUCCESS,
  payload: data,
});

export const fetchAdminBaselineDetailsDbFailure = (error) => ({
  type: FETCH_ADMIN_BASELINE_DETAILS_DB_FAILURE,
  payload: error,
});

export const updateAdminBaselineDetailsDbRequest = () => ({
  type: UPDATE_ADMIN_BASELINE_DETAILS_DB_REQUEST,
});

export const updateAdminBaselineDetailsDbSuccess = (data) => ({
  type: UPDATE_ADMIN_BASELINE_DETAILS_DB_SUCCESS,
  payload: data,
});

export const updateAdminBaselineDetailsDbFailure = (error) => ({
  type: UPDATE_ADMIN_BASELINE_DETAILS_DB_FAILURE,
  payload: error,
});

export const fetchAdminBaselineListDbRequest = () => ({
  type: FETCH_ADMIN_BASELINE_LIST_DB_REQUEST,
});

export const fetchAdminBaselineListDbSuccess = (data) => ({
  type: FETCH_ADMIN_BASELINE_LIST_DB_SUCCESS,
  payload: data,
});

export const fetchAdminBaselineListDbFailure = (error) => ({
  type: FETCH_ADMIN_BASELINE_LIST_DB_FAILURE,
  payload: error,
});

export const adminAddAssigneeToBaselineDbRequest = () => ({
  type: ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_REQUEST,
});

export const adminAddAssigneeToBaselineDbSuccess = (data) => ({
  type: ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_SUCCESS,
  payload: data,
});

export const adminAddAssigneeToBaselineDbFailure = (error) => ({
  type: ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_FAILURE,
  payload: error,
});

export const submitAdminRejectBaselineDbRequest = () => ({
  type: SUBMIT_ADMIN_REJECTED_BASELINE_DB_REQUEST,
});

export const submitAdminRejectBaselineDbSuccess = (data) => ({
  type: SUBMIT_ADMIN_REJECTED_BASELINE_DB_SUCCESS,
  payload: data,
});

export const submitAdminRejectBaselineDbFailure = (error) => ({
  type: SUBMIT_ADMIN_REJECTED_BASELINE_DB_FAILURE,
  payload: error,
});

export const showAdminObserveDataRequest = () => ({
  type: SHOW_ADMIN_OBSERVE_DATA_REQUEST,
});

export const showAdminObserveDataSuccess = (data) => ({
  type: SHOW_ADMIN_OBSERVE_DATA_SUCCESS,
  payload: data,
});

export const showAdminObserveDataFailure = (error) => ({
  type: SHOW_ADMIN_OBSERVE_DATA_FAILURE,
  payload: error,
});

export const submitAdminBaselineDtRequest = () => ({
  type: SUBMIT_ADMIN_BASELINE_D_T_REQUEST,
});

export const submitAdminBaselineDtSuccess = (data) => ({
  type: SUBMIT_ADMIN_BASELINE_D_T_SUCCESS,
  payload: data,
});

export const submitAdminBaselineDtFailure = (error) => ({
  type: SUBMIT_ADMIN_BASELINE_D_T_FAILURE,
  payload: error,
});
export const fetchAdminDataExplorationSummaryListRequest = () => ({
  type: FETCH_ADMIN_DATA_EXPLORATION_SUMMARY_REQUEST,
});

export const fetchAdminDataExplorationSummaryListSuccess = (data) => ({
  type: FETCH_ADMIN_DATA_EXPLORATION_SUMMARY_SUCCESS,
  payload: data,
});

export const fetchAdminDataExplorationSummaryListFailure = (error) => ({
  type: FETCH_ADMIN_DATA_EXPLORATION_SUMMARY_FAILURE,
  payload: error,
});

export const fetchAdminRawSummaryMeterListRequest = () => ({
  type: FETCH_ADMIN_RAW_SUMMARY_METER_LIST_REQUEST,
});

export const fetchAdminRawSummaryMeterListSuccess = (data) => ({
  type: FETCH_ADMIN_RAW_SUMMARY_METER_LIST_SUCCESS,
  payload: data,
});

export const fetchAdminRawSummaryMeterListFailure = (error) => ({
  type: FETCH_ADMIN_RAW_SUMMARY_METER_LIST_FAILURE,
  payload: error,
});
export const fetchAdminOutliersSettingsRequest = () => ({
  type: FETCH_ADMIN_OUTLIERS_SETTINGS_REQUEST,
});

export const fetchAdminOutliersSettingsSuccess = (data) => ({
  type: FETCH_ADMIN_OUTLIERS_SETTINGS_SUCCESS,
  payload: data,
});

export const fetchAdminOutliersSettingsFailure = (error) => ({
  type: FETCH_ADMIN_OUTLIERS_SETTINGS_FAILURE,
  payload: error,
});

export const fetchFacilityThresholdRequest = (error) => ({
  type: FETCH_FACILITY_THRESHOLD_REQUEST,
});

export const fetchFacilityThresholdSuccess = (data) => ({
  type: FETCH_FACILITY_THRESHOLD_SUCCESS,
  payload: data,
});

export const fetchFacilityThresholdFailure = (error) => ({
  type: FETCH_FACILITY_THRESHOLD_FAILURE,
  payload: error,
});

export const updateFacilityThresholdRequest = (error) => ({
  type: UPDATE_FACILITY_THRESHOLD_REQUEST,
});

export const updateFacilityThresholdSuccess = (data) => ({
  type: UPDATE_FACILITY_THRESHOLD_SUCCESS,
  payload: data,
});

export const updateFacilityThresholdFailure = (error) => ({
  type: UPDATE_FACILITY_THRESHOLD_FAILURE,
  payload: error,
});

export const fetchAdminBaselinePredictedDataRequest = () => ({
  type: FETCH_ADMIN_BASELINE_PREDICTED_DATA_REQUEST,
});

export const fetchAdminBaselinePredictedDataSuccess = (data) => ({
  type: FETCH_ADMIN_BASELINE_PREDICTED_DATA_SUCCESS,
  payload: data,
});

export const fetchAdminBaselinePredictedDataFailure = (error) => ({
  type: FETCH_ADMIN_BASELINE_PREDICTED_DATA_FAILURE,
  payload: error,
});

export const clearAdminBaselineState = () => ({
  type: CLEAR_ADMIN_BASELINE_STATE,
});
