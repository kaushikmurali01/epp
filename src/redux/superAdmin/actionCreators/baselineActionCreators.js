import {
  ADD_ASSIGNEE_TO_BASELINE_DB_FAILURE,
  ADD_ASSIGNEE_TO_BASELINE_DB_REQUEST,
  ADD_ASSIGNEE_TO_BASELINE_DB_SUCCESS,
  ADD_BASELINE_DB_FAILURE,
  ADD_BASELINE_DB_REQUEST,
  ADD_BASELINE_DB_SUCCESS,
  CLEAR_BASELINE_STATE,
  FETCH_BASELINE_DETAILS_DB_FAILURE,
  FETCH_BASELINE_DETAILS_DB_REQUEST,
  FETCH_BASELINE_DETAILS_DB_SUCCESS,
  FETCH_BASELINE_LIST_DB_FAILURE,
  FETCH_BASELINE_LIST_DB_REQUEST,
  FETCH_BASELINE_LIST_DB_SUCCESS,
  FETCH_BASELINE_PERIOD_FAILURE,
  FETCH_BASELINE_PERIOD_REQUEST,
  FETCH_BASELINE_PERIOD_SUCCESS,
  FETCH_DATA_EXPLORATION_SUMMARY_FAILURE,
  FETCH_DATA_EXPLORATION_SUMMARY_REQUEST,
  FETCH_DATA_EXPLORATION_SUMMARY_SUCCESS,
  FETCH_ISSUE_DETAILS_FAILURE,
  FETCH_ISSUE_DETAILS_REQUEST,
  FETCH_ISSUE_DETAILS_SUCCESS,
  FETCH_STATIONS_DETAILS_FAILURE,
  FETCH_STATIONS_DETAILS_REQUEST,
  FETCH_STATIONS_DETAILS_SUCCESS,
  INDEPENDENT_VARIABLE_LIST_FAILURE,
  INDEPENDENT_VARIABLE_LIST_REQUEST,
  INDEPENDENT_VARIABLE_LIST_SUCCESS,
  SHOW_OBSERVE_DATA_FAILURE,
  SHOW_OBSERVE_DATA_REQUEST,
  SHOW_OBSERVE_DATA_SUCCESS,
  SUBMIT_BASELINE_D_T_FAILURE,
  SUBMIT_BASELINE_D_T_REQUEST,
  SUBMIT_BASELINE_D_T_SUCCESS,
  SUBMIT_REJECTED_BASELINE_DB_FAILURE,
  SUBMIT_REJECTED_BASELINE_DB_REQUEST,
  SUBMIT_REJECTED_BASELINE_DB_SUCCESS,
  SUFFICIENCY_CHECK_FAILURE,
  SUFFICIENCY_CHECK_REQUEST,
  SUFFICIENCY_CHECK_SUCCESS,
  UPDATE_BASELINE_DETAILS_DB_FAILURE,
  UPDATE_BASELINE_DETAILS_DB_REQUEST,
  UPDATE_BASELINE_DETAILS_DB_SUCCESS,
} from "../actionTypes";

export const sufficiencyCheckRequest = () => ({
  type: SUFFICIENCY_CHECK_REQUEST,
});

export const sufficiencyCheckSuccess = (data) => ({
  type: SUFFICIENCY_CHECK_SUCCESS,
  payload: data,
});

export const sufficiencyCheckFailure = (error) => ({
  type: SUFFICIENCY_CHECK_FAILURE,
  payload: error,
});

export const independentVariableListRequest = () => ({
  type: INDEPENDENT_VARIABLE_LIST_REQUEST,
});

export const independentVariableListSuccess = (data) => ({
  type: INDEPENDENT_VARIABLE_LIST_SUCCESS,
  payload: data,
});

export const independentVariableListFailure = (error) => ({
  type: INDEPENDENT_VARIABLE_LIST_FAILURE,
  payload: error,
});

export const fetchBaselinePeriodRequest = () => ({
  type: FETCH_BASELINE_PERIOD_REQUEST,
});

export const fetchBaselinePeriodSuccess = (data) => ({
  type: FETCH_BASELINE_PERIOD_SUCCESS,
  payload: data,
});

export const fetchBaselinePeriodFailure = (error) => ({
  type: FETCH_BASELINE_PERIOD_FAILURE,
  payload: error,
});

export const fetchStationsDetailsRequest = () => ({
  type: FETCH_STATIONS_DETAILS_REQUEST,
});

export const fetchStationsDetailsSuccess = (data) => ({
  type: FETCH_STATIONS_DETAILS_SUCCESS,
  payload: data,
});

