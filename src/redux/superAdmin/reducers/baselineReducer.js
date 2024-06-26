import {
  FETCH_BASELINE_PERIOD_FAILURE,
  FETCH_BASELINE_PERIOD_REQUEST,
  FETCH_BASELINE_PERIOD_SUCCESS,
  FETCH_STATIONS_DETAILS_FAILURE,
  FETCH_STATIONS_DETAILS_REQUEST,
  FETCH_STATIONS_DETAILS_SUCCESS,
  INDEPENDENT_VARIABLE_LIST_FAILURE,
  INDEPENDENT_VARIABLE_LIST_REQUEST,
  INDEPENDENT_VARIABLE_LIST_SUCCESS,
  SUFFICIENCY_CHECK_FAILURE,
  SUFFICIENCY_CHECK_REQUEST,
  SUFFICIENCY_CHECK_SUCCESS,
} from "../actionTypes";

const initialState = {
  sufficiencyCheckData: [],
  independentVariableList: [],
  baselinePeriod: [],
  stationDetails: [],
  loading: false,
  error: null,
};

const baselineReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUFFICIENCY_CHECK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SUFFICIENCY_CHECK_SUCCESS:
      return {
        ...state,
        loading: false,
        sufficiencyCheckData: action.payload,
        error: null,
      };
    case SUFFICIENCY_CHECK_FAILURE:
      return {
        ...state,
        loading: false,
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
        loading: true,
        error: null,
      };
    case FETCH_BASELINE_PERIOD_SUCCESS:
      return {
        ...state,
        loading: false,
        baselinePeriod: action.payload,
        error: null,
      };
    case FETCH_BASELINE_PERIOD_FAILURE:
      return {
        ...state,
        loading: false,
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
    default:
      return state;
  }
};

export default baselineReducer;
