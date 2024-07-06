import { ENERVA_USER_MANAGEMENT, USER_MANAGEMENT } from "constants/apiEndPoints";
import {
  GET_REQUEST,
  PATCH_REQUEST,
  POST_REQUEST,
  PUT_REQUEST,
  DELETE_REQUEST,
} from "utils/HTTPRequests";
import NotificationsToast from "utils/notification/NotificationsToast";
import {
  adminCompanySendAlertFailure,
  adminCompanySendAlertRequest,
  adminCompanySendAlertSuccess,
  adminCompanyUpdateStatusFailure,
  adminCompanyUpdateStatusRequest,
  adminCompanyUpdateStatusSuccess,
  changeCompanySuperAdminFailure,
  changeCompanySuperAdminRequest,
  changeCompanySuperAdminSuccess,
  deleteCompanyFailure,
  deleteCompanyRequest,
  deleteCompanySucess,
  fetchAdminCompaniesDropdownFailure,
  fetchAdminCompaniesDropdownRequest,
  fetchAdminCompaniesDropdownSuccess,
  fetchAdminCompanyDetailsFailure,
  fetchAdminCompanyDetailsRequest,
  fetchAdminCompanyDetailsSuccess,
  fetchAdminCompanyListFailure,
  fetchAdminCompanyListRequest,
  fetchAdminCompanyListSuccess,
  fetchCompanyUserListFailure,
  fetchCompanyUserListRequest,
  fetchCompanyUserListSuccess,
  fetchUsersByCompanyFailure,
  fetchUsersByCompanyRequest,
  fetchUsersByCompanySuccess,
} from "../actionCreators/adminCompanyActionCreators";
import { DELETE_COMPANY_SUCCESS } from "../actionTypes";

export const fetchAdminCompanyListing = (
  pageInfo,
  search = [],
  company_type_filter = "",
  sortByCol,
  sortOrder
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminCompanyListRequest());
      let apiURL = `${USER_MANAGEMENT.GET_COMPANY_LIST_WITH_SEARCH}`;
      let payload = {
        data: search,
        offset: (pageInfo.page - 1) * pageInfo.pageSize,
        limit: pageInfo.pageSize,
        col_name: sortByCol,
        order: sortOrder,
      };
      const response = await POST_REQUEST(apiURL, payload);
      const data = response.data;
      dispatch(fetchAdminCompanyListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminCompanyListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminCompanyDetails = (companyId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminCompanyDetailsRequest());
      const endpointWithParams = `${USER_MANAGEMENT.GET_COMPANY_DETAILS}/${companyId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminCompanyDetailsSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminCompanyDetailsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const adminCompanySendAlert = (companyId, alertMessage) => {
  return async (dispatch) => {
    try {
      dispatch(adminCompanySendAlertRequest());
      const endpointWithParams = `${USER_MANAGEMENT.COMPANY_SEND_ALERT}/${companyId}`;
      const response = await POST_REQUEST(endpointWithParams, alertMessage);
      const data = response.data;
      dispatch(adminCompanySendAlertSuccess(data));
      NotificationsToast({
        message: "Alert sent successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(adminCompanySendAlertFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const adminCompanyUpdateStatus = (companyId, newStatus) => {
  return async (dispatch) => {
    try {
      dispatch(adminCompanyUpdateStatusRequest());
      const endpointWithParams = `${USER_MANAGEMENT.UPDATE_COMPANY_STATUS}/${companyId}`;
      const response = await PUT_REQUEST(endpointWithParams, newStatus);
      const data = response.data;
      dispatch(adminCompanyUpdateStatusSuccess(data));
      NotificationsToast({
        message: "Status updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(adminCompanyUpdateStatusFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminCompaniesDropdown = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminCompaniesDropdownRequest());
      const endpoint = `${USER_MANAGEMENT.COMPANIES_DROPDOWN}`;
      const response = await GET_REQUEST(endpoint);
      const data = response.data;
      dispatch(fetchAdminCompaniesDropdownSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminCompaniesDropdownFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteCompanyById = (companyId) => {
  return async (dispatch) => {
    try {
      dispatch(deleteCompanyRequest());
      const endpointWithParams = `${USER_MANAGEMENT.DELETE_COMPANY}/${companyId}`;
      const response = await DELETE_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(deleteCompanySucess(data));
      NotificationsToast({
        message: "Company deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteCompanyFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const changeSuperAdmin = (companyId, selectedUser) => {
  return async (dispatch) => {
    try {
      dispatch(changeCompanySuperAdminRequest());
      const endpointWithParams = `${USER_MANAGEMENT.UPDATE_SUPER_ADMIN_PERMISSIONS}/${companyId}/${selectedUser}`;
      const response = await POST_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(changeCompanySuperAdminSuccess(data));
      NotificationsToast({
        message: "Super admin changed successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(changeCompanySuperAdminFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchCompanyUserList = (companyId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchCompanyUserListRequest());
      const endpointWithParams = `${USER_MANAGEMENT.GET_AVAILABLE_USERS_FOR_PERMISSIONS}/${companyId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchCompanyUserListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchCompanyUserListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchUsersByCompanyId = (pageInfo, companyId,search) => {
  return async (dispatch) => {
    try {
      dispatch(fetchUsersByCompanyRequest());
      // let endpointWithParams = `${
      //   USER_MANAGEMENT.GET_USER_BY_COMPANY
      // }/${companyId}/${(pageInfo.page - 1) * pageInfo.pageSize}/${
      //   pageInfo.pageSize
      // }`;
      let apiURL = `${ENERVA_USER_MANAGEMENT.GET_POST_ENERVA_USER_LIST}`;
      let payload = {
        "data": {
          ...search,
          company_id:companyId
        },
        "offset": (pageInfo.page - 1) * pageInfo.pageSize,
        "limit": pageInfo.pageSize,
        // "col_name": sortByCol,
        // "order":sortOrder
        
      }
      console.log(apiURL,payload, "fetchUsersByCompanyId data")
      // return;
      const response = await POST_REQUEST(apiURL,payload);
      const data = response.data;
      console.log(data, "fetchUsersByCompanyId data")
      dispatch(fetchUsersByCompanySuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchUsersByCompanyFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
