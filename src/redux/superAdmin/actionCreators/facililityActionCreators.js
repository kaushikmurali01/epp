import {
  FETCH_FACILITY_LIST_FAILURE,
  FETCH_FACILITY_LIST_REQUEST,
  FETCH_FACILITY_LIST_SUCCESS,
  GET_USER_DETAILS_FAILURE,
  GET_USER_DETAILS_REQUEST,
  GET_USER_DETAILS_SUCCESS,
  SUBMIT_FACILITY_FOR_APPROVAL_REQUEST,
  SUBMIT_FACILITY_FOR_APPROVAL_SUCCESS,
  SUBMIT_FACILITY_FOR_APPROVAL_FAILURE,
  FETCH_FACILITY_DETAILS_REQUEST,
  FETCH_FACILITY_DETAILS_SUCCESS,
  FETCH_FACILITY_DETAILS_FAILURE,
  DELETE_FACILITY_REQUEST,
  DELETE_FACILITY_SUCCESS,
  DELETE_FACILITY_FAILURE,
  ADD_FACILITY_CHARACTERISTICS_REQUEST,
  ADD_FACILITY_CHARACTERISTICS_SUCCESS,
  ADD_FACILITY_CHARACTERISTICS_FAILURE,
  FETCH_FACILITY_CHARACTERISTICS_REQUEST,
  FETCH_FACILITY_CHARACTERISTICS_SUCCESS,
  FETCH_FACILITY_CHARACTERISTICS_FAILURE,
  UPDATE_FACILITY_CHARACTERISTICS_REQUEST,
  UPDATE_FACILITY_CHARACTERISTICS_SUCCESS,
  UPDATE_FACILITY_CHARACTERISTICS_FAILURE,
  FETCH_FACILITY_STATUS_REQUEST,
  FETCH_FACILITY_STATUS_SUCCESS,
  FETCH_FACILITY_STATUS_FAILURE,
  UPDATE_FACILITY_STATUS_REQUEST,
  UPDATE_FACILITY_STATUS_SUCCESS,
  UPDATE_FACILITY_STATUS_FAILURE,
  ASSIGN_FACILITIES_REQUEST,
  ASSIGN_FACILITIES_SUCCESS,
  ASSIGN_FACILITIES_FAILURE,
  FETCH_FACILITIES_DROPDOWN_REQUEST,
  FETCH_FACILITIES_DROPDOWN_SUCCESS,
  FETCH_FACILITIES_DROPDOWN_FAILURE,
  FETCH_FACILITY_MEASURE_REPORT_LIST_REQUEST,
  FETCH_FACILITY_MEASURE_REPORT_LIST_SUCCESS,
  FETCH_FACILITY_MEASURE_REPORT_LIST_FAILURE,
  ADD_FACILITY_MEASURE_REPORT_REQUEST,
  ADD_FACILITY_MEASURE_REPORT_SUCCESS,
  ADD_FACILITY_MEASURE_REPORT_FAILURE,
  FETCH_FACILITY_MEASURE_REPORT_DETAILS_REQUEST,
  FETCH_FACILITY_MEASURE_REPORT_DETAILS_SUCCESS,
  FETCH_FACILITY_MEASURE_REPORT_DETAILS_FAILURE,
  UPDATE_FACILITY_MEASURE_REPORT_REQUEST,
  UPDATE_FACILITY_MEASURE_REPORT_SUCCESS,
  UPDATE_FACILITY_MEASURE_REPORT_FAILURE,
  DELETE_FACILITY_MEASURE_REPORT_FAILURE,
  DELETE_FACILITY_MEASURE_REPORT_SUCCESS,
  DELETE_FACILITY_MEASURE_REPORT_REQUEST,
  FETCH_FACILITY_DOCUMENT_LIST_REQUEST,
  FETCH_FACILITY_DOCUMENT_LIST_SUCCESS,
  FETCH_FACILITY_DOCUMENT_LIST_FAILURE,
  ADD_FACILITY_DOCUMENT_REQUEST,
  ADD_FACILITY_DOCUMENT_SUCCESS,
  ADD_FACILITY_DOCUMENT_FAILURE,
  FETCH_FACILITY_DOCUMENT_DETAILS_REQUEST,
  FETCH_FACILITY_DOCUMENT_DETAILS_SUCCESS,
  FETCH_FACILITY_DOCUMENT_DETAILS_FAILURE,
  UPDATE_FACILITY_DOCUMENT_REQUEST,
  UPDATE_FACILITY_DOCUMENT_SUCCESS,
  UPDATE_FACILITY_DOCUMENT_FAILURE,
  DELETE_FACILITY_DOCUMENT_REQUEST,
  DELETE_FACILITY_DOCUMENT_SUCCESS,
  DELETE_FACILITY_DOCUMENT_FAILURE,
  SEND_HELP_REQ_FOR_MEASURE_REQUEST,
  SEND_HELP_REQ_FOR_MEASURE_FAILURE,
  SEND_HELP_REQ_FOR_MEASURE_SUCCESS,
  GET_WATERFALL_DATA_REQUEST,
  GET_WATERFALL_DATA_SUCCESS,
  GET_WATERFALL_DATA_FAILURE,
} from "../actionTypes";

