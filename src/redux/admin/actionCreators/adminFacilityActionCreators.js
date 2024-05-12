import {
  ADD_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  ADD_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
  ADD_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  DELETE_ADMIN_FACILITY_FAILURE,
  DELETE_ADMIN_FACILITY_REQUEST,
  DELETE_ADMIN_FACILITY_SUCCESS,
  FETCH_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  FETCH_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
  FETCH_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  FETCH_ADMIN_FACILITY_LIST_FAILURE,
  FETCH_ADMIN_FACILITY_LIST_REQUEST,
  FETCH_ADMIN_FACILITY_LIST_SUCCESS,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
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

export const addAdminFacilityCharacteristicRequest = () => ({
  type: ADD_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
});

export const addAdminFacilityCharacteristicSuccess = (data) => ({
  type: ADD_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const addAdminFacilityCharacteristicFailure = (error) => ({
  type: ADD_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});

export const fetchAdminFacilityCharacteristicsRequest = () => ({
  type: FETCH_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
});

export const fetchAdminFacilityCharacteristicsSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityCharacteristicsFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});

export const updateAdminFacilityCharacteristicRequest = () => ({
  type: UPDATE_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
});

export const updateAdminFacilityCharacteristicSuccess = (data) => ({
  type: UPDATE_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const updateAdminFacilityCharacteristicFailure = (error) => ({
  type: UPDATE_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});
