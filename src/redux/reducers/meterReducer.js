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
} from "./../actionTypes";

const initialState = {
  meterList: [],
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
    default:
      return state;
  }
};

export default meterReducer;
