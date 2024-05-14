import { USER_MANAGEMENT } from "constants/apiEndPoints";
import { GET_REQUEST } from "utils/HTTPRequests";
import NotificationsToast from "utils/notification/NotificationsToast";
import {
  fetchAdminCompanyDetailsFailure,
  fetchAdminCompanyDetailsRequest,
  fetchAdminCompanyDetailsSuccess,
  fetchAdminCompanyListFailure,
  fetchAdminCompanyListRequest,
  fetchAdminCompanyListSuccess,
} from "../actionCreators/adminCompanyActionCreators";

export const fetchAdminCompanyListing = (pageInfo) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminCompanyListRequest());
      const endpointWithParams = `${USER_MANAGEMENT.GET_COMPANY_LIST}/${
        (pageInfo.page - 1) * pageInfo.pageSize
      }/${pageInfo.pageSize}`;
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
