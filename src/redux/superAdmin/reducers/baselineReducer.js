import {
  ADD_ASSIGNEE_TO_BASELINE_DB_FAILURE,
  ADD_ASSIGNEE_TO_BASELINE_DB_REQUEST,
  ADD_ASSIGNEE_TO_BASELINE_DB_SUCCESS,
  ADD_BASELINE_DB_FAILURE,
  ADD_BASELINE_DB_REQUEST,
  ADD_BASELINE_DB_SUCCESS,
  CLEAR_BASELINE_STATE,
  FETCH_BASELINE_DETAILS_DB_FAILURE,
  FETCH_BASELINE_DETAILS_DB_REQUEST,
  FETCH_BASELINE_DETAILS_DB_SUCCESS,
  FETCH_BASELINE_LIST_DB_FAILURE,
  FETCH_BASELINE_LIST_DB_REQUEST,
  FETCH_BASELINE_LIST_DB_SUCCESS,
  FETCH_BASELINE_PERIOD_FAILURE,
  FETCH_BASELINE_PERIOD_REQUEST,
  FETCH_BASELINE_PERIOD_SUCCESS,
  FETCH_DATA_EXPLORATION_SUMMARY_FAILURE,
  FETCH_DATA_EXPLORATION_SUMMARY_REQUEST,
  FETCH_DATA_EXPLORATION_SUMMARY_SUCCESS,
  FETCH_ISSUE_DETAILS_FAILURE,
  FETCH_ISSUE_DETAILS_REQUEST,
  FETCH_ISSUE_DETAILS_SUCCESS,
  FETCH_OUTLIERS_SETTINGS_FAILURE,
  FETCH_OUTLIERS_SETTINGS_REQUEST,
  FETCH_OUTLIERS_SETTINGS_SUCCESS,
  FETCH_RAW_SUMMARY_METER_LIST_FAILURE,
  FETCH_RAW_SUMMARY_METER_LIST_REQUEST,
  FETCH_RAW_SUMMARY_METER_LIST_SUCCESS,
  FETCH_STATIONS_DETAILS_FAILURE,
  FETCH_STATIONS_DETAILS_REQUEST,
  FETCH_STATIONS_DETAILS_SUCCESS,
  INDEPENDENT_VARIABLE_LIST_FAILURE,
  INDEPENDENT_VARIABLE_LIST_REQUEST,
  INDEPENDENT_VARIABLE_LIST_SUCCESS,
  SHOW_OBSERVE_DATA_FAILURE,
  SHOW_OBSERVE_DATA_REQUEST,
  SHOW_OBSERVE_DATA_SUCCESS,
  SUBMIT_BASELINE_D_T_FAILURE,
  SUBMIT_BASELINE_D_T_REQUEST,
  SUBMIT_BASELINE_D_T_SUCCESS,
  SUBMIT_REJECTED_BASELINE_DB_FAILURE,
  SUBMIT_REJECTED_BASELINE_DB_REQUEST,
  SUBMIT_REJECTED_BASELINE_DB_SUCCESS,
  SUFFICIENCY_CHECK_FAILURE,
  SUFFICIENCY_CHECK_REQUEST,
  SUFFICIENCY_CHECK_SUCCESS,
  UPDATE_BASELINE_DETAILS_DB_FAILURE,
  UPDATE_BASELINE_DETAILS_DB_REQUEST,
  UPDATE_BASELINE_DETAILS_DB_SUCCESS,
} from "../actionTypes";

const initialState = {
  sufficiencyCheckData: [],
  independentVariableList: [],
  baselinePeriod: [],
  stationDetails: [],
  issueDetails: [],
  baselineDetailsDb: [],
  baselineListDb: [],
  observeData: [],
  submittedBaseline_d_t: [],
  dataExplorationSummaryList: [],
  rawMeterSummaryList: [],
  outliersSettingsData: [],
  loading: false,
  summaryLoading: false,
  sufficiencyCheckLoading: false,
  baselinePeriodLoading: false,
  calculateBaselineLoading: false,
  error: null,
};

const baselineReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUFFICIENCY_CHECK_REQUEST:
      return {
        ...state,
        sufficiencyCheckLoading: true,
        error: null,
      };
    case SUFFICIENCY_CHECK_SUCCESS:
      return {
        ...state,
        sufficiencyCheckLoading: false,
        sufficiencyCheckData: action.payload,
        error: null,
      };
    case SUFFICIENCY_CHECK_FAILURE:
      return {
        ...state,
        sufficiencyCheckLoading: false,
        error: action.payload,
      };
    case INDEPENDENT_VARIABLE_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case INDEPENDENT_VARIABLE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        independentVariableList: action.payload,
        error: null,
      };
    case INDEPENDENT_VARIABLE_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_BASELINE_PERIOD_REQUEST:
      return {
        ...state,
        baselinePeriodLoading: true,
        error: null,
      };
    case FETCH_BASELINE_PERIOD_SUCCESS:
      return {
        ...state,
        baselinePeriodLoading: false,
        baselinePeriod: action.payload,
        error: null,
      };
    case FETCH_BASELINE_PERIOD_FAILURE:
      return {
        ...state,
        baselinePeriodLoading: false,
        error: action.payload,
      };
    case FETCH_STATIONS_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_STATIONS_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        stationDetails: action.payload,
        error: null,
      };
    case FETCH_STATIONS_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ISSUE_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ISSUE_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        issueDetails: action.payload,
        error: null,
      };
    case FETCH_ISSUE_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_BASELINE_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_BASELINE_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADD_BASELINE_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_BASELINE_DETAILS_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_BASELINE_DETAILS_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        baselineDetailsDb: action.payload,
        error: null,
      };
    case FETCH_BASELINE_DETAILS_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_BASELINE_DETAILS_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_BASELINE_DETAILS_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_BASELINE_DETAILS_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_BASELINE_LIST_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_BASELINE_LIST_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        baselineListDb: action.payload,
        error: null,
      };
    case FETCH_BASELINE_LIST_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_ASSIGNEE_TO_BASELINE_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_ASSIGNEE_TO_BASELINE_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADD_ASSIGNEE_TO_BASELINE_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SUBMIT_REJECTED_BASELINE_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SUBMIT_REJECTED_BASELINE_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case SUBMIT_REJECTED_BASELINE_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SHOW_OBSERVE_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SHOW_OBSERVE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        observeData: action.payload,
        error: null,
      };
    case SHOW_OBSERVE_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SUBMIT_BASELINE_D_T_REQUEST:
      return {
        ...state,
        calculateBaselineLoading: true,
        error: null,
      };
    case SUBMIT_BASELINE_D_T_SUCCESS:
      return {
        ...state,
        calculateBaselineLoading: false,
        submittedBaseline_d_t: action.payload,
        error: null,
      };
    case SUBMIT_BASELINE_D_T_FAILURE:
      return {
        ...state,
        calculateBaselineLoading: false,
        error: action.payload,
      };
    case FETCH_DATA_EXPLORATION_SUMMARY_REQUEST:
      return {
        ...state,
        summaryLoading: true,
        error: null,
      };
    case FETCH_DATA_EXPLORATION_SUMMARY_SUCCESS:
      return {
        ...state,
        summaryLoading: false,
        dataExplorationSummaryList: action.payload,
        error: null,
      };
    case FETCH_DATA_EXPLORATION_SUMMARY_FAILURE:
      return {
        ...state,
        summaryLoading: false,
        error: action.payload,
      };
    case FETCH_RAW_SUMMARY_METER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_RAW_SUMMARY_METER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        rawMeterSummaryList: action.payload,
        error: null,
      };
    case FETCH_RAW_SUMMARY_METER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_OUTLIERS_SETTINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_OUTLIERS_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        outliersSettingsData: action.payload,
        error: null,
      };
    case FETCH_OUTLIERS_SETTINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_BASELINE_STATE:
      return initialState;
    default:
      return state;
  }
};

export default baselineReducer;
