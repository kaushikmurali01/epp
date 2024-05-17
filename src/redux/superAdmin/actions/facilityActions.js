import { facilityEndPoints } from "constants/apiEndPoints";
import {
  fetchFacilityListFailure,
  fetchFacilityListRequest,
  fetchFacilityListSuccess,
  getUserDetailsFailure,
  getUserDetailsRequest,
  getUserDetailsSuccess,
  submitFacilityForApprovalRequest,
  submitFacilityForApprovalSuccess,
  submitFacilityForApprovalFailure,
  fetchFacilityDetailsRequest,
  fetchFacilityDetailsSuccess,
  fetchFacilityDetailsFailure,
  deleteFacilityRequest,
  deleteFacilitySuccess,
  deleteFacilityFailure,
  addFacilityCharacteristicRequest,
  addFacilityCharacteristicSuccess,
  addFacilityCharacteristicFailure,
  fetchFacilityCharacteristicsRequest,
  fetchFacilityCharacteristicsSuccess,
  fetchFacilityCharacteristicsFailure,
  updateFacilityCharacteristicRequest,
  updateFacilityCharacteristicSuccess,
  updateFacilityCharacteristicFailure,
  fetchFacilityStatusRequest,
  fetchFacilityStatusSuccess,
  fetchFacilityStatusFailure,
  updateFacilityStatusRequest,
  updateFacilityStatusSuccess,
  updateFacilityStatusFailure,
} from "../actionCreators/facililityActionCreators";
import {
  DELETE_REQUEST,
  GET_REQUEST,
  PATCH_REQUEST,
  POST_REQUEST,
} from "utils/HTTPRequests";
import { USER_MANAGEMENT } from "constants/apiEndPoints";
import NotificationsToast from "../../../utils/notification/NotificationsToast.js";

export const fetchFacilityListing = (pageInfo, search = "") => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityListRequest());
      const endpointWithParams = `${facilityEndPoints.FACILITY_LIST}/${
        (pageInfo.page - 1) * pageInfo.pageSize
      }/${pageInfo.pageSize}?search=${search}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchUserDetails = () => {
  return async (dispatch) => {
    try {
      dispatch(getUserDetailsRequest());
      dispatch({ type: "SHOW_LOADER", payload: true });
      const endpointWithParams = `${USER_MANAGEMENT.GET_USER_DETAILS}`;
      const response = await GET_REQUEST(endpointWithParams);
      dispatch({ type: "SHOW_LOADER", payload: false });
      const data = response.data;
      dispatch(getUserDetailsSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(getUserDetailsFailure(error));
      dispatch({ type: "SHOW_LOADER", payload: false });
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const submitFacilityForApproval = (facility) => {
  return async (dispatch) => {
    try {
      dispatch(submitFacilityForApprovalRequest());
      const endpointWithParams = `${facilityEndPoints.SUBMIT_FACILITY_FOR_APPROVAL}/${facility}`;
      const response = await POST_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(submitFacilityForApprovalSuccess(data));
      NotificationsToast({
        message: "Facility Submited for Approval",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(submitFacilityForApprovalFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchFacilityDetails = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityDetailsRequest());
      const endpointWithParams = `${facilityEndPoints.GET_FACILITY_DETAILS}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityDetailsSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityDetailsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteFacility = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(deleteFacilityRequest());
      const endpointWithParams = `${facilityEndPoints.DELETE_FACILITY}/${facilityId}`;
      const response = await DELETE_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(deleteFacilitySuccess(data));
      NotificationsToast({
        message: "Facility deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteFacilityFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const addFacilityCharacteristic = (characteristic) => {
  return async (dispatch) => {
    try {
      dispatch(addFacilityCharacteristicRequest());
      const endpoint = facilityEndPoints.ADD_FACILITY_CHARACTERISTIC;
      const response = await POST_REQUEST(endpoint, characteristic);
      const data = response.data;
      dispatch(addFacilityCharacteristicSuccess(data));
      NotificationsToast({
        message: "Facility details added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(addFacilityCharacteristicFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchFacilityCharacteristics = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityCharacteristicsRequest());
      const endpointWithParams = `${facilityEndPoints.GET_FACILITY_CHARACTERISTIC}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityCharacteristicsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityCharacteristicsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateFacilityCharacteristic = (facilityId, characteristic) => {
  return async (dispatch) => {
    try {
      dispatch(updateFacilityCharacteristicRequest());
      const endpointWithParams = `${facilityEndPoints.UPDATE_FACILITY_CHARACTERISTIC}/${facilityId}`;
      const response = await PATCH_REQUEST(endpointWithParams, characteristic);
      const data = response.data;
      dispatch(updateFacilityCharacteristicSuccess(data));
      NotificationsToast({
        message: "Facility details updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(updateFacilityCharacteristicFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchFacilityStatus = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityStatusRequest());
      const endpointWithParams = `${facilityEndPoints.GET_FACILITY_STATUS}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityStatusSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityStatusFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateFacilityStatus = (facilityId, status) => {
  return async (dispatch) => {
    try {
      dispatch(updateFacilityStatusRequest());
      const endpointWithParams = `${facilityEndPoints.UPDATE_FACILITY_STATUS}/${facilityId}`;
      const response = await PATCH_REQUEST(endpointWithParams, status);
      const data = response.data;
      dispatch(updateFacilityStatusSuccess(data));
      NotificationsToast({
        message: "Facility status updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(updateFacilityStatusFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
