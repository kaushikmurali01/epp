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
  FETCH_ADMIN_COMPANIES_DROPDOWN_FAILURE
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