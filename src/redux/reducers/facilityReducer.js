import {
  FETCH_FACILITY_LIST_FAILURE,
  FETCH_FACILITY_LIST_REQUEST,
  FETCH_FACILITY_LIST_SUCCESS,
} from "./../actionTypes";

const initialState = {
  facilityList: [],
  loading: false,
  error: null,
};

const facilityReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FACILITY_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACILITY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityList: action.payload,
        error: null,
      };
    case FETCH_FACILITY_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default facilityReducer;
