import {
  FETCH_FACILITY_LIST_FAILURE,
  FETCH_FACILITY_LIST_REQUEST,
  FETCH_FACILITY_LIST_SUCCESS,
  SUBMIT_FACILITY_FOR_APPROVAL_REQUEST,
  SUBMIT_FACILITY_FOR_APPROVAL_SUCCESS,
  SUBMIT_FACILITY_FOR_APPROVAL_FAILURE,
  FETCH_FACILITY_DETAILS_REQUEST,
  FETCH_FACILITY_DETAILS_SUCCESS,
  FETCH_FACILITY_DETAILS_FAILURE,
} from "./../actionTypes";

const initialState = {
  facilityList: [],
  loading: false,
  error: null,
  approvalLoading: false,
  approvalError: null,
  facilityDetails: null,
  detailsLoading: false,
  detailsError: null,
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
    case SUBMIT_FACILITY_FOR_APPROVAL_REQUEST:
      return {
        ...state,
        approvalLoading: true,
        approvalError: null,
      };
    case SUBMIT_FACILITY_FOR_APPROVAL_SUCCESS:
      return {
        ...state,
        approvalLoading: false,
        approvalError: null,
      };
    case SUBMIT_FACILITY_FOR_APPROVAL_FAILURE:
      return {
        ...state,
        approvalLoading: false,
        approvalError: action.payload,
      };
    case FETCH_FACILITY_DETAILS_REQUEST:
      return {
        ...state,
        detailsLoading: true,
        detailsError: null,
      };
    case FETCH_FACILITY_DETAILS_SUCCESS:
      return {
        ...state,
        detailsLoading: false,
        facilityDetails: action.payload,
        detailsError: null,
      };
    case FETCH_FACILITY_DETAILS_FAILURE:
      return {
        ...state,
        detailsLoading: false,
        detailsError: action.payload,
      };
    default:
      return state;
  }
};

export default facilityReducer;
