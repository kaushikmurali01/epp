import { PERFORMANCE_ENDPOINTS } from "constants/apiEndPoints";
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
} from "../actionCreators/performanceActionCreator";
import NotificationsToast from "utils/notification/NotificationsToast";
import { GET_REQUEST, POST_REQUEST } from "utils/HTTPRequests";

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
      dispatch(getNonRoutineEventListSuccess(response?.data));
      console.log(response.data);
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