export const fetchStationsDetailsFailure = (error) => ({
  type: FETCH_STATIONS_DETAILS_FAILURE,
  payload: error,
});

export const fetchIssueDetailsRequest = () => ({
  type: FETCH_ISSUE_DETAILS_REQUEST,
});

export const fetchIssueDetailsSuccess = (data) => ({
  type: FETCH_ISSUE_DETAILS_SUCCESS,
  payload: data,
});

export const fetchIssueDetailsFailure = (error) => ({
  type: FETCH_ISSUE_DETAILS_FAILURE,
  payload: error,
});

export const addBaselineDbRequest = () => ({
  type: ADD_BASELINE_DB_REQUEST,
});

export const addBaselineDbSuccess = (data) => ({
  type: ADD_BASELINE_DB_SUCCESS,
  payload: data,
});

export const addBaselineDbFailure = (error) => ({
  type: ADD_BASELINE_DB_FAILURE,
  payload: error,
});

export const fetchBaselineDetailsDbRequest = () => ({
  type: FETCH_BASELINE_DETAILS_DB_REQUEST,
});

export const fetchBaselineDetailsDbSuccess = (data) => ({
  type: FETCH_BASELINE_DETAILS_DB_SUCCESS,
  payload: data,
});

export const fetchBaselineDetailsDbFailure = (error) => ({
  type: FETCH_BASELINE_DETAILS_DB_FAILURE,
  payload: error,
});

export const updateBaselineDetailsDbRequest = () => ({
  type: UPDATE_BASELINE_DETAILS_DB_REQUEST,
});

export const updateBaselineDetailsDbSuccess = (data) => ({
  type: UPDATE_BASELINE_DETAILS_DB_SUCCESS,
  payload: data,
});

export const updateBaselineDetailsDbFailure = (error) => ({
  type: UPDATE_BASELINE_DETAILS_DB_FAILURE,
  payload: error,
});

export const fetchBaselineListDbRequest = () => ({
  type: FETCH_BASELINE_LIST_DB_REQUEST,
});

export const fetchBaselineListDbSuccess = (data) => ({
  type: FETCH_BASELINE_LIST_DB_SUCCESS,
  payload: data,
});

export const fetchBaselineListDbFailure = (error) => ({
  type: FETCH_BASELINE_LIST_DB_FAILURE,
  payload: error,
});

export const addAssigneeToBaselineDbRequest = () => ({
  type: ADD_ASSIGNEE_TO_BASELINE_DB_REQUEST,
});

export const addAssigneeToBaselineDbSuccess = (data) => ({
  type: ADD_ASSIGNEE_TO_BASELINE_DB_SUCCESS,
  payload: data,
});

export const addAssigneeToBaselineDbFailure = (error) => ({
  type: ADD_ASSIGNEE_TO_BASELINE_DB_FAILURE,
  payload: error,
});

export const submitRejectBaselineDbRequest = () => ({
  type: SUBMIT_REJECTED_BASELINE_DB_REQUEST,
});

export const submitRejectBaselineDbSuccess = (data) => ({
  type: SUBMIT_REJECTED_BASELINE_DB_SUCCESS,
  payload: data,
});

export const submitRejectBaselineDbFailure = (error) => ({
  type: SUBMIT_REJECTED_BASELINE_DB_FAILURE,
  payload: error,
});

export const showObserveDataRequest = () => ({
  type: SHOW_OBSERVE_DATA_REQUEST,
});

export const showObserveDataSuccess = (data) => ({
  type: SHOW_OBSERVE_DATA_SUCCESS,
  payload: data,
});

export const showObserveDataFailure = (error) => ({
  type: SHOW_OBSERVE_DATA_FAILURE,
  payload: error,
});

export const submitBaselineDtRequest = () => ({
  type: SUBMIT_BASELINE_D_T_REQUEST,
});

export const submitBaselineDtSuccess = (data) => ({
  type: SUBMIT_BASELINE_D_T_SUCCESS,
  payload: data,
});

export const submitBaselineDtFailure = (error) => ({
  type: SUBMIT_BASELINE_D_T_FAILURE,
  payload: error,
});

export const fetchDataExplorationSummaryListRequest = () => ({
  type: FETCH_DATA_EXPLORATION_SUMMARY_REQUEST,
});

export const fetchDataExplorationSummaryListSuccess = (data) => ({
  type: FETCH_DATA_EXPLORATION_SUMMARY_SUCCESS,
  payload: data,
});

export const fetchDataExplorationSummaryListFailure = (error) => ({
  type: FETCH_DATA_EXPLORATION_SUMMARY_FAILURE,
  payload: error,
});

export const clearBaselineState = () => ({
  type: CLEAR_BASELINE_STATE,
});
