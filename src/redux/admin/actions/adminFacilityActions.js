import { adminFacilityEndpoints } from "constants/apiEndPoints";
import {
  DELETE_REQUEST,
  GET_REQUEST,
  PATCH_REQUEST,
  POST_REQUEST,
} from "utils/HTTPRequests";
import NotificationsToast from "utils/notification/NotificationsToast";
import {
  deleteAdminFacilityFailure,
  deleteAdminFacilityRequest,
  deleteAdminFacilitySuccess,
  fetchAdminFacilityListFailure,
  fetchAdminFacilityListRequest,
  fetchAdminFacilityListSuccess,
  fetchAdminFacilityCharacteristicsFailure,
  fetchAdminFacilityCharacteristicsRequest,
  fetchAdminFacilityCharacteristicsSuccess,
  addAdminFacilityCharacteristicFailure,
  addAdminFacilityCharacteristicRequest,
  addAdminFacilityCharacteristicSuccess,
  updateAdminFacilityCharacteristicFailure,
  updateAdminFacilityCharacteristicRequest,
  updateAdminFacilityCharacteristicSuccess,
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

export const addAdminFacilityCharacteristic = (characteristic) => {
  return async (dispatch) => {
    try {
      dispatch(addAdminFacilityCharacteristicRequest());
      const endpoint = adminFacilityEndpoints.ADD_ADMIN_FACILITY_CHARACTERISTIC;
      const response = await POST_REQUEST(endpoint, characteristic);
      const data = response.data;
      dispatch(addAdminFacilityCharacteristicSuccess(data));
      NotificationsToast({
        message: "Facility details added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(addAdminFacilityCharacteristicFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminFacilityCharacteristics = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminFacilityCharacteristicsRequest());
      const endpointWithParams = `${adminFacilityEndpoints.GET_ADMIN_FACILITY_CHARACTERISTIC}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminFacilityCharacteristicsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminFacilityCharacteristicsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateAdminFacilityCharacteristic = (
  facilityId,
  characteristic
) => {
  return async (dispatch) => {
    try {
      dispatch(updateAdminFacilityCharacteristicRequest());
      const endpointWithParams = `${adminFacilityEndpoints.UPDATE_ADMIN_FACILITY_CHARACTERISTIC}/${facilityId}`;
      const response = await PATCH_REQUEST(endpointWithParams, characteristic);
      const data = response.data;
      dispatch(updateAdminFacilityCharacteristicSuccess(data));
      NotificationsToast({
        message: "Facility details updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(updateAdminFacilityCharacteristicFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
