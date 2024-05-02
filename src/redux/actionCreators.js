import {
  FETCH_FACILITY_LIST_FAILURE,
  FETCH_FACILITY_LIST_REQUEST,
  FETCH_FACILITY_LIST_SUCCESS,
} from "./actionTypes";

export const fetchFacilityListRequest = () => ({
  type: FETCH_FACILITY_LIST_REQUEST,
});

export const fetchFacilityListSuccess = (data) => ({
  type: FETCH_FACILITY_LIST_SUCCESS,
  payload: data,
});

export const fetchFacilityListFailure = (error) => ({
  type: FETCH_FACILITY_LIST_FAILURE,
  payload: error,
});
