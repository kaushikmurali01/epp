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
  GET_EMAIL_ARCHIVE_REQUEST,
  GET_EMAIL_ARCHIVE_SUCCESS,
  GET_EMAIL_ARCHIVE_FAILURE,
  CREATE_ADMIN_NON_ROUTINE_EVENT_REQUEST,
  CREATE_ADMIN_NON_ROUTINE_EVENT_SUCCESS,
  CREATE_ADMIN_NON_ROUTINE_EVENT_FAILURE,
  GET_ADMIN_NON_ROUTINE_EVENT_LIST_REQUEST,
  GET_ADMIN_NON_ROUTINE_EVENT_LIST_SUCCESS,
  GET_ADMIN_NON_ROUTINE_EVENT_LIST_FAILURE,
  ADD_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST,
  ADD_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS,
  ADD_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE,
  GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_REQUEST,
  GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_SUCCESS,
  GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_FAILURE,
  EDIT_ADMIN_NON_ROUTINE_EVENT_REQUEST,
  EDIT_ADMIN_NON_ROUTINE_EVENT_SUCCESS,
  EDIT_ADMIN_NON_ROUTINE_EVENT_FAILURE,
  EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST,
  EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS,
  EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE,
  DELETE_ADMIN_NON_ROUTINE_EVENT_REQUEST,
  DELETE_ADMIN_NON_ROUTINE_EVENT_SUCCESS,
  DELETE_ADMIN_NON_ROUTINE_EVENT_FAILURE,
  DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST,
  DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS,
  DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE,
  GET_ADMIN_BASELINE_DATA_SUMMARY_REQUEST,
  GET_ADMIN_BASELINE_DATA_SUMMARY_SUCCESS,
  GET_ADMIN_BASELINE_DATA_SUMMARY_FAILURE,
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
  GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_SUCCESS,
  GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_REQUEST,
  GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_FAILURE,
  FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_REQUEST,
  FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_SUCCESS,
  FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_FAILURE,
  FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_REQUEST,
  FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_SUCCESS,
  FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_FAILURE,
} from "../actionTypes";

const initialState = {
  loading: false,
  processing: false,
  emailTemplate: null,
  emailTemplateList: [],
  editedEmailTemplate: null,
  incentiveSettings: null,
  emailSent: "",
  createdContact: null,
  contactList: [],
  updatedContact: null,
  archivedEmailList: [],
  adminBaselineSummaryData: [],
  adminNonRoutineEventList: [],
  adminNonRoutineEventDetails: [],
  adminCalculatedPerformanceReport: {},
  adminPerformanceReportInDB: {},
  adminPerformanceDataMinMaxDate: {},
  adminPerformanceDataVisualization: {},
  adminPerformanceDataSummaryList: [],
  adminPerformanceDataRawMeterSummaryList: [],
  error: null,
};

const adminPerformanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EMAIL_TEMPLATE_REQUEST:
      return { ...state, loading: true };
    case CREATE_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        emailTemplate: action.payload,
        error: null,
      };
    case CREATE_EMAIL_TEMPLATE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_EMAIL_TEMPLATE_REQUEST:
      return { ...state, loading: true };
    case GET_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        emailTemplateList: action.payload,
        error: null,
      };
    case GET_EMAIL_TEMPLATE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_EMAIL_TEMPLATE_REQUEST:
      return { ...state, loading: true };
    case UPDATE_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        editedEmailTemplate: action.payload,
        error: null,
      };
    case UPDATE_EMAIL_TEMPLATE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_EMAIL_TEMPLATE_REQUEST:
      return { ...state, loading: true };
    case DELETE_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_EMAIL_TEMPLATE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_INCENTIVE_SETTINGS_REQUEST:
      return { ...state, loading: true };
    case GET_INCENTIVE_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        incentiveSettings: action.payload,
        error: null,
      };
    case GET_INCENTIVE_SETTINGS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_INCENTIVE_SETTINGS_REQUEST:
      return { ...state, loading: true };
    case UPDATE_INCENTIVE_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        incentiveSettings: action.payload,
        error: null,
      };
    case UPDATE_INCENTIVE_SETTINGS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SEND_EMAIL_REQUEST:
      return { ...state, loading: true };
    case SEND_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        emailSent: action.payload,
        error: null,
      };
    case SEND_EMAIL_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_CONTACT_REQUEST:
      return { ...state, loading: true };
    case CREATE_CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        createdContact: action.payload,
        error: null,
      };
    case CREATE_CONTACT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_CONTACT_REQUEST:
      return { ...state, loading: true };
    case GET_CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        contactList: action.payload,
        error: null,
      };
    case GET_CONTACT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_CONTACT_REQUEST:
      return { ...state, loading: true };
    case UPDATE_CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        updatedContact: action.payload,
        error: null,
      };
    case UPDATE_CONTACT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_CONTACT_REQUEST:
      return { ...state, loading: true };
    case DELETE_CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_CONTACT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_EMAIL_ARCHIVE_REQUEST:
      return { ...state, loading: true };
    case GET_EMAIL_ARCHIVE_SUCCESS:
      return {
        ...state,
        loading: false,
        archivedEmailList: action.payload,
        error: null,
      };
    case GET_EMAIL_ARCHIVE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_ADMIN_BASELINE_DATA_SUMMARY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ADMIN_BASELINE_DATA_SUMMARY_SUCCESS:
      return {
        ...state,
        loading: false,
        adminBaselineSummaryData: action.payload,
        error: null,
      };
    case GET_ADMIN_BASELINE_DATA_SUMMARY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_ADMIN_NON_ROUTINE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_ADMIN_NON_ROUTINE_EVENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case CREATE_ADMIN_NON_ROUTINE_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_ADMIN_NON_ROUTINE_EVENT_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ADMIN_NON_ROUTINE_EVENT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        adminNonRoutineEventList: action.payload,
        error: null,
      };
    case GET_ADMIN_NON_ROUTINE_EVENT_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        adminNonRoutineEventList: action.payload,
        error: null,
      };
    case ADD_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        adminNonRoutineEventDetails: action.payload,
        error: null,
      };
    case GET_ADMIN_NON_ROUTINE_EVENT_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case EDIT_ADMIN_NON_ROUTINE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case EDIT_ADMIN_NON_ROUTINE_EVENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case EDIT_ADMIN_NON_ROUTINE_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case EDIT_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_ADMIN_NON_ROUTINE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_ADMIN_NON_ROUTINE_EVENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_ADMIN_NON_ROUTINE_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_ADMIN_NON_ROUTINE_EVENT_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SCORE_ADMIN_PERFORMANCE_DATA_REQUEST:
      return {
        ...state,
        processing: true,
        error: null,
      };
    case SCORE_ADMIN_PERFORMANCE_DATA_SUCCESS:
      return {
        ...state,
        processing: false,
        error: null,
      };
    case SCORE_ADMIN_PERFORMANCE_DATA_FAILURE:
      return {
        ...state,
        processing: false,
        error: action.payload,
      };

    case CALCULATE_ADMIN_PERFORMANCE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CALCULATE_ADMIN_PERFORMANCE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        adminCalculatedPerformanceReport: action.payload,
        error: null,
      };
    case CALCULATE_ADMIN_PERFORMANCE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_ADMIN_PERFORMANCE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_ADMIN_PERFORMANCE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_ADMIN_PERFORMANCE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_ADMIN_PERFORMANCE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ADMIN_PERFORMANCE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        adminPerformanceReportInDB: action.payload,
        error: null,
      };
    case GET_ADMIN_PERFORMANCE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_ADMIN_PERFORMANCE_DATA_MIN_MAX_DATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ADMIN_PERFORMANCE_DATA_MIN_MAX_DATE_SUCCESS:
      return {
        ...state,
        loading: false,
        adminPerformanceDataMinMaxDate: action.payload,
        error: null,
      };
    case GET_ADMIN_PERFORMANCE_DATA_MIN_MAX_DATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_SUCCESS:
      return {
        ...state,
        loading: false,
        adminPerformanceDataVisualization: action.payload,
        error: null,
      };
    case GET_ADMIN_PERFORMANCE_DATA_VISUALIZATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_SUCCESS:
      return {
        ...state,
        loading: false,
        adminPerformanceDataSummaryList: action.payload,
        error: null,
      };
    case FETCH_ADMIN_PERFORMANCE_DATA_SUMMARY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        adminPerformanceDataRawMeterSummaryList: action.payload,
        error: null,
      };
    case FETCH_ADMIN_PERFORMANCE_DATA_RAW_SUMMARY_METER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default adminPerformanceReducer;
