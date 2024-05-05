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