import { meterEndPoints } from "constants/apiEndPoints";
import {
  fetchMeterListFailure,
  fetchMeterListRequest,
  fetchMeterListSuccess,
  addMeterRequest,
  addMeterSuccess,
  addMeterFailure,
  updateMeterRequest,
  updateMeterSuccess,
  updateMeterFailure,
  fetchMeterDetailsRequest,
  fetchMeterDetailsSuccess,
  fetchMeterDetailsFailure,
  deleteMeterRequest,
  deleteMeterSuccess,
  deleteMeterFailure,
  fetchMeterStatisticsRequest,
  fetchMeterStatisticsSuccess,
  fetchMeterStatisticsFailure,
} from "../actionCreators/meterActionCreators";
import {
  GET_REQUEST,
  POST_REQUEST,
  PATCH_REQUEST,
  DELETE_REQUEST,
} from "utils/HTTPRequests";
import NotificationsToast from "../../../utils/notification/NotificationsToast";

export const fetchMeterListing = (pageInfo, id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchMeterListRequest());
      const endpointWithParams = `${meterEndPoints.METER_LIST}/${
        (pageInfo.page - 1) * pageInfo.pageSize
      }/${pageInfo.pageSize}?facility_id=${id}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchMeterListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchMeterListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const addMeter = (meterData) => {
  return async (dispatch) => {
    try {
      dispatch(addMeterRequest());
      const response = await POST_REQUEST(meterEndPoints.ADD_METER, meterData);
      const data = response.data;
      dispatch(addMeterSuccess(data));
      NotificationsToast({
        message: "Meter added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(addMeterFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateMeter = (meterId, meterData) => {
  return async (dispatch) => {
    try {
      dispatch(updateMeterRequest());
      const endpointWithParams = `${meterEndPoints.UPDATE_METER}/${meterId}`;
      const response = await PATCH_REQUEST(endpointWithParams, meterData);
      const data = response.data;
      dispatch(updateMeterSuccess(data));
      NotificationsToast({
        message: "Meter details updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(updateMeterFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchMeterDetails = (meterId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchMeterDetailsRequest());
      const endpointWithParams = `${meterEndPoints.GET_METER_DETAILS}/${meterId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchMeterDetailsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchMeterDetailsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteMeter = (meterId) => {
  return async (dispatch) => {
    try {
      dispatch(deleteMeterRequest(meterId));
      const endpointWithParams = `${meterEndPoints.DELETE_METER}/${meterId}`;
      const response = await DELETE_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(deleteMeterSuccess(data));
      NotificationsToast({
        message: "Meter deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteMeterFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchMeterStatistics = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchMeterStatisticsRequest());
      const response = await GET_REQUEST(meterEndPoints.METER_STATISTICS);
      const data = response.data;
      dispatch(fetchMeterStatisticsSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchMeterStatisticsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
