import {
  FETCH_METER_LIST_FAILURE,
  FETCH_METER_LIST_REQUEST,
  FETCH_METER_LIST_SUCCESS,
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
