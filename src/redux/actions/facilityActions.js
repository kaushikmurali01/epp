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
  deleteFacilityRequest,
  deleteFacilitySuccess,
  deleteFacilityFailure,
  addFacilityCharacteristicRequest,
  addFacilityCharacteristicSuccess,
  addFacilityCharacteristicFailure,
  fetchFacilityCharacteristicsRequest,
  fetchFacilityCharacteristicsSuccess,
  fetchFacilityCharacteristicsFailure,
  updateFacilityCharacteristicRequest,
  updateFacilityCharacteristicSuccess,
  updateFacilityCharacteristicFailure,
} from "../actionCreators/facililityActionCreators";
import {
  DELETE_REQUEST,
  GET_REQUEST,
  PATCH_REQUEST,
  POST_REQUEST,
} from "utils/HTTPRequests";

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

export const deleteFacility = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(deleteFacilityRequest());
      const endpointWithParams = `${facilityEndPoints.DELETE_FACILITY}/${facilityId}`;
      const response = await DELETE_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(deleteFacilitySuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(deleteFacilityFailure(error));
    }
  };
};

export const addFacilityCharacteristic = (facilityId, characteristic) => {
  return async (dispatch) => {
    try {
      dispatch(addFacilityCharacteristicRequest());
      const endpointWithParams = `${facilityEndPoints.ADD_FACILITY_CHARACTERISTIC}/${facilityId}`;
      const response = await POST_REQUEST(endpointWithParams, characteristic);
      const data = response.data;
      dispatch(addFacilityCharacteristicSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(addFacilityCharacteristicFailure(error));
    }
  };
};

export const fetchFacilityCharacteristics = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityCharacteristicsRequest());
      const endpointWithParams = `${facilityEndPoints.GET_FACILITY_CHARACTERISTIC}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityCharacteristicsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityCharacteristicsFailure(error));
    }
  };
};

export const updateFacilityCharacteristic = (facilityId, characteristic) => {
  return async (dispatch) => {
    try {
      dispatch(updateFacilityCharacteristicRequest());
      const endpointWithParams = `${facilityEndPoints.UPDATE_FACILITY_CHARACTERISTIC}/${facilityId}`;
      const response = await PATCH_REQUEST(endpointWithParams, characteristic);
      const data = response.data;
      dispatch(updateFacilityCharacteristicSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(updateFacilityCharacteristicFailure(error));
    }
  };
};
