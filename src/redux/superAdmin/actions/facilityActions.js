import { facilityEndPoints } from "constants/apiEndPoints";
import {
  fetchFacilityListFailure,
  fetchFacilityListRequest,
  fetchFacilityListSuccess,
  getUserDetailsFailure,
  getUserDetailsRequest,
  getUserDetailsSuccess,
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
  fetchFacilityStatusRequest,
  fetchFacilityStatusSuccess,
  fetchFacilityStatusFailure,
  updateFacilityStatusRequest,
  updateFacilityStatusSuccess,
  updateFacilityStatusFailure,
  assignFacilityRequest,
  assignFacilitySuccess,
  assignFacilityFailure,
  fetchFacilitiesDropdownRequest,
  fetchFacilitiesDropdownSuccess,
  fetchFacilitiesDropdownFailure,
  fetchFacilityMeasureReportListRequest,
  fetchFacilityMeasureReportListSuccess,
  fetchFacilityMeasureReportListFailure,
  fetchFacilityMeasureReportDetailsRequest,
  fetchFacilityMeasureReportDetailsSuccess,
  fetchFacilityMeasureReportDetailsFailure,
  updateFacilityMeasureReportRequest,
  updateFacilityMeasureReportSuccess,
  updateFacilityMeasureReportFailure,
  addFacilityMeasureReportRequest,
  addFacilityMeasureReportSuccess,
  addFacilityMeasureReportFailure,
  deleteFacilityMeasureReportRequest,
  deleteFacilityMeasureReportSuccess,
  deleteFacilityMeasureReportFailure,
  fetchFacilityDocumentListRequest,
  fetchFacilityDocumentListSuccess,
  fetchFacilityDocumentListFailure,
  fetchFacilityDocumentDetailsRequest,
  fetchFacilityDocumentDetailsSuccess,
  fetchFacilityDocumentDetailsFailure,
  addFacilityDocumentRequest,
  addFacilityDocumentSuccess,
  addFacilityDocumentFailure,
  updateFacilityDocumentRequest,
  updateFacilityDocumentSuccess,
  updateFacilityDocumentFailure,
  deleteFacilityDocumentRequest,
  deleteFacilityDocumentSuccess,
  deleteFacilityDocumentFailure,
  sendHelpReqForMeasureCategoryRequest,
  sendHelpReqForMeasureCategorySuccess,
  sendHelpReqForMeasureCategoryFailure,
} from "../actionCreators/facililityActionCreators";
import {
  DELETE_REQUEST,
  GET_REQUEST,
  PATCH_REQUEST,
  POST_REQUEST,
} from "utils/HTTPRequests";
import { USER_MANAGEMENT } from "constants/apiEndPoints";
import NotificationsToast from "../../../utils/notification/NotificationsToast.js";

