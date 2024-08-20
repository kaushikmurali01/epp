import {
  GET_BASELINE_DATA_SUMMARY_FAILURE,
  GET_BASELINE_DATA_SUMMARY_REQUEST,
  GET_BASELINE_DATA_SUMMARY_SUCCESS,
  CREATE_NON_ROUTINE_EVENT_FAILURE,
  CREATE_NON_ROUTINE_EVENT_REQUEST,
  CREATE_NON_ROUTINE_EVENT_SUCCESS,
  GET_NON_ROUTINE_EVENT_LIST_FAILURE,
  GET_NON_ROUTINE_EVENT_LIST_REQUEST,
  GET_NON_ROUTINE_EVENT_LIST_SUCCESS,
  ADD_NON_ROUTINE_EVENT_DATA_FAILURE,
  ADD_NON_ROUTINE_EVENT_DATA_REQUEST,
  ADD_NON_ROUTINE_EVENT_DATA_SUCCESS,
  GET_NON_ROUTINE_EVENT_DETAIL_FAILURE,
  GET_NON_ROUTINE_EVENT_DETAIL_REQUEST,
  GET_NON_ROUTINE_EVENT_DETAIL_SUCCESS,
  EDIT_NON_ROUTINE_EVENT_FAILURE,
  EDIT_NON_ROUTINE_EVENT_REQUEST,
  EDIT_NON_ROUTINE_EVENT_SUCCESS,
  EDIT_NON_ROUTINE_EVENT_DATA_FAILURE,
  EDIT_NON_ROUTINE_EVENT_DATA_REQUEST,
  EDIT_NON_ROUTINE_EVENT_DATA_SUCCESS,
  DELETE_NON_ROUTINE_EVENT_FAILURE,
  DELETE_NON_ROUTINE_EVENT_REQUEST,
  DELETE_NON_ROUTINE_EVENT_SUCCESS,
  DELETE_NON_ROUTINE_EVENT_DATA_FAILURE,
  DELETE_NON_ROUTINE_EVENT_DATA_REQUEST,
  DELETE_NON_ROUTINE_EVENT_DATA_SUCCESS,
  CALCULATE_PERFORMANCE_REPORT_SUCCESS,
  CALCULATE_PERFORMANCE_REPORT_REQUEST,
  CALCULATE_PERFORMANCE_REPORT_FAILURE,
  UPDATE_PERFORMANCE_REPORT_REQUEST,
  UPDATE_PERFORMANCE_REPORT_SUCCESS,
  UPDATE_PERFORMANCE_REPORT_FAILURE,
  GET_PERFORMANCE_REPORT_REQUEST,
  GET_PERFORMANCE_REPORT_SUCCESS,
  GET_PERFORMANCE_REPORT_FAILURE,
  SCORE_PERFORMANCE_DATA_REQUEST,
  SCORE_PERFORMANCE_DATA_SUCCESS,
  SCORE_PERFORMANCE_DATA_FAILURE,
  GET_PERFORMANCE_DATA_MIN_MAX_DATE_REQUEST,
  GET_PERFORMANCE_DATA_MIN_MAX_DATE_SUCCESS,
  GET_PERFORMANCE_DATA_MIN_MAX_DATE_FAILURE,
  GET_PERFORMANCE_DATA_VISUALIZATION_REQUEST,
  GET_PERFORMANCE_DATA_VISUALIZATION_SUCCESS,
  GET_PERFORMANCE_DATA_VISUALIZATION_FAILURE,
} from "../actionTypes";

const initialState = {
  baselineSummaryData: [],
  nonRoutineEventList: [],
  nonRoutineEventDetails: [],
  calculatedPerformanceReport: {},
  performanceReportInDB: {},
  performanceDataMinMaxDate: {},
  performanceDataVisualization: {},
  loading: false,
  processing: false,
  error: null,
};

const performanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BASELINE_DATA_SUMMARY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_BASELINE_DATA_SUMMARY_SUCCESS:
      return {
        ...state,
        loading: false,
        baselineSummaryData: action.payload,
        error: null,
      };
    case GET_BASELINE_DATA_SUMMARY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_NON_ROUTINE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_NON_ROUTINE_EVENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case CREATE_NON_ROUTINE_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_NON_ROUTINE_EVENT_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_NON_ROUTINE_EVENT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        nonRoutineEventList: action.payload,
        error: null,
      };
    case GET_NON_ROUTINE_EVENT_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_NON_ROUTINE_EVENT_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_NON_ROUTINE_EVENT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        nonRoutineEventList: action.payload,
        error: null,
      };
    case ADD_NON_ROUTINE_EVENT_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_NON_ROUTINE_EVENT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_NON_ROUTINE_EVENT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        nonRoutineEventDetails: action.payload,
        error: null,
      };
    case GET_NON_ROUTINE_EVENT_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case EDIT_NON_ROUTINE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case EDIT_NON_ROUTINE_EVENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case EDIT_NON_ROUTINE_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case EDIT_NON_ROUTINE_EVENT_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case EDIT_NON_ROUTINE_EVENT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case EDIT_NON_ROUTINE_EVENT_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_NON_ROUTINE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_NON_ROUTINE_EVENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_NON_ROUTINE_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_NON_ROUTINE_EVENT_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_NON_ROUTINE_EVENT_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_NON_ROUTINE_EVENT_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SCORE_PERFORMANCE_DATA_REQUEST:
      return {
        ...state,
        // loading: true,
        processing: true,
        error: null,
      };
    case SCORE_PERFORMANCE_DATA_SUCCESS:
      return {
        ...state,
        // loading: false,
        processing: false,
        error: null,
      };
    case SCORE_PERFORMANCE_DATA_FAILURE:
      return {
        ...state,
        // loading: false,
        processing: false,
        error: action.payload,
      };

    case CALCULATE_PERFORMANCE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CALCULATE_PERFORMANCE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        calculatedPerformanceReport: action.payload,
        error: null,
      };
    case CALCULATE_PERFORMANCE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_PERFORMANCE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_PERFORMANCE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_PERFORMANCE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_PERFORMANCE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PERFORMANCE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        performanceReportInDB: action.payload,
        error: null,
      };
    case GET_PERFORMANCE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_PERFORMANCE_DATA_MIN_MAX_DATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PERFORMANCE_DATA_MIN_MAX_DATE_SUCCESS:
      return {
        ...state,
        loading: false,
        performanceDataMinMaxDate: action.payload,
        error: null,
      };
    case GET_PERFORMANCE_DATA_MIN_MAX_DATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_PERFORMANCE_DATA_VISUALIZATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PERFORMANCE_DATA_VISUALIZATION_SUCCESS:
      return {
        ...state,
        loading: false,
        performanceDataVisualization: action.payload,
        error: null,
      };
    case GET_PERFORMANCE_DATA_VISUALIZATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default performanceReducer;
