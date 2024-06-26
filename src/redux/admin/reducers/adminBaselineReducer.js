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
} from "../actionTypes";

const initialState = {
  sufficiencyCheckData: [],
  independentVariableList: [],
  baselinePeriod: [],
  stationDetails: [],
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
    default:
      return state;
  }
};

export default adminBaselineReducer;
