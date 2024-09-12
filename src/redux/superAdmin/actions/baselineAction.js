import { GET_REQUEST, PATCH_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import {
  addAssigneeToBaselineDbFailure,
  addAssigneeToBaselineDbRequest,
  addAssigneeToBaselineDbSuccess,
  addBaselineDbFailure,
  addBaselineDbRequest,
  addBaselineDbSuccess,
  clearBaselineState,
  fetchBaselineDetailsDbFailure,
  fetchBaselineDetailsDbRequest,
  fetchBaselineDetailsDbSuccess,
  fetchBaselineListDbFailure,
  fetchBaselineListDbRequest,
  fetchBaselineListDbSuccess,
  fetchBaselinePeriodFailure,
  fetchBaselinePeriodRequest,
  fetchBaselinePeriodSuccess,
  fetchDataExplorationSummaryListFailure,
  fetchDataExplorationSummaryListRequest,
  fetchDataExplorationSummaryListSuccess,
  fetchIssueDetailsFailure,
  fetchIssueDetailsRequest,
  fetchIssueDetailsSuccess,
  fetchOutliersSettingsFailure,
  fetchOutliersSettingsRequest,
  fetchOutliersSettingsSuccess,
  fetchRawSummaryMeterListFailure,
  fetchRawSummaryMeterListRequest,
  fetchRawSummaryMeterListSuccess,
  fetchStationsDetailsFailure,
  fetchStationsDetailsRequest,
  fetchStationsDetailsSuccess,
  independentVariableListFailure,
  independentVariableListRequest,
  independentVariableListSuccess,
  showObserveDataFailure,
  showObserveDataRequest,
  showObserveDataSuccess,
  submitBaselineDtFailure,
  submitBaselineDtRequest,
  submitBaselineDtSuccess,
  submitRejectBaselineDbFailure,
  submitRejectBaselineDbRequest,
  submitRejectBaselineDbSuccess,
  sufficiencyCheckFailure,
  sufficiencyCheckRequest,
  sufficiencyCheckSuccess,
  updateBaselineDetailsDbFailure,
  updateBaselineDetailsDbRequest,
  updateBaselineDetailsDbSuccess,
} from "../actionCreators/baselineActionCreators";
import NotificationsToast from "utils/notification/NotificationsToast";
import { BASELINE_ENDPOINTS } from "constants/apiEndPoints";
import { ReceiptRounded } from "@mui/icons-material";

export const SufficiencyCheck = (sufficiencyParameters) => {
  return async (dispatch) => {
    try {
      dispatch(sufficiencyCheckRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.CHECK_SUFFICIENCY}`;
      const response = await POST_REQUEST(
        endpointWithParams,
        sufficiencyParameters
      );
      const data = response.data;
      dispatch(sufficiencyCheckSuccess(data));
      return data;
    } catch (error) {
      console.log(error.message);
      dispatch(sufficiencyCheckFailure(error));
      NotificationsToast({
        message:
          error?.message === "Request failed with status code 500"
            ? error?.message
            : error?.response?.data?.error,
        type: "error",
      });
      throw error;
    }
  };
};

export const fetchIndependentVariableList = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(independentVariableListRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.INDEPENDENT_VARIABLE}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(independentVariableListSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(independentVariableListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchBaselinePeriod = (facilityId, meterType) => {
  return async (dispatch) => {
    try {
      dispatch(fetchBaselinePeriodRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.BASELINE_PERIOD}?facility_id=${facilityId}&meter_type=${meterType}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchBaselinePeriodSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchBaselinePeriodFailure(error));
      NotificationsToast({
        message:
          error?.response?.status >= 400
            ? error?.response?.data?.error
            : error?.message,
        type: "error",
      });
      throw error;
    }
  };
};

export const fetchStationsDetails = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchStationsDetailsRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.STATION_DETAILS}?facility_id=${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchStationsDetailsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchStationsDetailsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchIssueDetails = (issueParameter) => {
  return async (dispatch) => {
    try {
      dispatch(fetchIssueDetailsRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.CHECK_ISSUES_DETAILS}`;
      const response = await POST_REQUEST(endpointWithParams, issueParameter);
      const data = response.data;
      dispatch(fetchIssueDetailsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchIssueDetailsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const addBaselineToDb = (facilityId, baselineData) => {
  return async (dispatch) => {
    try {
      dispatch(addBaselineDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.ADD_BASELINE_DB}/${facilityId}`;
      const response = await POST_REQUEST(endpointWithParams, baselineData);
      const data = response.data;
      dispatch(addBaselineDbSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(addBaselineDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchBaselineDetailsFromDb = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchBaselineDetailsDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.FETCH_BASELINE_DB}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchBaselineDetailsDbSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchBaselineDetailsDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const updateBaselineInDb = (baselineId, baselineData) => {
  return async (dispatch) => {
    try {
      dispatch(updateBaselineDetailsDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.UPDATE_BASELINE_DB}/${baselineId}`;
      const response = await PATCH_REQUEST(endpointWithParams, baselineData);
      const data = response.data;
      dispatch(updateBaselineDetailsDbSuccess(data));
      NotificationsToast({
        message: "Baseline calculated successfully",
        type: "success",
      });
      return data;
    } catch (error) {
      console.error(error);
      dispatch(updateBaselineDetailsDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchBaselineListFromDb = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchBaselineListDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.FETCH_BASELINE_LIST_DB}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchBaselineListDbSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchBaselineListDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const addAssigneeToBaselineDb = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(addAssigneeToBaselineDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.ADD_ASSIGNEE_DB}/${facilityId}`;
      const response = await PATCH_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(addAssigneeToBaselineDbSuccess(data));
      NotificationsToast({
        message: "Assignee added successfully",
        type: "success",
      });
      return data;
    } catch (error) {
      console.error(error);
      dispatch(addAssigneeToBaselineDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const submitRejectedBaselineDB = (facilityId, dataBody) => {
  return async (dispatch) => {
    try {
      dispatch(submitRejectBaselineDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.SUBMIT_REJECTED_BASELINE_DB}/${facilityId}`;
      const response = await PATCH_REQUEST(endpointWithParams, dataBody);
      const data = response.data;
      dispatch(submitRejectBaselineDbSuccess(data));
      NotificationsToast({
        message: "Help request sent successfully",
        type: "success",
      });
      return data;
    } catch (error) {
      console.error(error);
      dispatch(submitRejectBaselineDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const showObserveData = (observeData) => {
  return async (dispatch) => {
    try {
      dispatch(showObserveDataRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.SHOW_OBSERVE_DATA_LIST}`;
      const response = await POST_REQUEST(endpointWithParams, observeData);
      const data = response.data;
      dispatch(showObserveDataSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(showObserveDataFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const submitBaselineDt = (baselineParameters) => {
  return async (dispatch) => {
    try {
      dispatch(submitBaselineDtRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.SUBMIT_BASELINE_D_T}`;
      const response = await POST_REQUEST(
        endpointWithParams,
        baselineParameters
      );
      const data = response.data;
      dispatch(submitBaselineDtSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(submitBaselineDtFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const fetchDataExplorationSummaryList = (
  facilityId,
  summaryType,
  page,
  pageSize
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchDataExplorationSummaryListRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.FETCH_DATA_EXPLORATION_SUMMARY}?facility_id=${facilityId}`;
      endpointWithParams += summaryType ? `&summary_type=${summaryType}` : "";
      const response = await GET_REQUEST(endpointWithParams);
      const data =
        typeof response.data == "object"
          ? response.data
          : JSON.parse(response.data.replaceAll(NaN, '"NaN"'));
      dispatch(fetchDataExplorationSummaryListSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchDataExplorationSummaryListFailure(error));
      NotificationsToast({
        message: error?.response?.data?.error
          ? error?.response?.data?.error
          : error.message,
        type: "error",
      });
      throw error;
    }
  };
};

export const fetchRawSummaryMeterList = (
  facilityId,
  summaryType,
  meterType,
  detail,
  meterId,
  min_date,
  max_date,
  bound,
  pageNumber,
  pageSize
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchRawSummaryMeterListRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.FETCH_DATA_EXPLORATION_SUMMARY}?facility_id=${facilityId}`;
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
      if (min_date) {
        endpointWithParams += `&min_date=${min_date}`;
      }
      if (max_date) {
        endpointWithParams += `&max_date=${max_date}`;
      }
      if (bound) {
        endpointWithParams += `&bound=${bound}`;
      }
      if (pageNumber) {
        endpointWithParams += `&page_number=${pageNumber}`;
      }
      if (pageSize) {
        endpointWithParams += `&page_size=${pageSize}`;
      }
      const response = await GET_REQUEST(endpointWithParams);
      const data =
        typeof response.data == "object"
          ? response.data
          : JSON.parse(response.data.replaceAll(NaN, '"NaN"'));
      dispatch(fetchRawSummaryMeterListSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchRawSummaryMeterListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchOutliersSettingsData = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchOutliersSettingsRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.FETCH_OUTLIERS_SETTING}?facility_id=${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      console.log(response);
      dispatch(fetchOutliersSettingsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchOutliersSettingsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const clearBaselineStateAction = () => (dispatch) => {
  dispatch(clearBaselineState());
};
