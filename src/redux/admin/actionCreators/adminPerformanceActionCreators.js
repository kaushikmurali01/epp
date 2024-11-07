import {
  CREATE_EMAIL_TEMPLATE_REQUEST,
  CREATE_EMAIL_TEMPLATE_SUCCESS,
  CREATE_EMAIL_TEMPLATE_FAILURE,
  GET_EMAIL_TEMPLATE_REQUEST,
  GET_EMAIL_TEMPLATE_SUCCESS,
  GET_EMAIL_TEMPLATE_FAILURE,
  UPDATE_EMAIL_TEMPLATE_REQUEST,
  UPDATE_EMAIL_TEMPLATE_SUCCESS,
  UPDATE_EMAIL_TEMPLATE_FAILURE,
  DELETE_EMAIL_TEMPLATE_REQUEST,
  DELETE_EMAIL_TEMPLATE_SUCCESS,
  DELETE_EMAIL_TEMPLATE_FAILURE,
  GET_INCENTIVE_SETTINGS_REQUEST,
  GET_INCENTIVE_SETTINGS_SUCCESS,
  GET_INCENTIVE_SETTINGS_FAILURE,
  UPDATE_INCENTIVE_SETTINGS_REQUEST,
  UPDATE_INCENTIVE_SETTINGS_SUCCESS,
  UPDATE_INCENTIVE_SETTINGS_FAILURE,
  SEND_EMAIL_REQUEST,
  SEND_EMAIL_SUCCESS,
  SEND_EMAIL_FAILURE,
  GET_EMAIL_ARCHIVE_REQUEST,
  GET_EMAIL_ARCHIVE_SUCCESS,
  GET_EMAIL_ARCHIVE_FAILURE,
  CREATE_CONTACT_REQUEST,
  CREATE_CONTACT_SUCCESS,
  CREATE_CONTACT_FAILURE,
  GET_CONTACT_REQUEST,
  GET_CONTACT_SUCCESS,
  GET_CONTACT_FAILURE,
  UPDATE_CONTACT_REQUEST,
  UPDATE_CONTACT_SUCCESS,
  UPDATE_CONTACT_FAILURE,
  DELETE_CONTACT_REQUEST,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAILURE,
  GET_ADMIN_BASELINE_DATA_SUMMARY_FAILURE,
  GET_ADMIN_BASELINE_DATA_SUMMARY_REQUEST,
  GET_ADMIN_BASELINE_DATA_SUMMARY_SUCCESS,
  CREATE_ADMIN_NON_ROUTINE_EVENT_FAILURE,
  CREATE_ADMIN_NON_ROUTINE_EVENT_REQUEST,
  CREATE_ADMIN_NON_ROUTINE_EVENT_SUCCESS,
  GET_ADMIN_NON_ROUTINE_EVENT_LIST_FAILURE,
  GET_ADMIN_NON_ROUTINE_EVENT_LIST_REQUEST,
  GET_ADMIN_NON_ROUTINE_EVENT_LIST_SUCCESS,
  ADD_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE,
  ADD_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST,
  ADD_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS,
  GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_FAILURE,
  GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_REQUEST,
  GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_SUCCESS,
  EDIT_ADMIN_NON_ROUTINE_EVENT_FAILURE,
  EDIT_ADMIN_NON_ROUTINE_EVENT_REQUEST,
  EDIT_ADMIN_NON_ROUTINE_EVENT_SUCCESS,
  EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE,
  EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST,
  EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS,
  DELETE_ADMIN_NON_ROUTINE_EVENT_FAILURE,
  DELETE_ADMIN_NON_ROUTINE_EVENT_REQUEST,
  DELETE_ADMIN_NON_ROUTINE_EVENT_SUCCESS,
  DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE,
  DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST,
  DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS,
  CALCULATE_ADMIN_PERFORMANCE_REPORT_REQUEST,
  CALCULATE_ADMIN_PERFORMANCE_REPORT_SUCCESS,
  CALCULATE_ADMIN_PERFORMANCE_REPORT_FAILURE,
  UPDATE_ADMIN_PERFORMANCE_REPORT_REQUEST,
  UPDATE_ADMIN_PERFORMANCE_REPORT_SUCCESS,
  UPDATE_ADMIN_PERFORMANCE_REPORT_FAILURE,
  GET_ADMIN_PERFORMANCE_REPORT_REQUEST,
  GET_ADMIN_PERFORMANCE_REPORT_SUCCESS,
  GET_ADMIN_PERFORMANCE_REPORT_FAILURE,
  SCORE_ADMIN_PERFORMANCE_DATA_REQUEST,
  SCORE_ADMIN_PERFORMANCE_DATA_SUCCESS,
  SCORE_ADMIN_PERFORMANCE_DATA_FAILURE,
  GET_ADMIN_PERFORMANCE_DATA_MIN_MAX_DATE_REQUEST,
  GET_ADMIN_PERFORMANCE_DATA_MIN_MAX_DATE_SUCCESS,
  GET_ADMIN_PERFORMANCE_DATA_MIN_MAX_DATE_FAILURE,
  GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_REQUEST,
  GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_SUCCESS,
  GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_FAILURE,
  FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_REQUEST,
  FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_SUCCESS,
  FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_FAILURE,
  FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_REQUEST,
  FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_SUCCESS,
  FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_FAILURE,
  GET_ADMIN_DYNAMIC_EMAIL_TEMPLATE_REQUEST,
  GET_ADMIN_DYNAMIC_EMAIL_TEMPLATE_SUCCESS,
  GET_ADMIN_DYNAMIC_EMAIL_TEMPLATE_FAILURE,
  FETCH_ADMIN_PERFORMANCE_PREDICTED_DATA_REQUEST,
  FETCH_ADMIN_PERFORMANCE_PREDICTED_DATA_SUCCESS,
  FETCH_ADMIN_PERFORMANCE_PREDICTED_DATA_FAILURE,
} from "../actionTypes";

