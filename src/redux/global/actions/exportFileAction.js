import { GET_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import {
  clearNotificationState,
  fetchExportFileRecordIdFailure,
  fetchExportFileRecordIdRequest,
  fetchExportFileRecordIdSuccess,
  fetchExportStatusFailure,
  fetchExportStatusRequest,
  fetchExportStatusSuccess,
  fetchUnreadNotificationsFailure,
  fetchUnreadNotificationsRequest,
  fetchUnreadNotificationsSuccess,
  markNotificationAsReadFailure,
  markNotificationAsReadRequest,
  markNotificationAsReadSuccess,
} from "../actionCreators/exportFileActionCreator";
import NotificationsToast from "utils/notification/NotificationsToast";
import {
  BASELINE_ENDPOINTS,
  PERFORMANCE_ENDPOINTS,
} from "constants/apiEndPoints";

export const fetchBaselineRecordId = (
  facilityId,
  meterType,
  _interface,
  user_id
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchExportFileRecordIdRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.GET_PREDICTED_DATA}?facility_id=${facilityId}&meter_type=${meterType}&interface=${_interface}&user=${user_id}&export=true`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchExportFileRecordIdSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchExportFileRecordIdFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchPerformanceRecordId = (
  facilityId,
  meterType,
  _interface,
  user_id,
  performancePeriod
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchExportFileRecordIdRequest());
      let endpointWithParams = `${PERFORMANCE_ENDPOINTS.GET_PREDICTED_DATA}?facility_id=${facilityId}&meter_type=${meterType}&interface=${_interface}&user=${user_id}&export=true`;
      if (performancePeriod) {
        endpointWithParams += `&p4p_period=${performancePeriod}`;
      }
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchExportFileRecordIdSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchExportFileRecordIdFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchExportStatus = (recordIds) => {
  return async (dispatch) => {
    try {
      dispatch(fetchExportStatusRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.GET_EXPORT_STATUS}?record_ids=${recordIds}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchExportStatusSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchExportStatusFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const fetchUnreadNotifications = (user_id, pageSize, pageNumber) => {
  return async (dispatch) => {
    try {
      dispatch(fetchUnreadNotificationsRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.GET_UNREAD_NOTIFICATIONS}?user=${user_id}&page_size=${pageSize}&page_number=${pageNumber}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchUnreadNotificationsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchUnreadNotificationsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const markAsReadNotification = (notificationData) => {
  return async (dispatch) => {
    try {
      dispatch(markNotificationAsReadRequest());
      let endpointWithParams = BASELINE_ENDPOINTS.MARK_AS_READ_NOTIFICATION;
      const response = await POST_REQUEST(endpointWithParams, notificationData);
      const data = response.data;
      dispatch(markNotificationAsReadSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(markNotificationAsReadFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const clearNotificationsAction = () => (dispatch) => {
  console.log("Clearing notifications");
  dispatch(clearNotificationState());
};
