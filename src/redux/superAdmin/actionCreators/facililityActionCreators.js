import {
  FETCH_FACILITY_LIST_FAILURE,
  FETCH_FACILITY_LIST_REQUEST,
  FETCH_FACILITY_LIST_SUCCESS,
  SUBMIT_FACILITY_FOR_APPROVAL_REQUEST,
  SUBMIT_FACILITY_FOR_APPROVAL_SUCCESS,
  SUBMIT_FACILITY_FOR_APPROVAL_FAILURE,
  FETCH_FACILITY_DETAILS_REQUEST,
  FETCH_FACILITY_DETAILS_SUCCESS,
  FETCH_FACILITY_DETAILS_FAILURE,
  DELETE_FACILITY_REQUEST,
  DELETE_FACILITY_SUCCESS,
  DELETE_FACILITY_FAILURE,
  ADD_FACILITY_CHARACTERISTICS_REQUEST,
  ADD_FACILITY_CHARACTERISTICS_SUCCESS,
  ADD_FACILITY_CHARACTERISTICS_FAILURE,
  FETCH_FACILITY_CHARACTERISTICS_REQUEST,
  FETCH_FACILITY_CHARACTERISTICS_SUCCESS,
  FETCH_FACILITY_CHARACTERISTICS_FAILURE,
  UPDATE_FACILITY_CHARACTERISTICS_REQUEST,
  UPDATE_FACILITY_CHARACTERISTICS_SUCCESS,
  UPDATE_FACILITY_CHARACTERISTICS_FAILURE,
  FETCH_FACILITY_STATUS_REQUEST,
  FETCH_FACILITY_STATUS_SUCCESS,
  FETCH_FACILITY_STATUS_FAILURE,
  UPDATE_FACILITY_STATUS_REQUEST,
  UPDATE_FACILITY_STATUS_SUCCESS,
  UPDATE_FACILITY_STATUS_FAILURE,
} from "../actionTypes";

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

export const submitFacilityForApprovalRequest = () => ({
  type: SUBMIT_FACILITY_FOR_APPROVAL_REQUEST,
});

export const submitFacilityForApprovalSuccess = (data) => ({
  type: SUBMIT_FACILITY_FOR_APPROVAL_SUCCESS,
  payload: data,
});

export const submitFacilityForApprovalFailure = (error) => ({
  type: SUBMIT_FACILITY_FOR_APPROVAL_FAILURE,
  payload: error,
});

export const fetchFacilityDetailsRequest = () => ({
  type: FETCH_FACILITY_DETAILS_REQUEST,
});

export const fetchFacilityDetailsSuccess = (data) => ({
  type: FETCH_FACILITY_DETAILS_SUCCESS,
  payload: data,
});

export const fetchFacilityDetailsFailure = (error) => ({
  type: FETCH_FACILITY_DETAILS_FAILURE,
  payload: error,
});

export const deleteFacilityRequest = () => ({
  type: DELETE_FACILITY_REQUEST,
});

export const deleteFacilitySuccess = (data) => ({
  type: DELETE_FACILITY_SUCCESS,
  payload: data,
});

export const deleteFacilityFailure = (error) => ({
  type: DELETE_FACILITY_FAILURE,
  payload: error,
});

export const addFacilityCharacteristicRequest = () => ({
  type: ADD_FACILITY_CHARACTERISTICS_REQUEST,
});

export const addFacilityCharacteristicSuccess = (data) => ({
  type: ADD_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const addFacilityCharacteristicFailure = (error) => ({
  type: ADD_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});

export const fetchFacilityCharacteristicsRequest = () => ({
  type: FETCH_FACILITY_CHARACTERISTICS_REQUEST,
});

export const fetchFacilityCharacteristicsSuccess = (data) => ({
  type: FETCH_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const fetchFacilityCharacteristicsFailure = (error) => ({
  type: FETCH_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});

export const updateFacilityCharacteristicRequest = () => ({
  type: UPDATE_FACILITY_CHARACTERISTICS_REQUEST,
});

export const updateFacilityCharacteristicSuccess = (data) => ({
  type: UPDATE_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const updateFacilityCharacteristicFailure = (error) => ({
  type: UPDATE_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});

export const fetchFacilityStatusRequest = () => ({
  type: FETCH_FACILITY_STATUS_REQUEST,
});

export const fetchFacilityStatusSuccess = (data) => ({
  type: FETCH_FACILITY_STATUS_SUCCESS,
  payload: data,
});

export const fetchFacilityStatusFailure = (error) => ({
  type: FETCH_FACILITY_STATUS_FAILURE,
  payload: error,
});

export const updateFacilityStatusRequest = () => ({
  type: UPDATE_FACILITY_STATUS_REQUEST,
});

export const updateFacilityStatusSuccess = (data) => ({
  type: UPDATE_FACILITY_STATUS_SUCCESS,
  payload: data,
});

export const updateFacilityStatusFailure = (error) => ({
  type: UPDATE_FACILITY_STATUS_FAILURE,
  payload: error,
});
