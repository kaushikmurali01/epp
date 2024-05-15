import {
    FETCH_ADMIN_COMPANY_DETAILS_FAILURE,
    FETCH_ADMIN_COMPANY_DETAILS_REQUEST,
    FETCH_ADMIN_COMPANY_DETAILS_SUCCESS,
    FETCH_ADMIN_COMPANY_LIST_FAILURE,
    FETCH_ADMIN_COMPANY_LIST_REQUEST,
    FETCH_ADMIN_COMPANY_LIST_SUCCESS,
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