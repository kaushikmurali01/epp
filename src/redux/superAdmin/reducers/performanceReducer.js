import { GET_BASELINE_DATA_SUMMARY_FAILURE, GET_BASELINE_DATA_SUMMARY_REQUEST, GET_BASELINE_DATA_SUMMARY_SUCCESS } from "../actionTypes";

const initialState = {
  baselineSummaryData: [],
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
    default:
      return state;
  }
};

export default performanceReducer;
