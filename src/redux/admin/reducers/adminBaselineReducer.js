import {
  FETCH_ADMIN_BASELINE_PERIOD_FAILURE,
  FETCH_ADMIN_BASELINE_PERIOD_REQUEST,
  FETCH_ADMIN_BASELINE_PERIOD_SUCCESS,
  FETCH_ADMIN_STATIONS_DETAILS_FAILURE,
  FETCH_ADMIN_STATIONS_DETAILS_REQUEST,
  FETCH_ADMIN_STATIONS_DETAILS_SUCCESS,
  ADMIN_INDEPENDENT_VARIABLE_LIST_FAILURE,
  ADMIN_INDEPENDENT_VARIABLE_LIST_REQUEST,
  ADMIN_INDEPENDENT_VARIABLE_LIST_SUCCESS,
  ADMIN_SUFFICIENCY_CHECK_FAILURE,
  ADMIN_SUFFICIENCY_CHECK_REQUEST,
  ADMIN_SUFFICIENCY_CHECK_SUCCESS,
  FETCH_ADMIN_BASELINE_LIST_DB_REQUEST,
  FETCH_ADMIN_BASELINE_LIST_DB_SUCCESS,
  FETCH_ADMIN_BASELINE_LIST_DB_FAILURE,
  FETCH_ADMIN_ISSUE_DETAILS_REQUEST,
  FETCH_ADMIN_ISSUE_DETAILS_SUCCESS,
  FETCH_ADMIN_ISSUE_DETAILS_FAILURE,
  ADMIN_ADD_BASELINE_DB_REQUEST,
  ADMIN_ADD_BASELINE_DB_SUCCESS,
  ADMIN_ADD_BASELINE_DB_FAILURE,
  FETCH_ADMIN_BASELINE_DETAILS_DB_REQUEST,
  FETCH_ADMIN_BASELINE_DETAILS_DB_SUCCESS,
  FETCH_ADMIN_BASELINE_DETAILS_DB_FAILURE,
  UPDATE_ADMIN_BASELINE_DETAILS_DB_REQUEST,
  UPDATE_ADMIN_BASELINE_DETAILS_DB_SUCCESS,
  UPDATE_ADMIN_BASELINE_DETAILS_DB_FAILURE,
  ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_REQUEST,
  ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_SUCCESS,
  ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_FAILURE,
  SUBMIT_ADMIN_REJECTED_BASELINE_DB_REQUEST,
  SUBMIT_ADMIN_REJECTED_BASELINE_DB_SUCCESS,
  SUBMIT_ADMIN_REJECTED_BASELINE_DB_FAILURE,
} from "../actionTypes";

const initialState = {
  sufficiencyCheckData: [],
  independentVariableList: [],
  baselinePeriod: [],
  stationDetails: [],
  issueDetails: [],
  baselineDetailsDb: [],
  baselineListDb: [],
  loading: false,
  error: null,
};

const adminBaselineReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_SUFFICIENCY_CHECK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_SUFFICIENCY_CHECK_SUCCESS:
      return {
        ...state,
        loading: false,
        sufficiencyCheckData: action.payload,
        error: null,
      };
    case ADMIN_SUFFICIENCY_CHECK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADMIN_INDEPENDENT_VARIABLE_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_INDEPENDENT_VARIABLE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        independentVariableList: action.payload,
        error: null,
      };
    case ADMIN_INDEPENDENT_VARIABLE_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_BASELINE_PERIOD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_BASELINE_PERIOD_SUCCESS:
      return {
        ...state,
        loading: false,
        baselinePeriod: action.payload,
        error: null,
      };
    case FETCH_ADMIN_BASELINE_PERIOD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_STATIONS_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_STATIONS_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        stationDetails: action.payload,
        error: null,
      };
    case FETCH_ADMIN_STATIONS_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_ISSUE_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_ISSUE_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        issueDetails: action.payload,
        error: null,
      };
    case FETCH_ADMIN_ISSUE_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADMIN_ADD_BASELINE_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_ADD_BASELINE_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADMIN_ADD_BASELINE_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_BASELINE_DETAILS_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_BASELINE_DETAILS_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        baselineDetailsDb: action.payload,
        error: null,
      };
    case FETCH_ADMIN_BASELINE_DETAILS_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_ADMIN_BASELINE_DETAILS_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_ADMIN_BASELINE_DETAILS_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_ADMIN_BASELINE_DETAILS_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_BASELINE_LIST_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_BASELINE_LIST_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        baselineListDb: action.payload,
        error: null,
      };
    case FETCH_ADMIN_BASELINE_LIST_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADMIN_ADD_ASSIGNEE_TO_BASELINE_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SUBMIT_ADMIN_REJECTED_BASELINE_DB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SUBMIT_ADMIN_REJECTED_BASELINE_DB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case SUBMIT_ADMIN_REJECTED_BASELINE_DB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default adminBaselineReducer;
