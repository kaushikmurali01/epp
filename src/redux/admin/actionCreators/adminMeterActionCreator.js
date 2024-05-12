import {
  FETCH_ADMIN_METER_LIST_FAILURE,
  FETCH_ADMIN_METER_LIST_REQUEST,
  FETCH_ADMIN_METER_LIST_SUCCESS,
  ADD_ADMIN_METER_REQUEST,
  ADD_ADMIN_METER_SUCCESS,
  ADD_ADMIN_METER_FAILURE,
  UPDATE_ADMIN_METER_REQUEST,
  UPDATE_ADMIN_METER_SUCCESS,
  UPDATE_ADMIN_METER_FAILURE,
  FETCH_ADMIN_METER_DETAILS_REQUEST,
  FETCH_ADMIN_METER_DETAILS_SUCCESS,
  FETCH_ADMIN_METER_DETAILS_FAILURE,
  DELETE_ADMIN_METER_REQUEST,
  DELETE_ADMIN_METER_SUCCESS,
  DELETE_ADMIN_METER_FAILURE,
  FETCH_ADMIN_METER_STATISTICS_REQUEST,
  FETCH_ADMIN_METER_STATISTICS_SUCCESS,
  FETCH_ADMIN_METER_STATISTICS_FAILURE,
} from "../actionTypes";

export const fetchAdminMeterListRequest = () => ({
  type: FETCH_ADMIN_METER_LIST_REQUEST,
});

export const fetchAdminMeterListSuccess = (data) => ({
  type: FETCH_ADMIN_METER_LIST_SUCCESS,
  payload: data,
});

export const fetchAdminMeterListFailure = (error) => ({
  type: FETCH_ADMIN_METER_LIST_FAILURE,
  payload: error,
});

export const addAdminMeterRequest = () => ({
  type: ADD_ADMIN_METER_REQUEST,
});

export const addAdminMeterSuccess = (data) => ({
  type: ADD_ADMIN_METER_SUCCESS,
  payload: data,
});

export const addAdminMeterFailure = (error) => ({
  type: ADD_ADMIN_METER_FAILURE,
  payload: error,
});

export const updateAdminMeterRequest = () => ({
  type: UPDATE_ADMIN_METER_REQUEST,
});

export const updateAdminMeterSuccess = (data) => ({
  type: UPDATE_ADMIN_METER_SUCCESS,
  payload: data,
});

export const updateAdminMeterFailure = (error) => ({
  type: UPDATE_ADMIN_METER_FAILURE,
  payload: error,
});

export const fetchAdminMeterDetailsRequest = () => ({
  type: FETCH_ADMIN_METER_DETAILS_REQUEST,
});

export const fetchAdminMeterDetailsSuccess = (data) => ({
  type: FETCH_ADMIN_METER_DETAILS_SUCCESS,
  payload: data,
});

export const fetchAdminMeterDetailsFailure = (error) => ({
  type: FETCH_ADMIN_METER_DETAILS_FAILURE,
  payload: error,
});

export const deleteAdminMeterRequest = () => ({
  type: DELETE_ADMIN_METER_REQUEST,
});

export const deleteAdminMeterSuccess = (data) => ({
  type: DELETE_ADMIN_METER_SUCCESS,
  payload: data,
});

export const deleteAdminMeterFailure = (error) => ({
  type: DELETE_ADMIN_METER_FAILURE,
  payload: error,
});

export const fetchAdminMeterStatisticsRequest = () => ({
  type: FETCH_ADMIN_METER_STATISTICS_REQUEST,
});

export const fetchAdminMeterStatisticsSuccess = (data) => ({
  type: FETCH_ADMIN_METER_STATISTICS_SUCCESS,
  payload: data,
});

export const fetchAdminMeterStatisticsFailure = (error) => ({
  type: FETCH_ADMIN_METER_STATISTICS_FAILURE,
  payload: error,
});
