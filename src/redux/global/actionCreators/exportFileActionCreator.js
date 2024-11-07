import {
  CLEAR_NOTIFICATION_STATE,
  FETCH_EXPORT_FILE_RECORD_ID_FAILURE,
  FETCH_EXPORT_FILE_RECORD_ID_REQUEST,
  FETCH_EXPORT_FILE_RECORD_ID_SUCCESS,
  FETCH_EXPORT_STATUS_FAILURE,
  FETCH_EXPORT_STATUS_REQUEST,
  FETCH_EXPORT_STATUS_SUCCESS,
  FETCH_UNREAD_NOTIFICATIONS_FAILURE,
  FETCH_UNREAD_NOTIFICATIONS_REQUEST,
  FETCH_UNREAD_NOTIFICATIONS_SUCCESS,
  MARK_NOTIFICATION_AS_READ_FAILURE,
  MARK_NOTIFICATION_AS_READ_REQUEST,
  MARK_NOTIFICATION_AS_READ_SUCCESS,
} from "../actionTypes";

export const fetchExportFileRecordIdRequest = () => ({
  type: FETCH_EXPORT_FILE_RECORD_ID_REQUEST,
});

export const fetchExportFileRecordIdSuccess = (data) => ({
  type: FETCH_EXPORT_FILE_RECORD_ID_SUCCESS,
  payload: data,
});

export const fetchExportFileRecordIdFailure = (error) => ({
  type: FETCH_EXPORT_FILE_RECORD_ID_FAILURE,
  payload: error,
});

export const fetchExportStatusRequest = () => ({
  type: FETCH_EXPORT_STATUS_REQUEST,
});

export const fetchExportStatusSuccess = (data) => ({
  type: FETCH_EXPORT_STATUS_SUCCESS,
  payload: data,
});

export const fetchExportStatusFailure = (error) => ({
  type: FETCH_EXPORT_STATUS_FAILURE,
  payload: error,
});

export const fetchUnreadNotificationsRequest = () => ({
  type: FETCH_UNREAD_NOTIFICATIONS_REQUEST,
});

export const fetchUnreadNotificationsSuccess = (data) => ({
  type: FETCH_UNREAD_NOTIFICATIONS_SUCCESS,
  payload: data,
});

export const fetchUnreadNotificationsFailure = (error) => ({
  type: FETCH_UNREAD_NOTIFICATIONS_FAILURE,
  payload: error,
});

export const markNotificationAsReadRequest = () => ({
  type: MARK_NOTIFICATION_AS_READ_REQUEST,
});

export const markNotificationAsReadSuccess = (data) => ({
  type: MARK_NOTIFICATION_AS_READ_SUCCESS,
  payload: data,
});

export const markNotificationAsReadFailure = (error) => ({
  type: MARK_NOTIFICATION_AS_READ_FAILURE,
  payload: error,
});

export const clearNotificationState = () => ({
  type: CLEAR_NOTIFICATION_STATE,
});
