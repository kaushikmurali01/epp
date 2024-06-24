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
