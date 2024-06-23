import {
  ADMIN_COMPANY_SEND_ALERT_FAILURE,
  ADMIN_COMPANY_SEND_ALERT_REQUEST,
  ADMIN_COMPANY_SEND_ALERT_SUCCESS,
  ADMIN_COMPANY_UPDATE_STATUS_FAILURE,
  ADMIN_COMPANY_UPDATE_STATUS_REQUEST,
  ADMIN_COMPANY_UPDATE_STATUS_SUCCESS,
  FETCH_ADMIN_COMPANY_DETAILS_FAILURE,
  FETCH_ADMIN_COMPANY_DETAILS_REQUEST,
  FETCH_ADMIN_COMPANY_DETAILS_SUCCESS,
  FETCH_ADMIN_COMPANY_LIST_FAILURE,
  FETCH_ADMIN_COMPANY_LIST_REQUEST,
  FETCH_ADMIN_COMPANY_LIST_SUCCESS,
  FETCH_ADMIN_COMPANIES_DROPDOWN_REQUEST,
  FETCH_ADMIN_COMPANIES_DROPDOWN_SUCCESS,
  FETCH_ADMIN_COMPANIES_DROPDOWN_FAILURE,
  DELETE_COMPANY_REQUEST,
  DELETE_COMPANY_SUCCESS,
  DELETE_COMPANY_FAILURE,
  CHANGE_COMPANY_SUPER_ADMIN_REQUEST,
  CHANGE_COMPANY_SUPER_ADMIN_SUCCESS,
  CHANGE_COMPANY_SUPER_ADMIN_FAILURE,
  FETCH_COMPANY_USER_LIST_REQUEST,
  FETCH_COMPANY_USER_LIST_SUCCESS,
  FETCH_COMPANY_USER_LIST_FAILURE,
  FETCH_USERS_BY_COMPANY_REQUEST,
  FETCH_USERS_BY_COMPANY_SUCCESS,
  FETCH_USERS_BY_COMPANY_FAILURE,
} from "../actionTypes";

export const fetchAdminCompanyListRequest = () => ({
  type: FETCH_ADMIN_COMPANY_LIST_REQUEST,
});

export const fetchAdminCompanyListSuccess = (data) => ({
  type: FETCH_ADMIN_COMPANY_LIST_SUCCESS,
  payload: data,
});

export const fetchAdminCompanyListFailure = (error) => ({
  type: FETCH_ADMIN_COMPANY_LIST_FAILURE,
  payload: error,
});

export const fetchAdminCompanyDetailsRequest = () => ({
  type: FETCH_ADMIN_COMPANY_DETAILS_REQUEST,
});

export const fetchAdminCompanyDetailsSuccess = (data) => ({
  type: FETCH_ADMIN_COMPANY_DETAILS_SUCCESS,
  payload: data,
});

export const fetchAdminCompanyDetailsFailure = (error) => ({
  type: FETCH_ADMIN_COMPANY_DETAILS_FAILURE,
  payload: error,
});

export const adminCompanySendAlertRequest = () => ({
  type: ADMIN_COMPANY_SEND_ALERT_REQUEST,
});

export const adminCompanySendAlertSuccess = (data) => ({
  type: ADMIN_COMPANY_SEND_ALERT_SUCCESS,
  payload: data,
});

export const adminCompanySendAlertFailure = (error) => ({
  type: ADMIN_COMPANY_SEND_ALERT_FAILURE,
  payload: error,
});

export const adminCompanyUpdateStatusRequest = () => ({
  type: ADMIN_COMPANY_UPDATE_STATUS_REQUEST,
});

export const adminCompanyUpdateStatusSuccess = (data) => ({
  type: ADMIN_COMPANY_UPDATE_STATUS_SUCCESS,
  payload: data,
});

export const adminCompanyUpdateStatusFailure = (error) => ({
  type: ADMIN_COMPANY_UPDATE_STATUS_FAILURE,
  payload: error,
});

export const fetchAdminCompaniesDropdownRequest = () => ({
  type: FETCH_ADMIN_COMPANIES_DROPDOWN_REQUEST,
});

export const fetchAdminCompaniesDropdownSuccess = (data) => ({
  type: FETCH_ADMIN_COMPANIES_DROPDOWN_SUCCESS,
  payload: data,
});

export const fetchAdminCompaniesDropdownFailure = (error) => ({
  type: FETCH_ADMIN_COMPANIES_DROPDOWN_FAILURE,
  payload: error,
});

export const deleteCompanyRequest = () => ({
  type: DELETE_COMPANY_REQUEST,
});

export const deleteCompanySucess = (data) => ({
  type: DELETE_COMPANY_SUCCESS,
  payload: data,
});

export const deleteCompanyFailure = (error) => ({
  type: DELETE_COMPANY_FAILURE,
  payload: error,
});

export const changeCompanySuperAdminRequest = () => ({
  type: CHANGE_COMPANY_SUPER_ADMIN_REQUEST,
});

export const changeCompanySuperAdminSuccess = (data) => ({
  type: CHANGE_COMPANY_SUPER_ADMIN_SUCCESS,
  payload: data,
});

export const changeCompanySuperAdminFailure = (error) => ({
  type: CHANGE_COMPANY_SUPER_ADMIN_FAILURE,
  payload: error,
});

export const fetchCompanyUserListRequest = () => ({
  type: FETCH_COMPANY_USER_LIST_REQUEST,
});

export const fetchCompanyUserListSuccess = (data) => ({
  type: FETCH_COMPANY_USER_LIST_SUCCESS,
  payload: data,
});

export const fetchCompanyUserListFailure = (error) => ({
  type: FETCH_COMPANY_USER_LIST_FAILURE,
  payload: error,
});

export const fetchUsersByCompanyRequest = () => ({
  type: FETCH_USERS_BY_COMPANY_REQUEST,
});

export const fetchUsersByCompanySuccess = (data) => ({
  type: FETCH_USERS_BY_COMPANY_SUCCESS,
  payload: data,
});

export const fetchUsersByCompanyFailure = (error) => ({
  type: FETCH_USERS_BY_COMPANY_FAILURE,
  payload: error,
});
