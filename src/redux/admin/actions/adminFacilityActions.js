import { adminFacilityEndpoints } from "constants/apiEndPoints";
import { DELETE_REQUEST, GET_REQUEST } from "utils/HTTPRequests";
import NotificationsToast from "utils/notification/NotificationsToast";
import {
  deleteAdminFacilityFailure,
  deleteAdminFacilityRequest,
  deleteAdminFacilitySuccess,
  fetchAdminFacilityListFailure,
  fetchAdminFacilityListRequest,
  fetchAdminFacilityListSuccess,
} from "../actionCreators/adminFacilityActionCreators";

export const fetchAdminFacilityListing = (pageInfo, status) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminFacilityListRequest());
      const endpointWithParams = `${
        adminFacilityEndpoints.ADMIN_FACILITY_LIST
      }/${(pageInfo.page - 1) * pageInfo.pageSize}/${
        pageInfo.pageSize
      }?status=${status}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminFacilityListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminFacilityListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteAdminFacility = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(deleteAdminFacilityRequest());
      const endpointWithParams = `${adminFacilityEndpoints.ADMIN_DELETE_FACILITY}/${facilityId}`;
      const response = await DELETE_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(deleteAdminFacilitySuccess(data));
      NotificationsToast({
        message: "Facility deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteAdminFacilityFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
