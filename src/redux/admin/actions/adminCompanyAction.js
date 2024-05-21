import { USER_MANAGEMENT } from "constants/apiEndPoints";
import { GET_REQUEST, PATCH_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import NotificationsToast from "utils/notification/NotificationsToast";
import {
  adminCompanySendAlertFailure,
  adminCompanySendAlertRequest,
  adminCompanySendAlertSuccess,
  adminCompanyUpdateStatusFailure,
  adminCompanyUpdateStatusRequest,
  adminCompanyUpdateStatusSuccess,
  fetchAdminCompaniesDropdownFailure,
  fetchAdminCompaniesDropdownRequest,
  fetchAdminCompaniesDropdownSuccess,
  fetchAdminCompanyDetailsFailure,
  fetchAdminCompanyDetailsRequest,
  fetchAdminCompanyDetailsSuccess,
  fetchAdminCompanyListFailure,
  fetchAdminCompanyListRequest,
  fetchAdminCompanyListSuccess,
} from "../actionCreators/adminCompanyActionCreators";

export const fetchAdminCompanyListing = (
  pageInfo,
  search = "",
  company_type_filter = ""
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminCompanyListRequest());
      const endpointWithParams = `${USER_MANAGEMENT.GET_COMPANY_LIST}/${
        (pageInfo.page - 1) * pageInfo.pageSize
      }/${pageInfo.pageSize}?search=${search}&company_type=${company_type_filter}`;
      const response = await GET_REQUEST(endpointWithParams);
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
  console.log(companyId, alertMessage);
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
      const response = await PATCH_REQUEST(endpointWithParams, newStatus);
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
