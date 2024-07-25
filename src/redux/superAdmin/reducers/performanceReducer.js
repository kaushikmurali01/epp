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
} from "../actionTypes";

const initialState = {
  baselineSummaryData: [],
  routineEventList: [],
  loading: false,
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
        routineEventList: action.payload,
        error: null,
      };
    case GET_NON_ROUTINE_EVENT_LIST_FAILURE:
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