export const createEmailTemplateRequest = () => ({
  type: CREATE_EMAIL_TEMPLATE_REQUEST,
});

export const createEmailTemplateSuccess = (data) => ({
  type: CREATE_EMAIL_TEMPLATE_SUCCESS,
  payload: data,
});

export const createEmailTemplateFailure = (error) => ({
  type: CREATE_EMAIL_TEMPLATE_FAILURE,
  payload: error,
});

export const getEmailTemplateRequest = () => ({
  type: GET_EMAIL_TEMPLATE_REQUEST,
});

export const getEmailTemplateSuccess = (data) => ({
  type: GET_EMAIL_TEMPLATE_SUCCESS,
  payload: data,
});

export const getEmailTemplateFailure = (error) => ({
  type: GET_EMAIL_TEMPLATE_FAILURE,
  payload: error,
});

export const updateEmailTemplateRequest = () => ({
  type: UPDATE_EMAIL_TEMPLATE_REQUEST,
});

export const updateEmailTemplateSuccess = (data) => ({
  type: UPDATE_EMAIL_TEMPLATE_SUCCESS,
  payload: data,
});

export const updateEmailTemplateFailure = (error) => ({
  type: UPDATE_EMAIL_TEMPLATE_FAILURE,
  payload: error,
});

export const deleteEmailTemplateRequest = () => ({
  type: DELETE_EMAIL_TEMPLATE_REQUEST,
});

export const deleteEmailTemplateSuccess = (data) => ({
  type: DELETE_EMAIL_TEMPLATE_SUCCESS,
  payload: data,
});

export const deleteEmailTemplateFailure = (error) => ({
  type: DELETE_EMAIL_TEMPLATE_FAILURE,
  payload: error,
});

export const getIncentiveSettingsRequest = () => ({
  type: GET_INCENTIVE_SETTINGS_REQUEST,
});