export const fetchFacilityListRequest = () => ({
  type: FETCH_FACILITY_LIST_REQUEST,
});

export const fetchFacilityListSuccess = (data) => ({
  type: FETCH_FACILITY_LIST_SUCCESS,
  payload: data,
});

export const fetchFacilityListFailure = (error) => ({
  type: FETCH_FACILITY_LIST_FAILURE,
  payload: error,
});

export const getUserDetailsRequest = () => ({
  type: GET_USER_DETAILS_REQUEST,
});

export const getUserDetailsSuccess = (data) => ({
  type: GET_USER_DETAILS_SUCCESS,
  payload: data,
});

export const getUserDetailsFailure = (error) => ({
  type: GET_USER_DETAILS_FAILURE,
  payload: error,
});

export const submitFacilityForApprovalRequest = () => ({
  type: SUBMIT_FACILITY_FOR_APPROVAL_REQUEST,
});

export const submitFacilityForApprovalSuccess = (data) => ({
  type: SUBMIT_FACILITY_FOR_APPROVAL_SUCCESS,
  payload: data,
});

export const submitFacilityForApprovalFailure = (error) => ({
  type: SUBMIT_FACILITY_FOR_APPROVAL_FAILURE,
  payload: error,
});

export const fetchFacilityDetailsRequest = () => ({
  type: FETCH_FACILITY_DETAILS_REQUEST,
});

export const fetchFacilityDetailsSuccess = (data) => ({
  type: FETCH_FACILITY_DETAILS_SUCCESS,
  payload: data,
});

export const fetchFacilityDetailsFailure = (error) => ({
  type: FETCH_FACILITY_DETAILS_FAILURE,
  payload: error,
});

export const deleteFacilityRequest = () => ({
  type: DELETE_FACILITY_REQUEST,
});

export const deleteFacilitySuccess = (data) => ({
  type: DELETE_FACILITY_SUCCESS,
  payload: data,
});

export const deleteFacilityFailure = (error) => ({
  type: DELETE_FACILITY_FAILURE,
  payload: error,
});

export const addFacilityCharacteristicRequest = () => ({
  type: ADD_FACILITY_CHARACTERISTICS_REQUEST,
});

