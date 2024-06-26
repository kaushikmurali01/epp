import {
  FETCH_BASELINE_PERIOD_FAILURE,
  FETCH_BASELINE_PERIOD_REQUEST,
  FETCH_BASELINE_PERIOD_SUCCESS,
  FETCH_STATIONS_DETAILS_FAILURE,
  FETCH_STATIONS_DETAILS_REQUEST,
  FETCH_STATIONS_DETAILS_SUCCESS,
  INDEPENDENT_VARIABLE_LIST_FAILURE,
  INDEPENDENT_VARIABLE_LIST_REQUEST,
  INDEPENDENT_VARIABLE_LIST_SUCCESS,
  SUFFICIENCY_CHECK_FAILURE,
  SUFFICIENCY_CHECK_REQUEST,
  SUFFICIENCY_CHECK_SUCCESS,
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
})

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
})

export const fetchStationsDetailsSuccess = (data) => ({
  type: FETCH_STATIONS_DETAILS_SUCCESS,
  payload: data,
});

export const fetchStationsDetailsFailure = (error) => ({
  type: FETCH_STATIONS_DETAILS_FAILURE,
  payload: error,
});