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
  ADD_NON_ROUTINE_EVENT_DATA_FAILURE,
  ADD_NON_ROUTINE_EVENT_DATA_REQUEST,
  ADD_NON_ROUTINE_EVENT_DATA_SUCCESS,
  GET_NON_ROUTINE_EVENT_DETAIL_FAILURE,
  GET_NON_ROUTINE_EVENT_DETAIL_REQUEST,
  GET_NON_ROUTINE_EVENT_DETAIL_SUCCESS,
  EDIT_NON_ROUTINE_EVENT_FAILURE,
  EDIT_NON_ROUTINE_EVENT_REQUEST,
  EDIT_NON_ROUTINE_EVENT_SUCCESS,
  EDIT_NON_ROUTINE_EVENT_DATA_FAILURE,
  EDIT_NON_ROUTINE_EVENT_DATA_REQUEST,
  EDIT_NON_ROUTINE_EVENT_DATA_SUCCESS,
  DELETE_NON_ROUTINE_EVENT_FAILURE,
  DELETE_NON_ROUTINE_EVENT_REQUEST,
  DELETE_NON_ROUTINE_EVENT_SUCCESS,
  DELETE_NON_ROUTINE_EVENT_DATA_FAILURE,
  DELETE_NON_ROUTINE_EVENT_DATA_REQUEST,
  DELETE_NON_ROUTINE_EVENT_DATA_SUCCESS,
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

export const addNonRoutineEventDataRequest = () => ({
  type: ADD_NON_ROUTINE_EVENT_DATA_REQUEST,
});

export const addNonRoutineEventDataSuccess = (data) => ({
  type: ADD_NON_ROUTINE_EVENT_DATA_SUCCESS,
  payload: data,
});

export const addNonRoutineEventDataFailure = (error) => ({
  type: ADD_NON_ROUTINE_EVENT_DATA_FAILURE,
  payload: error,
});

export const getNonRoutineEventDetailRequest = () => ({
  type: GET_NON_ROUTINE_EVENT_DETAIL_REQUEST,
});

export const getNonRoutineEventDetailSuccess = (data) => ({
  type: GET_NON_ROUTINE_EVENT_DETAIL_SUCCESS,
  payload: data,
});

export const getNonRoutineEventDetailFailure = (error) => ({
  type: GET_NON_ROUTINE_EVENT_DETAIL_FAILURE,
  payload: error,
});

export const editNonRoutineEventRequest = () => ({
  type: EDIT_NON_ROUTINE_EVENT_REQUEST,
});

export const editNonRoutineEventSuccess = (data) => ({
  type: EDIT_NON_ROUTINE_EVENT_SUCCESS,
  payload: data,
});

export const editNonRoutineEventFailure = (error) => ({
  type: EDIT_NON_ROUTINE_EVENT_FAILURE,
  payload: error,
});

export const editNonRoutineEventDataRequest = () => ({
  type: EDIT_NON_ROUTINE_EVENT_DATA_REQUEST,
});

export const editNonRoutineEventDataSuccess = (data) => ({
  type: EDIT_NON_ROUTINE_EVENT_DATA_SUCCESS,
  payload: data,
});

export const editNonRoutineEventDataFailure = (error) => ({
  type: EDIT_NON_ROUTINE_EVENT_DATA_FAILURE,
  payload: error,
});

export const deleteNonRoutineEventRequest = () => ({
  type: DELETE_NON_ROUTINE_EVENT_REQUEST,
});

export const deleteNonRoutineEventSuccess = (data) => ({
  type: DELETE_NON_ROUTINE_EVENT_SUCCESS,
  payload: data,
});

export const deleteNonRoutineEventFailure = (error) => ({
  type: DELETE_NON_ROUTINE_EVENT_FAILURE,
  payload: error,
});

export const deleteNonRoutineEventDataRequest = () => ({
  type: DELETE_NON_ROUTINE_EVENT_DATA_REQUEST,
});

export const deleteNonRoutineEventDataSuccess = (data) => ({
  type: DELETE_NON_ROUTINE_EVENT_DATA_SUCCESS,
  payload: data,
});

export const deleteNonRoutineEventDataFailure = (error) => ({
  type: DELETE_NON_ROUTINE_EVENT_DATA_FAILURE,
  payload: error,
});