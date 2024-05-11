import {
  FETCH_METER_LIST_FAILURE,
  FETCH_METER_LIST_REQUEST,
  FETCH_METER_LIST_SUCCESS,
  ADD_METER_REQUEST,
  ADD_METER_SUCCESS,
  ADD_METER_FAILURE,
  UPDATE_METER_REQUEST,
  UPDATE_METER_SUCCESS,
  UPDATE_METER_FAILURE,
  FETCH_METER_DETAILS_REQUEST,
  FETCH_METER_DETAILS_SUCCESS,
  FETCH_METER_DETAILS_FAILURE,
  DELETE_METER_REQUEST,
  DELETE_METER_SUCCESS,
  DELETE_METER_FAILURE,
  FETCH_METER_STATISTICS_REQUEST,
  FETCH_METER_STATISTICS_SUCCESS,
  FETCH_METER_STATISTICS_FAILURE,
} from "./../actionTypes";

const initialState = {
  meterList: [],
  meterDetails: null,
  meterStatistics: null,
  loading: false,
  error: null,
};

const meterReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_METER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_METER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        meterList: action.payload,
        error: null,
      };
    case FETCH_METER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_METER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_METER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADD_METER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_METER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_METER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_METER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_METER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_METER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        meterDetails: action.payload,
        error: null,
      };
    case FETCH_METER_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_METER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_METER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_METER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_METER_STATISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_METER_STATISTICS_SUCCESS:
      return {
        ...state,
        meterStatistics: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_METER_STATISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default meterReducer;