export const getIncentiveSettingsSuccess = (data) => ({
  type: GET_INCENTIVE_SETTINGS_SUCCESS,
  payload: data,
});

export const getIncentiveSettingsFailure = (error) => ({
  type: GET_INCENTIVE_SETTINGS_FAILURE,
  payload: error,
});

export const updateIncentiveSettingsRequest = () => ({
  type: UPDATE_INCENTIVE_SETTINGS_REQUEST,
});

export const updateIncentiveSettingsSuccess = (data) => ({
  type: UPDATE_INCENTIVE_SETTINGS_SUCCESS,
  payload: data,
});

export const updateIncentiveSettingsFailure = (error) => ({
  type: UPDATE_INCENTIVE_SETTINGS_FAILURE,
  payload: error,
});

export const sendEmailRequest = () => ({
  type: SEND_EMAIL_REQUEST,
});

export const sendEmailSuccess = (data) => ({
  type: SEND_EMAIL_SUCCESS,
  payload: data,
});

export const sendEmailFailure = (error) => ({
  type: SEND_EMAIL_FAILURE,
  payload: error,
});

export const createContactRequest = () => ({
  type: CREATE_CONTACT_REQUEST,
});

export const createContactSuccess = (data) => ({
  type: CREATE_CONTACT_SUCCESS,
  payload: data,
});

export const createContactFailure = (error) => ({
  type: CREATE_CONTACT_FAILURE,
  payload: error,
});
export const getContactRequest = () => ({
  type: GET_CONTACT_REQUEST,
});

export const getContactSuccess = (data) => ({
  type: GET_CONTACT_SUCCESS,
  payload: data,
});

export const getContactFailure = (error) => ({
  type: GET_CONTACT_FAILURE,
  payload: error,
});

export const updateContactRequest = () => ({
  type: UPDATE_CONTACT_REQUEST,
});

export const updateContactSuccess = (data) => ({
  type: UPDATE_CONTACT_SUCCESS,
  payload: data,
});

export const updateContactFailure = (error) => ({
  type: UPDATE_CONTACT_FAILURE,
  payload: error,
});

export const deleteContactRequest = () => ({
  type: DELETE_CONTACT_REQUEST,
});

export const deleteContactSuccess = (data) => ({
  type: DELETE_CONTACT_SUCCESS,
  payload: data,
});

export const deleteContactFailure = (error) => ({
  type: DELETE_CONTACT_FAILURE,
  payload: error,
});

export const getEmailArchiveRequest = () => ({
  type: GET_EMAIL_ARCHIVE_REQUEST,
});

export const getEmailArchiveSuccess = (data) => ({
  type: GET_EMAIL_ARCHIVE_SUCCESS,
  payload: data,
});

export const getEmailArchiveFailure = (error) => ({
  type: GET_EMAIL_ARCHIVE_FAILURE,
  payload: error,
});

export const getAdminBaselineDataSummaryRequest = () => ({
  type: GET_ADMIN_BASELINE_DATA_SUMMARY_REQUEST,
});

export const getAdminBaselineDataSummarySuccess = (data) => ({
  type: GET_ADMIN_BASELINE_DATA_SUMMARY_SUCCESS,
  payload: data,
});

export const getAdminBaselineDataSummaryFailure = (error) => ({
  type: GET_ADMIN_BASELINE_DATA_SUMMARY_FAILURE,
  payload: error,
});

export const createAdminNonRoutineEventRequest = () => ({
  type: CREATE_ADMIN_NON_ROUTINE_EVENT_REQUEST,
});

export const createAdminNonRoutineEventSuccess = (data) => ({
  type: CREATE_ADMIN_NON_ROUTINE_EVENT_SUCCESS,
  payload: data,
});

export const createAdminNonRoutineEventFailure = (error) => ({
  type: CREATE_ADMIN_NON_ROUTINE_EVENT_FAILURE,
  payload: error,
});

