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
