import { GET_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import {
  fetchBaselinePeriodFailure,
  fetchBaselinePeriodRequest,
  fetchBaselinePeriodSuccess,
  fetchStationsDetailsFailure,
  fetchStationsDetailsRequest,
  fetchStationsDetailsSuccess,
  independentVariableListFailure,
  independentVariableListRequest,
  independentVariableListSuccess,
  sufficiencyCheckFailure,
  sufficiencyCheckRequest,
  sufficiencyCheckSuccess,
} from "../actionCreators/baselineActionCreators";
import NotificationsToast from "utils/notification/NotificationsToast";
import { BASELINE_ENDPOINTS } from "constants/apiEndPoints";

export const SufficiencyCheck = (sufficiencyParameters) => {
  return async (dispatch) => {
    try {
      dispatch(sufficiencyCheckRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.CHECK_SUFFICIENCY}`;
      const formData = new FormData();
      formData.append("start_date", sufficiencyParameters.start_date);
      formData.append("end_date", sufficiencyParameters.end_date);
      formData.append("granularity", sufficiencyParameters.granularity);
      formData.append("facility_id", sufficiencyParameters.facility_id);
      formData.append("created_by", sufficiencyParameters.created_by);
      const response = await POST_REQUEST(
        endpointWithParams,
        sufficiencyParameters,
        true,
        ""
      );
      const data = response.data;
      dispatch(sufficiencyCheckSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(sufficiencyCheckFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
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

export const fetchBaselinePeriod = (facilityId, createdBy) => {
  return async (dispatch) => {
    try {
      dispatch(fetchBaselinePeriodRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.BASELINE_PERIOD}?facility_id=${facilityId}&created_by=${createdBy}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchBaselinePeriodSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchBaselinePeriodFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchStationsDetails = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchStationsDetailsRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.STATION_DETAILS}?facilityId=${facilityId}`;
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
