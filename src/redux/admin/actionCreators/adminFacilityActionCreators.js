import {
  ADD_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  ADD_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
  ADD_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  DELETE_ADMIN_FACILITY_FAILURE,
  DELETE_ADMIN_FACILITY_REQUEST,
  DELETE_ADMIN_FACILITY_SUCCESS,
  FETCH_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  FETCH_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
  FETCH_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  FETCH_ADMIN_FACILITY_DETAILS_FAILURE,
  FETCH_ADMIN_FACILITY_DETAILS_REQUEST,
  FETCH_ADMIN_FACILITY_DETAILS_SUCCESS,
  FETCH_ADMIN_FACILITY_LIST_FAILURE,
  FETCH_ADMIN_FACILITY_LIST_REQUEST,
  FETCH_ADMIN_FACILITY_LIST_SUCCESS,
  FETCH_ADMIN_FACILITY_LIST_ACTIVE_SUCCESS,
  FETCH_ADMIN_FACILITY_LIST_ACTIVE_REQUEST,
  FETCH_ADMIN_FACILITY_LIST_ACTIVE_FAILURE,
  FETCH_ADMIN_FACILITY_STATUS_FAILURE,
  FETCH_ADMIN_FACILITY_STATUS_REQUEST,
  FETCH_ADMIN_FACILITY_STATUS_SUCCESS,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  UPDATE_ADMIN_FACILITY_STATUS_FAILURE,
  UPDATE_ADMIN_FACILITY_STATUS_REQUEST,
  UPDATE_ADMIN_FACILITY_STATUS_SUCCESS,
  ADMIN_ASSIGN_FACILITIES_REQUEST,
  ADMIN_ASSIGN_FACILITIES_SUCCESS,
  ADMIN_ASSIGN_FACILITIES_FAILURE,
  FETCH_ADMIN_FACILITIES_DROPDOWN_REQUEST,
  FETCH_ADMIN_FACILITIES_DROPDOWN_SUCCESS,
  FETCH_ADMIN_FACILITIES_DROPDOWN_FAILURE,
  FETCH_ADMIN_STATISTICS_REQUEST,
  FETCH_ADMIN_STATISTICS_SUCCESS,
  FETCH_ADMIN_STATISTICS_FAILURE,
  DOWNLOAD_FACILITIES_BULK_REQUEST,
  DOWNLOAD_FACILITIES_BULK_SUCCESS,
  DOWNLOAD_FACILITIES_BULK_FAILURE,
  DOWNLOAD_FACILITY_ROW_REQUEST,
  DOWNLOAD_FACILITY_ROW_SUCCESS,
  DOWNLOAD_FACILITY_ROW_FAILURE,
  DELETE_ADMIN_FACILITY_DOCUMENT_FAILURE,
  DELETE_ADMIN_FACILITY_DOCUMENT_SUCCESS,
  DELETE_ADMIN_FACILITY_DOCUMENT_REQUEST,
  UPDATE_ADMIN_FACILITY_DOCUMENT_FAILURE,
  UPDATE_ADMIN_FACILITY_DOCUMENT_SUCCESS,
  UPDATE_ADMIN_FACILITY_DOCUMENT_REQUEST,
  FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_FAILURE,
  FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_SUCCESS,
  FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_REQUEST,
  ADMIN_ADD_FACILITY_DOCUMENT_FAILURE,
  ADMIN_ADD_FACILITY_DOCUMENT_SUCCESS,
  ADMIN_ADD_FACILITY_DOCUMENT_REQUEST,
  FETCH_ADMIN_FACILITY_DOCUMENT_LIST_FAILURE,
  FETCH_ADMIN_FACILITY_DOCUMENT_LIST_SUCCESS,
  FETCH_ADMIN_FACILITY_DOCUMENT_LIST_REQUEST,
  DELETE_ADMIN_FACILITY_MEASURE_REPORT_FAILURE,
  DELETE_ADMIN_FACILITY_MEASURE_REPORT_SUCCESS,
  DELETE_ADMIN_FACILITY_MEASURE_REPORT_REQUEST,
  UPDATE_ADMIN_FACILITY_MEASURE_REPORT_FAILURE,
  UPDATE_ADMIN_FACILITY_MEASURE_REPORT_SUCCESS,
  UPDATE_ADMIN_FACILITY_MEASURE_REPORT_REQUEST,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_FAILURE,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_SUCCESS,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_REQUEST,
  ADMIN_ADD_FACILITY_MEASURE_REPORT_FAILURE,
  ADMIN_ADD_FACILITY_MEASURE_REPORT_SUCCESS,
  ADMIN_ADD_FACILITY_MEASURE_REPORT_REQUEST,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_FAILURE,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_SUCCESS,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_REQUEST,
} from "../actionTypes";

