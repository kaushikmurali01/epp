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