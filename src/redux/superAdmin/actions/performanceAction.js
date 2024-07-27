import { PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS, PERFORMANCE_ENDPOINTS } from "constants/apiEndPoints";
import {
  getBaselineDataSummaryFailure,
  getBaselineDataSummaryRequest,
  getBaselineDataSummarySuccess,
  createNonRoutineEventFailure,
  createNonRoutineEventRequest,
  createNonRoutineEventSuccess,
  getNonRoutineEventListFailure,
  getNonRoutineEventListRequest,
  getNonRoutineEventListSuccess,
  addNonRoutineEventDataFailure,
  addNonRoutineEventDataRequest,
  addNonRoutineEventDataSuccess,
  getNonRoutineEventDetailRequest,
  getNonRoutineEventDetailSuccess,
  getNonRoutineEventDetailFailure,
  deleteNonRoutineEventDataRequest,
  deleteNonRoutineEventDataSuccess,
  deleteNonRoutineEventRequest,
  deleteNonRoutineEventSuccess,
  deleteNonRoutineEventFailure,
  deleteNonRoutineEventDataFailure,
  editNonRoutineEventFailure,
  editNonRoutineEventRequest,
  editNonRoutineEventSuccess,
  editNonRoutineEventDataRequest,
  editNonRoutineEventDataSuccess,
  editNonRoutineEventDataFailure,
} from "../actionCreators/performanceActionCreator";
import NotificationsToast from "utils/notification/NotificationsToast";
import { DELETE_REQUEST, GET_REQUEST, PATCH_REQUEST, POST_REQUEST } from "utils/HTTPRequests";

export const getBaselineDataSummary = (
  summaryBody,
) => {
  return async (dispatch) => {
    try {
      dispatch(getBaselineDataSummaryRequest());
      let endpointWithParams = `${PERFORMANCE_ENDPOINTS.GET_BASELINE_DATA_SUMMARY}`;
      const response = await POST_REQUEST(endpointWithParams, summaryBody);
      const data = response.data;
      dispatch(getBaselineDataSummarySuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(getBaselineDataSummaryFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const addNonRoutineEvent = (nonRoutinePayload) => {
  return async (dispatch) => {
    try {
      dispatch(createNonRoutineEventRequest());
      let apiUrl = PERFORMANCE_ENDPOINTS.ADD_NON_ROUTINE_EVENT;
      const response = await POST_REQUEST(apiUrl, nonRoutinePayload);
      dispatch(createNonRoutineEventSuccess(response?.data));
      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(createNonRoutineEventFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getNonRoutineEventList = (facilityId) => { 
  return async (dispatch) => { 
    try {
      dispatch(getNonRoutineEventListRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.GET_NON_ROUTINE_EVENT_LIST}/${facilityId}/0/10`;
      const response = await GET_REQUEST(apiURL);
      dispatch(getNonRoutineEventListSuccess(response?.data?.data?.rows));
      return (response?.data?.data?.rows);
    } catch (error) {
      console.error(error);
      dispatch(getNonRoutineEventListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const addNonRoutineEventData = (nonRoutineDataPayload) => {
  return async (dispatch) => {
    try {
      dispatch(addNonRoutineEventDataRequest());
      let apiUrl = PERFORMANCE_ENDPOINTS.ADD_NON_ROUTINE_EVENT_DATA;
      const response = await POST_REQUEST(apiUrl, nonRoutineDataPayload);
      dispatch(addNonRoutineEventDataSuccess(response?.data));
      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(addNonRoutineEventDataFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getNonRoutineEventDetails = (eventId) => {
  return async (dispatch) => {
    try {
      dispatch(getNonRoutineEventDetailRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.GET_NON_ROUTINE_EVENT_DETAIL}/${eventId}`;
      const response = await GET_REQUEST(apiURL);
      const data = response?.data?.data;
      dispatch(getNonRoutineEventDetailSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(getNonRoutineEventDetailFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteNonRoutineEvent = (eventId) => {
  return async (dispatch) => {
    try {
      dispatch(deleteNonRoutineEventRequest());
      let apiUrl = PERFORMANCE_ENDPOINTS.DELETE_NON_ROUTINE_EVENT;
      const response = await DELETE_REQUEST(`${apiUrl}/${eventId}`);
      dispatch(deleteNonRoutineEventSuccess(response.data))
      NotificationsToast({
        message: response?.message
          ? response.message
          : "Non routine event deleted successfully.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteNonRoutineEventFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteNonRoutineEventData = (data_entry_id) => {
  return async (dispatch) => {
    try {
      dispatch(deleteNonRoutineEventDataRequest());
      let apiUrl = PERFORMANCE_ENDPOINTS.DELETE_NON_ROUTINE_EVENT_DATA;
      const response = await DELETE_REQUEST(`${apiUrl}/${data_entry_id}`);
      dispatch(deleteNonRoutineEventDataSuccess(response.data))
      NotificationsToast({
        message: response?.message
          ? response.message
          : "Non routine event data deleted successfully.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteNonRoutineEventDataFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateNonRoutineEvent = (eventId, payload) => {
  return async (dispatch) => { 
    try {
      dispatch(editNonRoutineEventRequest);
      let apiURL = `${PERFORMANCE_ENDPOINTS.EDIT_NON_ROUTINE_EVENT}/${eventId}`;
      const response = await PATCH_REQUEST(apiURL, payload);
      dispatch(editNonRoutineEventSuccess(response?.data));
    } catch (error) {
      console.error(error);
      dispatch(editNonRoutineEventFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateNonRoutineEventData = (eventId, payload) => {
  return async (dispatch) => {
    try {
      dispatch(editNonRoutineEventDataRequest);
      let apiURL = `${PERFORMANCE_ENDPOINTS.EDIT_NON_ROUTINE_EVENT}/${eventId}`;
      const response = await PATCH_REQUEST(apiURL, payload);
      dispatch(editNonRoutineEventDataSuccess(response?.data));
    } catch (error) {
      console.error(error);
      dispatch(editNonRoutineEventDataFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};