export const fetchAdminFacilityListRequest = () => ({
  type: FETCH_ADMIN_FACILITY_LIST_REQUEST,
});

export const fetchAdminFacilityListSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_LIST_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityListFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_LIST_FAILURE,
  payload: error,
});

export const fetchAdminFacilityListActiveRequest = () => ({
  type: FETCH_ADMIN_FACILITY_LIST_ACTIVE_REQUEST,
});

export const fetchAdminFacilityListActiveSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_LIST_ACTIVE_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityListActiveFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_LIST_ACTIVE_FAILURE,
  payload: error,
});

export const fetchAdminFacilityDetailsRequest = () => ({
  type: FETCH_ADMIN_FACILITY_DETAILS_REQUEST,
});

export const fetchAdminFacilityDetailsSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_DETAILS_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityDetailsFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_DETAILS_FAILURE,
  payload: error,
});

export const deleteAdminFacilityRequest = () => ({
  type: DELETE_ADMIN_FACILITY_REQUEST,
});

export const deleteAdminFacilitySuccess = (data) => ({
  type: DELETE_ADMIN_FACILITY_SUCCESS,
  payload: data,
});

export const deleteAdminFacilityFailure = (error) => ({
  type: DELETE_ADMIN_FACILITY_FAILURE,
  payload: error,
});

export const addAdminFacilityCharacteristicRequest = () => ({
  type: ADD_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
});

export const addAdminFacilityCharacteristicSuccess = (data) => ({
  type: ADD_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const addAdminFacilityCharacteristicFailure = (error) => ({
  type: ADD_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});

export const fetchAdminFacilityCharacteristicsRequest = () => ({
  type: FETCH_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
});

export const fetchAdminFacilityCharacteristicsSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityCharacteristicsFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});

export const updateAdminFacilityCharacteristicRequest = () => ({
  type: UPDATE_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
});

export const updateAdminFacilityCharacteristicSuccess = (data) => ({
  type: UPDATE_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const updateAdminFacilityCharacteristicFailure = (error) => ({
  type: UPDATE_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});

export const fetchAdminFacilityStatusRequest = () => ({
  type: FETCH_ADMIN_FACILITY_STATUS_REQUEST,
});

export const fetchAdminFacilityStatusSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_STATUS_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityStatusFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_STATUS_FAILURE,
  payload: error,
});

export const updateAdminFacilityStatusRequest = () => ({
  type: UPDATE_ADMIN_FACILITY_STATUS_REQUEST,
});

export const updateAdminFacilityStatusSuccess = (data) => ({
  type: UPDATE_ADMIN_FACILITY_STATUS_SUCCESS,
  payload: data,
});

export const updateAdminFacilityStatusFailure = (error) => ({
  type: UPDATE_ADMIN_FACILITY_STATUS_FAILURE,
  payload: error,
});

export const adminAssignFacilityRequest = () => ({
  type: ADMIN_ASSIGN_FACILITIES_REQUEST,
});

export const adminAssignFacilitySuccess = (data) => ({
  type: ADMIN_ASSIGN_FACILITIES_SUCCESS,
  payload: data,
});

export const adminAssignFacilityFailure = (error) => ({
  type: ADMIN_ASSIGN_FACILITIES_FAILURE,
  payload: error,
});

export const fetchAdminFacilitiesDropdownRequest = () => ({
  type: FETCH_ADMIN_FACILITIES_DROPDOWN_REQUEST,
});

export const fetchAdminFacilitiesDropdownSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITIES_DROPDOWN_SUCCESS,
  payload: data,
});

export const fetchAdminFacilitiesDropdownFailure = (error) => ({
  type: FETCH_ADMIN_FACILITIES_DROPDOWN_FAILURE,
  payload: error,
});

export const fetchAdminStatisticsRequest = () => ({
  type: FETCH_ADMIN_STATISTICS_REQUEST,
});

export const fetchAdminStatisticsSuccess = (data) => ({
  type: FETCH_ADMIN_STATISTICS_SUCCESS,
  payload: data,
});

export const fetchAdminStatisticsFailure = (error) => ({
  type: FETCH_ADMIN_STATISTICS_FAILURE,
  payload: error,
});

export const downloadFacilitiesBulkRequest = () => ({
  type: DOWNLOAD_FACILITIES_BULK_REQUEST,
});

export const downloadFacilitiesBulkSuccess = (data) => ({
  type: DOWNLOAD_FACILITIES_BULK_SUCCESS,
  payload: data,
});

export const downloadFacilitiesBulkFailure = (error) => ({
  type: DOWNLOAD_FACILITIES_BULK_FAILURE,
  payload: error,
});

export const downloadFacilityRowRequest = () => ({
  type: DOWNLOAD_FACILITY_ROW_REQUEST,
});

