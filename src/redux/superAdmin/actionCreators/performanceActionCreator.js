import {
  GET_BASELINE_DATA_SUMMARY_FAILURE,
  GET_BASELINE_DATA_SUMMARY_REQUEST,
  GET_BASELINE_DATA_SUMMARY_SUCCESS,
  CREATE_NON_ROUTINE_EVENT_FAILURE,
  CREATE_NON_ROUTINE_EVENT_REQUEST,
  CREATE_NON_ROUTINE_EVENT_SUCCESS,
  GET_NON_ROUTINE_EVENT_LIST_FAILURE,
  GET_NON_ROUTINE_EVENT_LIST_REQUEST,
  GET_NON_ROUTINE_EVENT_LIST_SUCCESS,
} from "../actionTypes";

export const getBaselineDataSummaryRequest = () => ({
  type: GET_BASELINE_DATA_SUMMARY_REQUEST,
});

export const getBaselineDataSummarySuccess = (data) => ({
  type: GET_BASELINE_DATA_SUMMARY_SUCCESS,
  payload: data,
});

export const getBaselineDataSummaryFailure = (error) => ({
  type: GET_BASELINE_DATA_SUMMARY_FAILURE,
  payload: error,
});

export const createNonRoutineEventRequest = () => ({
  type: CREATE_NON_ROUTINE_EVENT_REQUEST,
});

export const createNonRoutineEventSuccess = (data) => ({
  type: CREATE_NON_ROUTINE_EVENT_SUCCESS,
  payload: data,
});

export const createNonRoutineEventFailure = (error) => ({
  type: CREATE_NON_ROUTINE_EVENT_FAILURE,
  payload: error,
});

export const getNonRoutineEventListRequest = () => ({
  type: GET_NON_ROUTINE_EVENT_LIST_REQUEST,
});

export const getNonRoutineEventListSuccess = (data) => ({
  type: GET_NON_ROUTINE_EVENT_LIST_SUCCESS,
  payload: data,
});

export const getNonRoutineEventListFailure = (error) => ({
  type: GET_NON_ROUTINE_EVENT_LIST_FAILURE,
  payload: error,
});