export const getAdminNonRoutineEventListRequest = () => ({
  type: GET_ADMIN_NON_ROUTINE_EVENT_LIST_REQUEST,
});

export const getAdminNonRoutineEventListSuccess = (data) => ({
  type: GET_ADMIN_NON_ROUTINE_EVENT_LIST_SUCCESS,
  payload: data,
});

export const getAdminNonRoutineEventListFailure = (error) => ({
  type: GET_ADMIN_NON_ROUTINE_EVENT_LIST_FAILURE,
  payload: error,
});

export const addAdminNonRoutineEventDataRequest = () => ({
  type: ADD_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST,
});

export const addAdminNonRoutineEventDataSuccess = (data) => ({
  type: ADD_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS,
  payload: data,
});

export const addAdminNonRoutineEventDataFailure = (error) => ({
  type: ADD_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE,
  payload: error,
});

export const getAdminNonRoutineEventDetailRequest = () => ({
  type: GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_REQUEST,
});

export const getAdminNonRoutineEventDetailSuccess = (data) => ({
  type: GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_SUCCESS,
  payload: data,
});

export const getAdminNonRoutineEventDetailFailure = (error) => ({
  type: GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_FAILURE,
  payload: error,
});

export const editAdminNonRoutineEventRequest = () => ({
  type: EDIT_ADMIN_NON_ROUTINE_EVENT_REQUEST,
});

export const editAdminNonRoutineEventSuccess = (data) => ({
  type: EDIT_ADMIN_NON_ROUTINE_EVENT_SUCCESS,
  payload: data,
});

export const editAdminNonRoutineEventFailure = (error) => ({
  type: EDIT_ADMIN_NON_ROUTINE_EVENT_FAILURE,
  payload: error,
});

export const editAdminNonRoutineEventDataRequest = () => ({
  type: EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST,
});

export const editAdminNonRoutineEventDataSuccess = (data) => ({
  type: EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS,
  payload: data,
});

export const editAdminNonRoutineEventDataFailure = (error) => ({
  type: EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE,
  payload: error,
});

export const deleteAdminNonRoutineEventRequest = () => ({
  type: DELETE_ADMIN_NON_ROUTINE_EVENT_REQUEST,
});

export const deleteAdminNonRoutineEventSuccess = (data) => ({
  type: DELETE_ADMIN_NON_ROUTINE_EVENT_SUCCESS,
  payload: data,
});

export const deleteAdminNonRoutineEventFailure = (error) => ({
  type: DELETE_ADMIN_NON_ROUTINE_EVENT_FAILURE,
  payload: error,
});

export const deleteAdminNonRoutineEventDataRequest = () => ({
  type: DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST,
});

export const deleteAdminNonRoutineEventDataSuccess = (data) => ({
  type: DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS,
  payload: data,
});

export const deleteAdminNonRoutineEventDataFailure = (error) => ({
  type: DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE,
  payload: error,
});

export const scoreAdminPerformanceDataRequest = () => ({
  type: SCORE_ADMIN_PERFORMANCE_DATA_REQUEST,
});

export const scoreAdminPerformanceDataSuccess = (data) => ({
  type: SCORE_ADMIN_PERFORMANCE_DATA_SUCCESS,
  payload: data,
});

export const scoreAdminPerformanceDataFailure = (error) => ({
  type: SCORE_ADMIN_PERFORMANCE_DATA_FAILURE,
  payload: error,
});

export const calculateAdminPerformanceReportRequest = () => ({
  type: CALCULATE_ADMIN_PERFORMANCE_REPORT_REQUEST,
});

export const calculateAdminPerformanceReportSuccess = (data) => ({
  type: CALCULATE_ADMIN_PERFORMANCE_REPORT_SUCCESS,
  payload: data,
});

export const calculateAdminPerformanceReportFailure = (error) => ({
  type: CALCULATE_ADMIN_PERFORMANCE_REPORT_FAILURE,
  payload: error,
});

