import { facilityEndPoints } from "constants/apiEndPoints";
import {
  fetchFacilityListFailure,
  fetchFacilityListRequest,
  fetchFacilityListSuccess,
  submitFacilityForApprovalRequest,
  submitFacilityForApprovalSuccess,
  submitFacilityForApprovalFailure,
  fetchFacilityDetailsRequest,
  fetchFacilityDetailsSuccess,
  fetchFacilityDetailsFailure,
} from "../actionCreators/facililityActionCreators";
import { GET_REQUEST, POST_REQUEST } from "utils/HTTPRequests";

export const fetchFacilityListing = (pageInfo) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityListRequest());
      const endpointWithParams = `${facilityEndPoints.FACILITY_LIST}/${
        (pageInfo.page - 1) * pageInfo.pageSize
      }/${pageInfo.pageSize}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityListFailure(error));
    }
  };
};

export const submitFacilityForApproval = (facility) => {
  return async (dispatch) => {
    try {
      dispatch(submitFacilityForApprovalRequest());
      const endpointWithParams = `${facilityEndPoints.SUBMIT_FACILITY_FOR_APPROVAL}/${facility}`;
      const response = await POST_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(submitFacilityForApprovalSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(submitFacilityForApprovalFailure(error));
    }
  };
};

export const fetchFacilityDetails = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityDetailsRequest());
      const endpointWithParams = `${facilityEndPoints.GET_FACILITY_DETAILS}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityDetailsSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityDetailsFailure(error));
    }
  };
};