export const addFacilityCharacteristicSuccess = (data) => ({
  type: ADD_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const addFacilityCharacteristicFailure = (error) => ({
  type: ADD_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});

export const fetchFacilityCharacteristicsRequest = () => ({
  type: FETCH_FACILITY_CHARACTERISTICS_REQUEST,
});

export const fetchFacilityCharacteristicsSuccess = (data) => ({
  type: FETCH_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const fetchFacilityCharacteristicsFailure = (error) => ({
  type: FETCH_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});

export const updateFacilityCharacteristicRequest = () => ({
  type: UPDATE_FACILITY_CHARACTERISTICS_REQUEST,
});

export const updateFacilityCharacteristicSuccess = (data) => ({
  type: UPDATE_FACILITY_CHARACTERISTICS_SUCCESS,
  payload: data,
});

export const updateFacilityCharacteristicFailure = (error) => ({
  type: UPDATE_FACILITY_CHARACTERISTICS_FAILURE,
  payload: error,
});

export const fetchFacilityStatusRequest = () => ({
  type: FETCH_FACILITY_STATUS_REQUEST,
});

export const fetchFacilityStatusSuccess = (data) => ({
  type: FETCH_FACILITY_STATUS_SUCCESS,
  payload: data,
});

export const fetchFacilityStatusFailure = (error) => ({
  type: FETCH_FACILITY_STATUS_FAILURE,
  payload: error,
});

export const updateFacilityStatusRequest = () => ({
  type: UPDATE_FACILITY_STATUS_REQUEST,
});

export const updateFacilityStatusSuccess = (data) => ({
  type: UPDATE_FACILITY_STATUS_SUCCESS,
  payload: data,
});

export const updateFacilityStatusFailure = (error) => ({
  type: UPDATE_FACILITY_STATUS_FAILURE,
  payload: error,
});

export const assignFacilityRequest = () => ({
  type: ASSIGN_FACILITIES_REQUEST,
});

export const assignFacilitySuccess = (data) => ({
  type: ASSIGN_FACILITIES_SUCCESS,
  payload: data,
});

export const assignFacilityFailure = (error) => ({
  type: ASSIGN_FACILITIES_FAILURE,
  payload: error,
});

export const fetchFacilitiesDropdownRequest = () => ({
  type: FETCH_FACILITIES_DROPDOWN_REQUEST,
});

export const fetchFacilitiesDropdownSuccess = (data) => ({
  type: FETCH_FACILITIES_DROPDOWN_SUCCESS,
  payload: data,
});

export const fetchFacilitiesDropdownFailure = (error) => ({
  type: FETCH_FACILITIES_DROPDOWN_FAILURE,
  payload: error,
});

export const fetchFacilityMeasureReportListRequest = () => ({
  type: FETCH_FACILITY_MEASURE_REPORT_LIST_REQUEST,
});

export const fetchFacilityMeasureReportListSuccess = (data) => ({
  type: FETCH_FACILITY_MEASURE_REPORT_LIST_SUCCESS,
  payload: data,
});

export const fetchFacilityMeasureReportListFailure = (error) => ({
  type: FETCH_FACILITY_MEASURE_REPORT_LIST_FAILURE,
  payload: error,
});

export const addFacilityMeasureReportRequest = () => ({
  type: ADD_FACILITY_MEASURE_REPORT_REQUEST,
});

export const addFacilityMeasureReportSuccess = (data) => ({
  type: ADD_FACILITY_MEASURE_REPORT_SUCCESS,
  payload: data,
});

export const addFacilityMeasureReportFailure = (error) => ({
  type: ADD_FACILITY_MEASURE_REPORT_FAILURE,
  payload: error,
});

export const fetchFacilityMeasureReportDetailsRequest = () => ({
  type: FETCH_FACILITY_MEASURE_REPORT_DETAILS_REQUEST,
});

export const fetchFacilityMeasureReportDetailsSuccess = (data) => ({
  type: FETCH_FACILITY_MEASURE_REPORT_DETAILS_SUCCESS,
  payload: data,
});

export const fetchFacilityMeasureReportDetailsFailure = (error) => ({
  type: FETCH_FACILITY_MEASURE_REPORT_DETAILS_FAILURE,
  payload: error,
});

export const updateFacilityMeasureReportRequest = () => ({
  type: UPDATE_FACILITY_MEASURE_REPORT_REQUEST,
});

export const updateFacilityMeasureReportSuccess = (data) => ({
  type: UPDATE_FACILITY_MEASURE_REPORT_SUCCESS,
  payload: data,
});

export const updateFacilityMeasureReportFailure = (error) => ({
  type: UPDATE_FACILITY_MEASURE_REPORT_FAILURE,
  payload: error,
});

export const deleteFacilityMeasureReportRequest = () => ({
  type: DELETE_FACILITY_MEASURE_REPORT_REQUEST,
});

export const deleteFacilityMeasureReportSuccess = (data) => ({
  type: DELETE_FACILITY_MEASURE_REPORT_SUCCESS,
  payload: data,
});

export const deleteFacilityMeasureReportFailure = (error) => ({
  type: DELETE_FACILITY_MEASURE_REPORT_FAILURE,
  payload: error,
});

export const fetchFacilityDocumentListRequest = () => ({
  type: FETCH_FACILITY_DOCUMENT_LIST_REQUEST,
});

export const fetchFacilityDocumentListSuccess = (data) => ({
  type: FETCH_FACILITY_DOCUMENT_LIST_SUCCESS,
  payload: data,
});

export const fetchFacilityDocumentListFailure = (error) => ({
  type: FETCH_FACILITY_DOCUMENT_LIST_FAILURE,
  payload: error,
});

export const addFacilityDocumentRequest = () => ({
  type: ADD_FACILITY_DOCUMENT_REQUEST,
});

export const addFacilityDocumentSuccess = (data) => ({
  type: ADD_FACILITY_DOCUMENT_SUCCESS,
  payload: data,
});

export const addFacilityDocumentFailure = (error) => ({
  type: ADD_FACILITY_DOCUMENT_FAILURE,
  payload: error,
});

export const fetchFacilityDocumentDetailsRequest = () => ({
  type: FETCH_FACILITY_DOCUMENT_DETAILS_REQUEST,
});

export const fetchFacilityDocumentDetailsSuccess = (data) => ({
  type: FETCH_FACILITY_DOCUMENT_DETAILS_SUCCESS,
  payload: data,
});

export const fetchFacilityDocumentDetailsFailure = (error) => ({
  type: FETCH_FACILITY_DOCUMENT_DETAILS_FAILURE,
  payload: error,
});

export const updateFacilityDocumentRequest = () => ({
  type: UPDATE_FACILITY_DOCUMENT_REQUEST,
});

export const updateFacilityDocumentSuccess = (data) => ({
  type: UPDATE_FACILITY_DOCUMENT_SUCCESS,
  payload: data,
});

export const updateFacilityDocumentFailure = (error) => ({
  type: UPDATE_FACILITY_DOCUMENT_FAILURE,
  payload: error,
});

export const deleteFacilityDocumentRequest = () => ({
  type: DELETE_FACILITY_DOCUMENT_REQUEST,
});

export const deleteFacilityDocumentSuccess = (data) => ({
  type: DELETE_FACILITY_DOCUMENT_SUCCESS,
  payload: data,
});

export const deleteFacilityDocumentFailure = (error) => ({
  type: DELETE_FACILITY_DOCUMENT_FAILURE,
  payload: error,
});

export const sendHelpReqForMeasureCategoryRequest = () => ({
  type: SEND_HELP_REQ_FOR_MEASURE_REQUEST,
});

export const sendHelpReqForMeasureCategorySuccess = (data) => ({
  type: SEND_HELP_REQ_FOR_MEASURE_SUCCESS,
  payload: data,
});

export const sendHelpReqForMeasureCategoryFailure = (error) => ({
  type: SEND_HELP_REQ_FOR_MEASURE_FAILURE,
  payload: error,
});

export const getWaterfallDataRequest = () => ({
  type: GET_WATERFALL_DATA_REQUEST,
});

export const getWaterfallDataSuccess = (data) => ({
  type: GET_WATERFALL_DATA_SUCCESS,
  payload: data,
});

export const getWaterfallDataFailure = (error) => ({
  type: GET_WATERFALL_DATA_FAILURE,
  payload: error,
});
