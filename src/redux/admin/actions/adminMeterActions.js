import { adminMeterEndPoints } from "constants/apiEndPoints";
import {
  fetchAdminMeterListFailure,
  fetchAdminMeterListRequest,
  fetchAdminMeterListSuccess,
  addAdminMeterRequest,
  addAdminMeterSuccess,
  addAdminMeterFailure,
  updateAdminMeterRequest,
  updateAdminMeterSuccess,
  updateAdminMeterFailure,
  fetchAdminMeterDetailsRequest,
  fetchAdminMeterDetailsSuccess,
  fetchAdminMeterDetailsFailure,
  deleteAdminMeterRequest,
  deleteAdminMeterSuccess,
  deleteAdminMeterFailure,
  fetchAdminMeterStatisticsRequest,
  fetchAdminMeterStatisticsSuccess,
  fetchAdminMeterStatisticsFailure,
} from "../actionCreators/adminMeterActionCreator";
import {
  GET_REQUEST,
  POST_REQUEST,
  PATCH_REQUEST,
  DELETE_REQUEST,
} from "utils/HTTPRequests";
import NotificationsToast from "../../../utils/notification/NotificationsToast";

export const fetchAdminMeterListing = (pageInfo, id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminMeterListRequest());
      const endpointWithParams = `${adminMeterEndPoints.METER_LIST}/${
        (pageInfo.page - 1) * pageInfo.pageSize
      }/${pageInfo.pageSize}?facility_id=${id}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminMeterListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminMeterListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const addAdminMeter = (meterData) => {
  return async (dispatch) => {
    try {
      dispatch(addAdminMeterRequest());
      const response = await POST_REQUEST(
        adminMeterEndPoints.ADD_METER,
        meterData
      );
      const data = response.data;
      dispatch(addAdminMeterSuccess(data));
      NotificationsToast({
        message: "Meter added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(addAdminMeterFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateAdminMeter = (meterId, meterData) => {
  return async (dispatch) => {
    try {
      dispatch(updateAdminMeterRequest());
      const endpointWithParams = `${adminMeterEndPoints.UPDATE_METER}/${meterId}`;
      const response = await PATCH_REQUEST(endpointWithParams, meterData);
      const data = response.data;
      dispatch(updateAdminMeterSuccess(data));
      NotificationsToast({
        message: "Meter details updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(updateAdminMeterFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminMeterDetails = (meterId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminMeterDetailsRequest());
      const endpointWithParams = `${adminMeterEndPoints.GET_METER_DETAILS}/${meterId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminMeterDetailsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminMeterDetailsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteAdminMeter = (meterId) => {
  return async (dispatch) => {
    try {
      dispatch(deleteAdminMeterRequest(meterId));
      const endpointWithParams = `${adminMeterEndPoints.DELETE_METER}/${meterId}`;
      const response = await DELETE_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(deleteAdminMeterSuccess(data));
      NotificationsToast({
        message: "Meter deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteAdminMeterFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminMeterStatistics = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminMeterStatisticsRequest(facilityId));
      const endpointWithParams = `${adminMeterEndPoints.METER_STATISTICS}?facility_id=${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminMeterStatisticsSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminMeterStatisticsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
