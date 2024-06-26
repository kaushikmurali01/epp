import { GET_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
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
} from "../actionCreators/adminBaselineActionCreators";
import NotificationsToast from "utils/notification/NotificationsToast";
import { BASELINE_ENDPOINTS } from "constants/apiEndPoints";

export const adminSufficiencyCheck = (adminSufficiencyParameters) => {
  return async (dispatch) => {
    try {
      dispatch(adminSufficiencyCheckRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.CHECK_SUFFICIENCY}`;
      const formData = new FormData();
      formData.append("start_date", adminSufficiencyParameters.start_date);
      formData.append("end_date", adminSufficiencyParameters.end_date);
      formData.append("granularity", adminSufficiencyParameters.granularity);
      formData.append("facility_id", adminSufficiencyParameters.facility_id);
      formData.append("created_by", adminSufficiencyParameters.created_by);
      const response = await POST_REQUEST(
        endpointWithParams,
        adminSufficiencyParameters,
        true,
        ""
      );
      const data = response.data;
      dispatch(adminSufficiencyCheckSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(adminSufficiencyCheckFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchAdminIndependentVariableList = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(adminIndependentVariableListRequest());
      const endpointWithParams = `${BASELINE_ENDPOINTS.INDEPENDENT_VARIABLE}/${facilityId}`;
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

export const fetchAdminBaselinePeriod = (facilityId, createdBy) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminBaselinePeriodRequest());
      let endpointWithParams = `${BASELINE_ENDPOINTS.BASELINE_PERIOD}?facility_id=${facilityId}&created_by=${createdBy}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminBaselinePeriodSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminBaselinePeriodFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
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