export const updateAdminPerformanceReportRequest = () => ({
  type: UPDATE_ADMIN_PERFORMANCE_REPORT_REQUEST,
});

export const updateAdminPerformanceReportSuccess = (data) => ({
  type: UPDATE_ADMIN_PERFORMANCE_REPORT_SUCCESS,
  payload: data,
});

export const updateAdminPerformanceReportFailure = (error) => ({
  type: UPDATE_ADMIN_PERFORMANCE_REPORT_FAILURE,
  payload: error,
});

export const getAdminPerformanceReportRequest = () => ({
  type: GET_ADMIN_PERFORMANCE_REPORT_REQUEST,
});

export const getAdminPerformanceReportSuccess = (data) => ({
  type: GET_ADMIN_PERFORMANCE_REPORT_SUCCESS,
  payload: data,
});

export const getAdminPerformanceReportFailure = (error) => ({
  type: GET_ADMIN_PERFORMANCE_REPORT_FAILURE,
  payload: error,
});

export const getAdminPerformanceDataMinMaxDateRequest = () => ({
  type: GET_ADMIN_PERFORMANCE_DATA_MIN_MAX_DATE_REQUEST,
});

export const getAdminPerformanceDataMinMaxDateSuccess = (data) => ({
  type: GET_ADMIN_PERFORMANCE_DATA_MIN_MAX_DATE_SUCCESS,
  payload: data,
});

export const getAdminPerformanceDataMinMaxDateFailure = (error) => ({
  type: GET_ADMIN_PERFORMANCE_DATA_MIN_MAX_DATE_FAILURE,
  payload: error,
});

export const getAdminPerformanceDataVisualizationRequest = () => ({
  type: GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_REQUEST,
});

export const getAdminPerformanceDataVisualizationSuccess = (data) => ({
  type: GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_SUCCESS,
  payload: data,
});

export const getAdminPerformanceDataVisualizationFailure = (error) => ({
  type: GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_FAILURE,
  payload: error,
});

export const fetchAdminPerformanceDataSummaryListRequest = () => ({
  type: FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_REQUEST,
});

export const fetchAdminPerformanceDataSummaryListSuccess = (data) => ({
  type: FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_SUCCESS,
  payload: data,
});

export const fetchAdminPerformanceDataSummaryListFailure = (error) => ({
  type: FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_FAILURE,
  payload: error,
});

export const fetchAdminPerformanceDataRawSummaryMeterListRequest = () => ({
  type: FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_REQUEST,
});

export const fetchAdminPerformanceDataRawSummaryMeterListSuccess = (data) => ({
  type: FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_SUCCESS,
  payload: data,
});

export const fetchAdminPerformanceDataRawSummaryMeterListFailure = (error) => ({
  type: FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_FAILURE,
  payload: error,
});

export const getDynamicEmailTemplateRequest = () => ({
  type: GET_ADMIN_DYNAMIC_EMAIL_TEMPLATE_REQUEST,
});

export const getDynamicEmailTemplateSuccess = (data) => ({
  type: GET_ADMIN_DYNAMIC_EMAIL_TEMPLATE_SUCCESS,
  payload: data,
});

export const getDynamicEmailTemplateFailure = (error) => ({
  type: GET_ADMIN_DYNAMIC_EMAIL_TEMPLATE_FAILURE,
  payload: error,
});

export const fetchAdminPerformancePredictedDataRequest = () => ({
  type: FETCH_ADMIN_PERFORMANCE_PREDICTED_DATA_REQUEST,
});

export const fetchAdminPerformancePredictedDataSuccess = (data) => ({
  type: FETCH_ADMIN_PERFORMANCE_PREDICTED_DATA_SUCCESS,
  payload: data,
});

export const fetchAdminPerformancePredictedDataFailure = (error) => ({
  type: FETCH_ADMIN_PERFORMANCE_PREDICTED_DATA_FAILURE,
  payload: error,
});