export const downloadFacilityRowSuccess = (data) => ({
  type: DOWNLOAD_FACILITY_ROW_SUCCESS,
  payload: data,
});

export const downloadFacilityRowFailure = (error) => ({
  type: DOWNLOAD_FACILITY_ROW_FAILURE,
  payload: error,
});

export const fetchAdminFacilityMeasureReportListRequest = () => ({
  type: FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_REQUEST,
});

export const fetchAdminFacilityMeasureReportListSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityMeasureReportListFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_FAILURE,
  payload: error,
});

export const adminAddFacilityMeasureReportRequest = () => ({
  type: ADMIN_ADD_FACILITY_MEASURE_REPORT_REQUEST,
});

export const adminAddFacilityMeasureReportSuccess = (data) => ({
  type: ADMIN_ADD_FACILITY_MEASURE_REPORT_SUCCESS,
  payload: data,
});

export const adminAddFacilityMeasureReportFailure = (error) => ({
  type: ADMIN_ADD_FACILITY_MEASURE_REPORT_FAILURE,
  payload: error,
});

export const fetchAdminFacilityMeasureReportDetailsRequest = () => ({
  type: FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_REQUEST,
});

export const fetchAdminFacilityMeasureReportDetailsSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityMeasureReportDetailsFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_FAILURE,
  payload: error,
});

export const updateAdminFacilityMeasureReportRequest = () => ({
  type: UPDATE_ADMIN_FACILITY_MEASURE_REPORT_REQUEST,
});

export const updateAdminFacilityMeasureReportSuccess = (data) => ({
  type: UPDATE_ADMIN_FACILITY_MEASURE_REPORT_SUCCESS,
  payload: data,
});

export const updateAdminFacilityMeasureReportFailure = (error) => ({
  type: UPDATE_ADMIN_FACILITY_MEASURE_REPORT_FAILURE,
  payload: error,
});

export const deleteAdminFacilityMeasureReportRequest = () => ({
  type: DELETE_ADMIN_FACILITY_MEASURE_REPORT_REQUEST,
});

export const deleteAdminFacilityMeasureReportSuccess = (data) => ({
  type: DELETE_ADMIN_FACILITY_MEASURE_REPORT_SUCCESS,
  payload: data,
});

export const deleteAdminFacilityMeasureReportFailure = (error) => ({
  type: DELETE_ADMIN_FACILITY_MEASURE_REPORT_FAILURE,
  payload: error,
});

export const fetchAdminFacilityDocumentListRequest = () => ({
  type: FETCH_ADMIN_FACILITY_DOCUMENT_LIST_REQUEST,
});

export const fetchAdminFacilityDocumentListSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_DOCUMENT_LIST_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityDocumentListFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_DOCUMENT_LIST_FAILURE,
  payload: error,
});

export const adminAddFacilityDocumentRequest = () => ({
  type: ADMIN_ADD_FACILITY_DOCUMENT_REQUEST,
});

export const adminAddFacilityDocumentSuccess = (data) => ({
  type: ADMIN_ADD_FACILITY_DOCUMENT_SUCCESS,
  payload: data,
});

export const adminAddFacilityDocumentFailure = (error) => ({
  type: ADMIN_ADD_FACILITY_DOCUMENT_FAILURE,
  payload: error,
});

export const fetchAdminFacilityDocumentDetailsRequest = () => ({
  type: FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_REQUEST,
});

export const fetchAdminFacilityDocumentDetailsSuccess = (data) => ({
  type: FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_SUCCESS,
  payload: data,
});

export const fetchAdminFacilityDocumentDetailsFailure = (error) => ({
  type: FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_FAILURE,
  payload: error,
});

export const updateAdminFacilityDocumentRequest = () => ({
  type: UPDATE_ADMIN_FACILITY_DOCUMENT_REQUEST,
});

export const updateAdminFacilityDocumentSuccess = (data) => ({
  type: UPDATE_ADMIN_FACILITY_DOCUMENT_SUCCESS,
  payload: data,
});

export const updateAdminFacilityDocumentFailure = (error) => ({
  type: UPDATE_ADMIN_FACILITY_DOCUMENT_FAILURE,
  payload: error,
});

export const deleteAdminFacilityDocumentRequest = () => ({
  type: DELETE_ADMIN_FACILITY_DOCUMENT_REQUEST,
});

export const deleteAdminFacilityDocumentSuccess = (data) => ({
  type: DELETE_ADMIN_FACILITY_DOCUMENT_SUCCESS,
  payload: data,
});

export const deleteAdminFacilityDocumentFailure = (error) => ({
  type: DELETE_ADMIN_FACILITY_DOCUMENT_FAILURE,
  payload: error,
});