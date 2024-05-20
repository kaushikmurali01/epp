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
  FETCH_ADMIN_FACILITY_DETAILS_FAILURE,
  FETCH_ADMIN_FACILITY_DETAILS_REQUEST,
  FETCH_ADMIN_FACILITY_DETAILS_SUCCESS,
  FETCH_ADMIN_FACILITY_LIST_FAILURE,
  FETCH_ADMIN_FACILITY_LIST_REQUEST,
  FETCH_ADMIN_FACILITY_LIST_SUCCESS,
  FETCH_ADMIN_FACILITY_STATUS_FAILURE,
  FETCH_ADMIN_FACILITY_STATUS_REQUEST,
  FETCH_ADMIN_FACILITY_STATUS_SUCCESS,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  UPDATE_ADMIN_FACILITY_STATUS_FAILURE,
  UPDATE_ADMIN_FACILITY_STATUS_REQUEST,
  UPDATE_ADMIN_FACILITY_STATUS_SUCCESS,
  ADMIN_ASSIGN_FACILITIES_REQUEST,
  ADMIN_ASSIGN_FACILITIES_SUCCESS,
  ADMIN_ASSIGN_FACILITIES_FAILURE,
  FETCH_ADMIN_FACILITIES_DROPDOWN_REQUEST,
  FETCH_ADMIN_FACILITIES_DROPDOWN_SUCCESS,
  FETCH_ADMIN_FACILITIES_DROPDOWN_FAILURE,
  FETCH_ADMIN_STATISTICS_REQUEST,
  FETCH_ADMIN_STATISTICS_SUCCESS,
  FETCH_ADMIN_STATISTICS_FAILURE,
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

export const fetchAdminFacilityDetailsRequest = () => ({
  type: FETCH_ADMIN_FACILITY_DETAILS_REQUEST,
});

export const fetchAdminFacilityDetailsSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_DETAILS_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityDetailsFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_DETAILS_FAILURE,
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

export const fetchAdminFacilityStatusRequest = () => ({
  type: FETCH_ADMIN_FACILITY_STATUS_REQUEST,
});

export const fetchAdminFacilityStatusSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_STATUS_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityStatusFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_STATUS_FAILURE,
  payload: error,
});

export const updateAdminFacilityStatusRequest = () => ({
  type: UPDATE_ADMIN_FACILITY_STATUS_REQUEST,
});

export const updateAdminFacilityStatusSuccess = (data) => ({
  type: UPDATE_ADMIN_FACILITY_STATUS_SUCCESS,
  payload: data,
});

export const updateAdminFacilityStatusFailure = (error) => ({
  type: UPDATE_ADMIN_FACILITY_STATUS_FAILURE,
  payload: error,
});

export const adminAssignFacilityRequest = () => ({
  type: ADMIN_ASSIGN_FACILITIES_REQUEST,
});

export const adminAssignFacilitySuccess = (data) => ({
  type: ADMIN_ASSIGN_FACILITIES_SUCCESS,
  payload: data,
});

export const adminAssignFacilityFailure = (error) => ({
  type: ADMIN_ASSIGN_FACILITIES_FAILURE,
  payload: error,
});

export const fetchAdminFacilitiesDropdownRequest = () => ({
  type: FETCH_ADMIN_FACILITIES_DROPDOWN_REQUEST,
});

export const fetchAdminFacilitiesDropdownSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITIES_DROPDOWN_SUCCESS,
  payload: data,
});

export const fetchAdminFacilitiesDropdownFailure = (error) => ({
  type: FETCH_ADMIN_FACILITIES_DROPDOWN_FAILURE,
  payload: error,
});

export const fetchAdminStatisticsRequest = () => ({
  type: FETCH_ADMIN_STATISTICS_REQUEST,
});

export const fetchAdminStatisticsSuccess = (data) => ({
  type: FETCH_ADMIN_STATISTICS_SUCCESS,
  payload: data,
});

export const fetchAdminStatisticsFailure = (error) => ({
  type: FETCH_ADMIN_STATISTICS_FAILURE,
  payload: error,
});
