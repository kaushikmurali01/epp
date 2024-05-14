import {
  FETCH_METER_LIST_FAILURE,
  FETCH_METER_LIST_REQUEST,
  FETCH_METER_LIST_SUCCESS,
  ADD_METER_REQUEST,
  ADD_METER_SUCCESS,
  ADD_METER_FAILURE,
  UPDATE_METER_REQUEST,
  UPDATE_METER_SUCCESS,
  UPDATE_METER_FAILURE,
  FETCH_METER_DETAILS_REQUEST,
  FETCH_METER_DETAILS_SUCCESS,
  FETCH_METER_DETAILS_FAILURE,
  DELETE_METER_REQUEST,
  DELETE_METER_SUCCESS,
  DELETE_METER_FAILURE,
  FETCH_METER_STATISTICS_REQUEST,
  FETCH_METER_STATISTICS_SUCCESS,
  FETCH_METER_STATISTICS_FAILURE,
} from "../actionTypes";

export const fetchMeterListRequest = () => ({
  type: FETCH_METER_LIST_REQUEST,
});

export const fetchMeterListSuccess = (data) => ({
  type: FETCH_METER_LIST_SUCCESS,
  payload: data,
});

export const fetchMeterListFailure = (error) => ({
  type: FETCH_METER_LIST_FAILURE,
  payload: error,
});

export const addMeterRequest = () => ({
  type: ADD_METER_REQUEST,
});

export const addMeterSuccess = (data) => ({
  type: ADD_METER_SUCCESS,
  payload: data,
});

export const addMeterFailure = (error) => ({
  type: ADD_METER_FAILURE,
  payload: error,
});

export const updateMeterRequest = () => ({
  type: UPDATE_METER_REQUEST,
});

export const updateMeterSuccess = (data) => ({
  type: UPDATE_METER_SUCCESS,
  payload: data,
});

export const updateMeterFailure = (error) => ({
  type: UPDATE_METER_FAILURE,
  payload: error,
});

export const fetchMeterDetailsRequest = () => ({
  type: FETCH_METER_DETAILS_REQUEST,
});

export const fetchMeterDetailsSuccess = (data) => ({
  type: FETCH_METER_DETAILS_SUCCESS,
  payload: data,
});

export const fetchMeterDetailsFailure = (error) => ({
  type: FETCH_METER_DETAILS_FAILURE,
  payload: error,
});

export const deleteMeterRequest = () => ({
  type: DELETE_METER_REQUEST,
});

export const deleteMeterSuccess = (data) => ({
  type: DELETE_METER_SUCCESS,
  payload: data,
});

export const deleteMeterFailure = (error) => ({
  type: DELETE_METER_FAILURE,
  payload: error,
});

export const fetchMeterStatisticsRequest = () => ({
  type: FETCH_METER_STATISTICS_REQUEST,
});

export const fetchMeterStatisticsSuccess = (data) => ({
  type: FETCH_METER_STATISTICS_SUCCESS,
  payload: data,
});

export const fetchMeterStatisticsFailure = (error) => ({
  type: FETCH_METER_STATISTICS_FAILURE,
  payload: error,
});
