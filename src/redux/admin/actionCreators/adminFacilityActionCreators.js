import {
  DELETE_ADMIN_FACILITY_FAILURE,
  DELETE_ADMIN_FACILITY_REQUEST,
  DELETE_ADMIN_FACILITY_SUCCESS,
  FETCH_ADMIN_FACILITY_LIST_FAILURE,
  FETCH_ADMIN_FACILITY_LIST_REQUEST,
  FETCH_ADMIN_FACILITY_LIST_SUCCESS,
} from "../actionTypes";

export const fetchAdminFacilityListRequest = () => ({
  type: FETCH_ADMIN_FACILITY_LIST_REQUEST,
});

export const fetchAdminFacilityListSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_LIST_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityListFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_LIST_FAILURE,
  payload: error,
});

export const deleteAdminFacilityRequest = () => ({
  type: DELETE_ADMIN_FACILITY_REQUEST,
});

export const deleteAdminFacilitySuccess = (data) => ({
  type: DELETE_ADMIN_FACILITY_SUCCESS,
  payload: data,
});

export const deleteAdminFacilityFailure = (error) => ({
  type: DELETE_ADMIN_FACILITY_FAILURE,
  payload: error,
});