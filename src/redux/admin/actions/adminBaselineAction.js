import { GET_REQUEST, PATCH_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import {
  fetchAdminBaselinePeriodFailure,
  fetchAdminBaselinePeriodRequest,
  fetchAdminBaselinePeriodSuccess,
  fetchAdminStationsDetailsFailure,
  fetchAdminStationsDetailsRequest,
  fetchAdminStationsDetailsSuccess,
  adminIndependentVariableListFailure,
  adminIndependentVariableListRequest,
  adminIndependentVariableListSuccess,
  adminSufficiencyCheckFailure,
  adminSufficiencyCheckRequest,
  adminSufficiencyCheckSuccess,
  fetchAdminBaselineListDbFailure,
  fetchAdminBaselineListDbSuccess,
  fetchAdminBaselineListDbRequest,
  fetchAdminIssueDetailsRequest,
  fetchAdminIssueDetailsSuccess,
  fetchAdminIssueDetailsFailure,
  fetchAdminBaselineDetailsDbRequest,
  fetchAdminBaselineDetailsDbSuccess,
  fetchAdminBaselineDetailsDbFailure,
  updateAdminBaselineDetailsDbRequest,
  updateAdminBaselineDetailsDbSuccess,
  updateAdminBaselineDetailsDbFailure,
  adminAddBaselineDbRequest,
  adminAddBaselineDbSuccess,
  adminAddBaselineDbFailure,
  adminAddAssigneeToBaselineDbRequest,
  adminAddAssigneeToBaselineDbSuccess,
  adminAddAssigneeToBaselineDbFailure,
  submitAdminRejectBaselineDbRequest,
  submitAdminRejectBaselineDbSuccess,
  submitAdminRejectBaselineDbFailure,
  showAdminObserveDataRequest,
  showAdminObserveDataSuccess,
  showAdminObserveDataFailure,
  submitAdminBaselineDtRequest,
  submitAdminBaselineDtSuccess,
  submitAdminBaselineDtFailure,
  clearAdminBaselineState,
  fetchAdminDataExplorationSummaryListRequest,
  fetchAdminDataExplorationSummaryListSuccess,
  fetchAdminDataExplorationSummaryListFailure,
  fetchAdminRawSummaryMeterListRequest,
  fetchAdminRawSummaryMeterListSuccess,
  fetchAdminRawSummaryMeterListFailure,
  fetchAdminOutliersSettingsRequest,
  fetchAdminOutliersSettingsSuccess,
  fetchAdminOutliersSettingsFailure,
  fetchFacilityThresholdSuccess,
  fetchFacilityThresholdFailure,
  fetchFacilityThresholdRequest,
  updateFacilityThresholdRequest,
  updateFacilityThresholdSuccess,
  updateFacilityThresholdFailure,
  fetchAdminBaselinePredictedDataRequest,
  fetchAdminBaselinePredictedDataSuccess,
  fetchAdminBaselinePredictedDataFailure,
} from "../actionCreators/adminBaselineActionCreators";
import NotificationsToast from "utils/notification/NotificationsToast";
import { BASELINE_ENDPOINTS } from "constants/apiEndPoints";

export const adminSufficiencyCheck = (adminSufficiencyParameters) => {
  return async (dispatch) => {
    try {
      dispatch(adminSufficiencyCheckRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.CHECK_SUFFICIENCY}`;
      const response = await POST_REQUEST(
        endpointWithParams,
        adminSufficiencyParameters
      );
      const data = response.data;
      dispatch(adminSufficiencyCheckSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(adminSufficiencyCheckFailure(error));
      NotificationsToast({
        message: error?.response?.data
          ? error.response.data.error
          : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const fetchAdminIndependentVariableList = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(adminIndependentVariableListRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.INDEPENDENT_VARIABLE}?facility_id=${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(adminIndependentVariableListSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(adminIndependentVariableListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminBaselinePeriod = (facilityId, meterType) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminBaselinePeriodRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.BASELINE_PERIOD}?facility_id=${facilityId}&meter_type=${meterType}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminBaselinePeriodSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminBaselinePeriodFailure(error));
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

export const fetchAdminStationsDetails = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminStationsDetailsRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.STATION_DETAILS}?facility_id=${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminStationsDetailsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminStationsDetailsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminIssueDetails = (facilityId, meterType) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminIssueDetailsRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.CHECK_ISSUES_DETAILS}?facility_id=${facilityId}&meterType=${meterType}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminIssueDetailsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminIssueDetailsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const adminAddBaselineToDb = (facilityId, baselineData) => {
  return async (dispatch) => {
    try {
      dispatch(adminAddBaselineDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.ADD_BASELINE_DB}/${facilityId}`;
      const response = await POST_REQUEST(endpointWithParams, baselineData);
      const data = response.data;
      dispatch(adminAddBaselineDbSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(adminAddBaselineDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminBaselineDetailsFromDb = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminBaselineDetailsDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.FETCH_BASELINE_DB}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminBaselineDetailsDbSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminBaselineDetailsDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const updateAdminBaselineInDb = (baselineId, baselineData) => {
  return async (dispatch) => {
    try {
      dispatch(updateAdminBaselineDetailsDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.UPDATE_BASELINE_DB}/${baselineId}`;
      const response = await PATCH_REQUEST(endpointWithParams, baselineData);
      const data = response.data;
      dispatch(updateAdminBaselineDetailsDbSuccess(data));
      NotificationsToast({
        message: "Baseline calculated successfully",
        type: "success",
      });
      return data;
    } catch (error) {
      console.error(error);
      dispatch(updateAdminBaselineDetailsDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const fetchAdminBaselineListFromDb = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminBaselineListDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.FETCH_BASELINE_LIST_DB}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminBaselineListDbSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminBaselineListDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const adminAddAssigneeToBaselineDb = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(adminAddAssigneeToBaselineDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.ADD_ASSIGNEE_DB}/${facilityId}`;
      const response = await PATCH_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(adminAddAssigneeToBaselineDbSuccess(data));
      NotificationsToast({
        message: "Assignee added successfully",
        type: "success",
      });
      return data;
    } catch (error) {
      console.error(error);
      dispatch(adminAddAssigneeToBaselineDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const submitAdminRejectedBaselineDB = (facilityId, body) => {
  return async (dispatch) => {
    try {
      dispatch(submitAdminRejectBaselineDbRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.SUBMIT_REJECTED_BASELINE_DB}/${facilityId}`;
      const response = await PATCH_REQUEST(endpointWithParams, body);
      const data = response.data;
      dispatch(submitAdminRejectBaselineDbSuccess(data));
      NotificationsToast({
        message:
          body?.status === "SUBMITTED"
            ? "Baseline approved successfully"
            : "Baseline rejected successfully",
        type: "success",
      });
      return data;
    } catch (error) {
      console.error(error);
      dispatch(submitAdminRejectBaselineDbFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const showAdminObserveData = (observeData) => {
  return async (dispatch) => {
    try {
      dispatch(showAdminObserveDataRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.SHOW_OBSERVE_DATA_LIST}`;
      const response = await POST_REQUEST(endpointWithParams, observeData);
      const data = response.data;
      dispatch(showAdminObserveDataSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(showAdminObserveDataFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const submitAdminBaselineDt = (baselineParameters) => {
  return async (dispatch) => {
    try {
      dispatch(submitAdminBaselineDtRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.SUBMIT_BASELINE_D_T}`;
      const response = await POST_REQUEST(
        endpointWithParams,
        baselineParameters
      );
      const data = response.data;
      dispatch(submitAdminBaselineDtSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(submitAdminBaselineDtFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const fetchAdminDataExplorationSummaryList = (
  facilityId,
  summaryType
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminDataExplorationSummaryListRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.FETCH_DATA_EXPLORATION_SUMMARY}?facility_id=${facilityId}`;
      endpointWithParams += summaryType ? `&summary_type=${summaryType}` : "";
      const response = await GET_REQUEST(endpointWithParams);
      const data =
        typeof response.data == "object"
          ? response.data
          : JSON.parse(response.data.replaceAll(NaN, '"NaN"'));
      dispatch(fetchAdminDataExplorationSummaryListSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminDataExplorationSummaryListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminRawSummaryMeterList = (
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
      dispatch(fetchAdminRawSummaryMeterListRequest());
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
      // if (min_date) {
      //   endpointWithParams += `&min_date=${min_date}`;
      // }
      // if (max_date) {
      //   endpointWithParams += `&max_date=${max_date}`;
      // }
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
      dispatch(fetchAdminRawSummaryMeterListSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminRawSummaryMeterListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminOutliersSettingsData = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminOutliersSettingsRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.FETCH_OUTLIERS_SETTING}?facility_id=${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      console.log(response);
      dispatch(fetchAdminOutliersSettingsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminOutliersSettingsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchFacilityThresholdData = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityThresholdRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.FACILITY_THRESHOLD}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      console.log(response);
      dispatch(fetchFacilityThresholdSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityThresholdFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateFacilityThresholdData = (facilityId, thresholdData) => {
  return async (dispatch) => {
    try {
      dispatch(updateFacilityThresholdRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.FACILITY_THRESHOLD}/${facilityId}`;
      const response = await POST_REQUEST(endpointWithParams, thresholdData);
      const data = response.data;
      dispatch(updateFacilityThresholdSuccess(data));
      NotificationsToast({
        message: "Threshold data updated successfully",
        type: "success",
      });
      return data;
    } catch (error) {
      console.error(error);
      dispatch(updateFacilityThresholdFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const fetchAdminBaselinePredictedData = (
  facilityId,
  meterType,
  _interface,
  page_size,
  page_number
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminBaselinePredictedDataRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.GET_PREDICTED_DATA}?facility_id=${facilityId}&meter_type=${meterType}&interface=${_interface}&page_size=${page_size}&page_number=${page_number}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminBaselinePredictedDataSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminBaselinePredictedDataFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const clearAdminBaselineStateAction = () => (dispatch) => {
  dispatch(clearAdminBaselineState());
};
