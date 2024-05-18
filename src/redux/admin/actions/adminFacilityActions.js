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
  fetchAdminFacilityDetailsRequest,
  fetchAdminFacilityDetailsSuccess,
  fetchAdminFacilityDetailsFailure,
  fetchAdminFacilityStatusRequest,
  fetchAdminFacilityStatusSuccess,
  fetchAdminFacilityStatusFailure,
  updateAdminFacilityStatusRequest,
  updateAdminFacilityStatusSuccess,
  updateAdminFacilityStatusFailure,
  adminAssignFacilityRequest,
  adminAssignFacilitySuccess,
  adminAssignFacilityFailure,
  fetchAdminFacilitiesDropdownRequest,
  fetchAdminFacilitiesDropdownSuccess,
  fetchAdminFacilitiesDropdownFailure,
} from "../actionCreators/adminFacilityActionCreators";

export const fetchAdminFacilityListing = (pageInfo, status, search = "") => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminFacilityListRequest());
      const endpointWithParams = `${
        adminFacilityEndpoints.ADMIN_FACILITY_LIST
      }/${(pageInfo.page - 1) * pageInfo.pageSize}/${
        pageInfo.pageSize
      }?status=${status}&search=${search}`;
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

export const fetchAdminFacilityDetails = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminFacilityDetailsRequest());
      const endpointWithParams = `${adminFacilityEndpoints.GET_ADMIN_FACILITY_DETAILS}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminFacilityDetailsSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminFacilityDetailsFailure(error));
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

export const fetchAdminFacilityStatus = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminFacilityStatusRequest());
      const endpointWithParams = `${adminFacilityEndpoints.GET_ADMIN_FACILITY_STATUS}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminFacilityStatusSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminFacilityStatusFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateAdminFacilityStatus = (facilityId, status) => {
  return async (dispatch) => {
    try {
      dispatch(updateAdminFacilityStatusRequest());
      const endpointWithParams = `${adminFacilityEndpoints.UPDATE_ADMIN_FACILITY_STATUS}/${facilityId}`;
      const response = await PATCH_REQUEST(endpointWithParams, status);
      const data = response.data;
      dispatch(updateAdminFacilityStatusSuccess(data));
      NotificationsToast({
        message: "AdminFacility status updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(updateAdminFacilityStatusFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const adminAssignFacilities = (assignData) => {
  return async (dispatch) => {
    try {
      dispatch(adminAssignFacilityRequest());
      const endpoint = adminFacilityEndpoints.ADMIN_ASSIGN_FACILITIES;
      const response = await POST_REQUEST(endpoint, assignData);
      const data = response.data;
      dispatch(adminAssignFacilitySuccess(data));
      NotificationsToast({
        message: "Facility assigned successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(adminAssignFacilityFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminFacilitiesDropdown = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminFacilitiesDropdownRequest());
      const endpoint = `${adminFacilityEndpoints.ADMIN_FACILITIES_DROPDOWN}`;
      const response = await GET_REQUEST(endpoint);
      const data = response.data;
      dispatch(fetchAdminFacilitiesDropdownSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminFacilitiesDropdownFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