export const fetchFacilityListing = (
  pageInfo,
  search = "",
  companyId,
  sortByCol,
  sortOrder
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityListRequest());
      let endpointWithParams = `${facilityEndPoints.FACILITY_LIST}/${
        (pageInfo.page - 1) * pageInfo.pageSize
      }/${pageInfo.pageSize}?search=${search}&company_id=${companyId}`;
      endpointWithParams += sortByCol ? `&col_name=${sortByCol}` : "";
      endpointWithParams += sortOrder ? `&order=${sortOrder}` : "";
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchUserDetails = (id = 0) => {
  return async (dispatch) => {
    try {
      dispatch(getUserDetailsRequest());
      dispatch({ type: "SHOW_LOADER", payload: true });
      const endpointWithParams = `${USER_MANAGEMENT.GET_USER_DETAILS}/${id}`;
      const response = await GET_REQUEST(endpointWithParams);
      dispatch({ type: "SHOW_LOADER", payload: false });
      const data = response.data;
      localStorage.setItem("selectedCompanyId", data?.user?.company_id || 0);
      dispatch(getUserDetailsSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(getUserDetailsFailure(error));
      dispatch({ type: "SHOW_LOADER", payload: false });
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
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
      NotificationsToast({
        message: "Facility Submited for Approval",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(submitFacilityForApprovalFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
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
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
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
      NotificationsToast({
        message: "Facility deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteFacilityFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const addFacilityCharacteristic = (characteristic) => {
  return async (dispatch) => {
    try {
      dispatch(addFacilityCharacteristicRequest());
      const endpoint = facilityEndPoints.ADD_FACILITY_CHARACTERISTIC;
      const response = await POST_REQUEST(endpoint, characteristic);
      const data = response.data;
      dispatch(addFacilityCharacteristicSuccess(data));
      // NotificationsToast({
      //   message: "Facility details added successfully!",
      //   type: "success",
      // });
    } catch (error) {
      console.error(error);
      dispatch(addFacilityCharacteristicFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
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
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
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
      // NotificationsToast({
      //   message: "Facility details updated successfully!",
      //   type: "success",
      // });
    } catch (error) {
      console.error(error);
      dispatch(updateFacilityCharacteristicFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchFacilityStatus = (facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityStatusRequest());
      const endpointWithParams = `${facilityEndPoints.GET_FACILITY_STATUS}/${facilityId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityStatusSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityStatusFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateFacilityStatus = (facilityId, status) => {
  return async (dispatch) => {
    try {
      dispatch(updateFacilityStatusRequest());
      const endpointWithParams = `${facilityEndPoints.UPDATE_FACILITY_STATUS}/${facilityId}`;
      const response = await PATCH_REQUEST(endpointWithParams, status);
      const data = response.data;
      dispatch(updateFacilityStatusSuccess(data));
      NotificationsToast({
        message: "Facility status updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(updateFacilityStatusFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const assignFacilities = (assignData) => {
  return async (dispatch) => {
    try {
      dispatch(assignFacilityRequest());
      const endpoint = facilityEndPoints.ASSIGN_FACILITIES;
      const response = await POST_REQUEST(endpoint, assignData);
      const data = response.data;
      dispatch(assignFacilitySuccess(data));
      NotificationsToast({
        message: "Facility assigned successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(assignFacilityFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchFacilitiesDropdown = (companyId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilitiesDropdownRequest());
      const endpointWithParams = `${facilityEndPoints.FACILITIES_DROPDOWN}?company_id=${companyId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilitiesDropdownSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilitiesDropdownFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchFacilityMeasureReportListing = (pageInfo, facilityId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityMeasureReportListRequest());
      let endpointWithParams = `${
        facilityEndPoints.GET_FACILITY_MEASURE_LIST
      }/${facilityId}/${(pageInfo.page - 1) * pageInfo.pageSize}/${
        pageInfo.pageSize
      }`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityMeasureReportListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityMeasureReportListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchFacilityMeasureReportDetails = (measureId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityMeasureReportDetailsRequest());
      const endpointWithParams = `${facilityEndPoints.GET_FACILITY_MEASURE_DETAILS}/${measureId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityMeasureReportDetailsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityMeasureReportDetailsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const addFacilityMeasureReport = (measureReport) => {
  return async (dispatch) => {
    try {
      dispatch(addFacilityMeasureReportRequest());
      const endpoint = facilityEndPoints.ADD_FACILITY_MEASURE;
      const response = await POST_REQUEST(endpoint, measureReport);
      const data = response.data;
      dispatch(addFacilityMeasureReportSuccess(data));
      NotificationsToast({
        message: "Measure report added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(addFacilityMeasureReportFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateFacilityMeasureReport = (
  measureId,
  updatedMeasureReport
) => {
  return async (dispatch) => {
    try {
      dispatch(updateFacilityMeasureReportRequest());
      const endpointWithParams = `${facilityEndPoints.UPDATE_FACILITY_MEASURE}/${measureId}`;
      const response = await PATCH_REQUEST(
        endpointWithParams,
        updatedMeasureReport
      );
      const data = response.data;
      dispatch(updateFacilityMeasureReportSuccess(data));
      NotificationsToast({
        message: "Measure report updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(updateFacilityMeasureReportFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteFacilityMeasureReport = (measureId) => {
  return async (dispatch) => {
    try {
      dispatch(deleteFacilityMeasureReportRequest());
      const endpointWithParams = `${facilityEndPoints.DELETE_FACILITY_MEASURE_REPORT}/${measureId}`;
      const response = await DELETE_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(deleteFacilityMeasureReportSuccess(data));
      NotificationsToast({
        message: "Measure report deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteFacilityMeasureReportFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchFacilityDocumentListing = (
  pageInfo,
  facilityId,
  docsFilter
) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityDocumentListRequest());
      let endpointWithParams = `${
        facilityEndPoints.GET_FACILITY_SAVING_DOCUMENT_LIST
      }/${facilityId}/${(pageInfo.page - 1) * pageInfo.pageSize}/${
        pageInfo.pageSize
      }`;
      endpointWithParams += docsFilter ? `?document_type=${docsFilter}` : "";
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityDocumentListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityDocumentListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const fetchFacilityDocumentDetails = (documentId) => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityDocumentDetailsRequest());
      const endpointWithParams = `${facilityEndPoints.GET_FACILITY_SAVING_DOCUMENT_DETAILS}/${documentId}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchFacilityDocumentDetailsSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityDocumentDetailsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const addFacilityDocument = (measureReport) => {
  return async (dispatch) => {
    try {
      dispatch(addFacilityDocumentRequest());
      const endpoint = facilityEndPoints.ADD_FACILITY_SAVING_DOCUMENT;
      const response = await POST_REQUEST(endpoint, measureReport);
      const data = response.data;
      dispatch(addFacilityDocumentSuccess(data));
      NotificationsToast({
        message: "Document added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(addFacilityDocumentFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateFacilityDocument = (measureId, updatedDocument) => {
  return async (dispatch) => {
    try {
      dispatch(updateFacilityDocumentRequest());
      const endpointWithParams = `${facilityEndPoints.UPDATE_FACILITY_SAVING_DOCUMENT}/${measureId}`;
      const response = await PATCH_REQUEST(endpointWithParams, updatedDocument);
      const data = response.data;
      dispatch(updateFacilityDocumentSuccess(data));
      NotificationsToast({
        message: "Document updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(updateFacilityDocumentFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteFacilityDocument = (documentId) => {
  return async (dispatch) => {
    try {
      dispatch(deleteFacilityDocumentRequest());
      const endpointWithParams = `${facilityEndPoints.DELETE_FACILITY_SAVING_DOCUMENT}/${documentId}`;
      const response = await DELETE_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(deleteFacilityDocumentSuccess(data));
      NotificationsToast({
        message: "Document deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteFacilityDocumentFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const sendHelpRequestForMeasure = (facility, measureData) => {
  return async (dispatch) => {
    try {
      dispatch(sendHelpReqForMeasureCategoryRequest());
      const endpointWithParams = `${facilityEndPoints.SEND_HELP_REQ_FOR_MEASURE_CATEGORY}/${facility}`;
      const response = await POST_REQUEST(endpointWithParams, measureData);
      const data = response.data;
      dispatch(sendHelpReqForMeasureCategorySuccess(data));
      NotificationsToast({
        message: "Help request sent successfully",
        type: "success",
      });
    } catch (error) {
      dispatch(sendHelpReqForMeasureCategoryFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
