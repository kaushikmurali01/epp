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
  calculatePerformanceReportRequest,
  calculatePerformanceReportSuccess,
  calculatePerformanceReportFailure,
  updatePerformanceReportRequest,
  updatePerformanceReportSuccess,
  updatePerformanceReportFailure,
  getPerformanceReportRequest,
  getPerformanceReportSuccess,
  getPerformanceReportFailure,
  scorePerformanceDataRequest,
  scorePerformanceDataSuccess,
  scorePerformanceDataFailure,
  getPerformanceDataMinMaxDateRequest,
  getPerformanceDataMinMaxDateSuccess,
  getPerformanceDataMinMaxDateFailure,
  getPerformanceDataVisualizationRequest,
  getPerformanceDataVisualizationSuccess,
  getPerformanceDataVisualizationFailure,
  fetchPerformanceDataSummaryListRequest,
  fetchPerformanceDataSummaryListSuccess,
  fetchPerformanceDataSummaryListFailure,
  fetchPerformanceDataRawSummaryMeterListRequest,
  fetchPerformanceDataRawSummaryMeterListSuccess,
  fetchPerformanceDataRawSummaryMeterListFailure,
} from "../actionCreators/performanceActionCreator";
import NotificationsToast from "utils/notification/NotificationsToast";
import { DELETE_REQUEST, GET_REQUEST, PATCH_REQUEST, POST_REQUEST } from "utils/HTTPRequests";

export const getBaselineDataSummary = (facility_id, meter_type) => {
  return async (dispatch) => {
    try {
      dispatch(getBaselineDataSummaryRequest());
      let endpointWithParams = `${PERFORMANCE_ENDPOINTS.GET_BASELINE_DATA_SUMMARY}?facility_id=${facility_id}&meter_type=${meter_type}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(getBaselineDataSummarySuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(getBaselineDataSummaryFailure(error));
      NotificationsToast({
        message: error?.response?.data?.error ? error.response?.data?.error : "Something went wrong!",
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

export const getNonRoutineEventList = (facilityId, meter_type, page, limit) => {
  return async (dispatch) => {
    try {
      dispatch(getNonRoutineEventListRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.GET_NON_ROUTINE_EVENT_LIST}/${facilityId}/${page}/${limit}?meter_type=${meter_type}`;
      const response = await GET_REQUEST(apiURL);
      dispatch(getNonRoutineEventListSuccess(response?.data?.data?.rows));
      return response?.data?.data;
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

export const scorePerformanceData = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(scorePerformanceDataRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.SCORE_PERFORMANCE_DATA}`;
      const response = await POST_REQUEST(apiURL, payload);
      dispatch(scorePerformanceDataSuccess(response?.data));
    } catch (error) {
      console.error(error);
      dispatch(scorePerformanceDataFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const calculatePerformanceReport = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(calculatePerformanceReportRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.CALCULATE_PERFORMANCE_REPORT}`;
      const response = await POST_REQUEST(apiURL, payload);
      dispatch(calculatePerformanceReportSuccess(response?.data));
    } catch (error) {
      console.error(error);
      dispatch(calculatePerformanceReportFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updatePerformanceReportInDB = (facility_id, payload) => {
  return async (dispatch) => {
    try {
      dispatch(updatePerformanceReportRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.UPDATE_PERFORMANCE_REPORT}/${facility_id}`;
      const response = await POST_REQUEST(apiURL, payload);
      dispatch(updatePerformanceReportSuccess(response));
    } catch (error) {
      console.error(error);
      dispatch(updatePerformanceReportFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getPerformanceReportFromDB = (
  facility_id,
  meter_type,
  performance_type
) => {
  return async (dispatch) => {
    try {
      dispatch(getPerformanceReportRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.GET_PERFORMANCE_REPORT}/${facility_id}/${meter_type}?performance_type=${performance_type}`;
      const response = await GET_REQUEST(apiURL);
      dispatch(getPerformanceReportSuccess(response?.data?.data));
    } catch (error) {
      console.error(error);
      dispatch(getPerformanceReportFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getPerformanceDataMinMaxDate = (facility_id, meter_type) => {
  return async (dispatch) => {
    try {
      dispatch(getPerformanceDataMinMaxDateRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.GET_PERFORMANCE_DATA_MIN_MAX_DATE}?facility_id=${facility_id}&meter_type=${meter_type}`;
      const response = await GET_REQUEST(apiURL);
      dispatch(getPerformanceDataMinMaxDateSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(getPerformanceDataMinMaxDateFailure(error));
      NotificationsToast({
        message: error?.response?.data?.error
          ? error.response?.data?.error
          : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const getPerformanceDataVisualization = (
  facility_id,
  meter_type
) => {
  return async (dispatch) => {
    try {
      dispatch(getPerformanceDataVisualizationRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.GET_PERFORMANCE_DATA_VISUALIZATION}`;
      const response = await GET_REQUEST(apiURL, facility_id, meter_type);
      dispatch(getPerformanceDataVisualizationSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(getPerformanceDataVisualizationFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchPerformanceDataSummaryList = (
  payload,
  summaryType
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchPerformanceDataSummaryListRequest());
      let endpointWithParams = `${PERFORMANCE_ENDPOINTS.FETCH_PERFORMANCE_DATA_SUMMARY}?facility_id=${payload.facility_id}&performance=1`;
      endpointWithParams += summaryType ? `&summary_type=${summaryType}` : "";
      if (payload.start_date) {
        endpointWithParams += `&min_date=${payload.start_date}`;
      }
      if (payload.end_date) {
        endpointWithParams += `&max_date=${payload.end_date}`;
      }
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchPerformanceDataSummaryListSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchPerformanceDataSummaryListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchPerformanceDataRawSummaryMeterList = (
  facilityId,
  summaryType,
  meterType,
  detail,
  meterId,
  bound,
  pageNumber,
  pageSize,
  min_date,
  max_date,
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchPerformanceDataRawSummaryMeterListRequest());
      let endpointWithParams = `${PERFORMANCE_ENDPOINTS.FETCH_PERFORMANCE_DATA_SUMMARY}?facility_id=${facilityId}&performance=1`;
      if (summaryType) {
        endpointWithParams += `&summary_type=${summaryType}`;
      }
      if (detail) {
        endpointWithParams += `&meter=${meterType}`;
      }
      if (detail) {
        endpointWithParams += `&detail=${detail}`;
      }
      endpointWithParams += `&meter_id=${meterId}`;
      if (bound) {
        endpointWithParams += `&bound=${bound}`;
      }
      if (pageNumber) {
        endpointWithParams += `&page_number=${pageNumber}`;
      }
      if (pageSize) {
        endpointWithParams += `&page_size=${pageSize}`;
      }
      if (min_date) {
        endpointWithParams += `&min_date=${min_date}`;
      }
      if (max_date) {
        endpointWithParams += `&max_date=${max_date}`;
      }
      const response = await GET_REQUEST(endpointWithParams);
      const data =
        typeof response.data == "object"
          ? response.data
          : JSON.parse(response.data.replaceAll(NaN, '"NaN"'));
      dispatch(fetchPerformanceDataRawSummaryMeterListSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchPerformanceDataRawSummaryMeterListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};