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
  DELETE_FACILITY_REQUEST,
  DELETE_FACILITY_SUCCESS,
  DELETE_FACILITY_FAILURE,
  ADD_FACILITY_CHARACTERISTIC_REQUEST,
  ADD_FACILITY_CHARACTERISTIC_SUCCESS,
  ADD_FACILITY_CHARACTERISTIC_FAILURE,
  FETCH_FACILITY_CHARACTERISTICS_REQUEST,
  FETCH_FACILITY_CHARACTERISTICS_SUCCESS,
  FETCH_FACILITY_CHARACTERISTICS_FAILURE,
  UPDATE_FACILITY_CHARACTERISTIC_REQUEST,
  UPDATE_FACILITY_CHARACTERISTIC_SUCCESS,
  UPDATE_FACILITY_CHARACTERISTIC_FAILURE,
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
  deleting: false,
  deleteError: null,
  characteristics: [],
  characteristicsLoading: false,
  characteristicsError: null,
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
    case DELETE_FACILITY_REQUEST:
      return {
        ...state,
        deleting: true,
        deleteError: null,
      };
    case DELETE_FACILITY_SUCCESS:
      return {
        ...state,
        deleting: false,
        deleteError: null,
      };
    case DELETE_FACILITY_FAILURE:
      return {
        ...state,
        deleting: false,
        deleteError: action.payload,
      };
    case ADD_FACILITY_CHARACTERISTIC_REQUEST:
      return {
        ...state,
        characteristicsLoading: true,
        characteristicsError: null,
      };
    case ADD_FACILITY_CHARACTERISTIC_SUCCESS:
      return {
        ...state,
        characteristicsLoading: false,
        characteristicsError: null,
      };
    case ADD_FACILITY_CHARACTERISTIC_FAILURE:
      return {
        ...state,
        characteristicsLoading: false,
        characteristicsError: action.payload,
      };
    case FETCH_FACILITY_CHARACTERISTICS_REQUEST:
      return {
        ...state,
        characteristicsLoading: true,
        characteristicsError: null,
      };
    case FETCH_FACILITY_CHARACTERISTICS_SUCCESS:
      return {
        ...state,
        characteristicsLoading: false,
        characteristics: action.payload,
        characteristicsError: null,
      };
    case FETCH_FACILITY_CHARACTERISTICS_FAILURE:
      return {
        ...state,
        characteristicsLoading: false,
        characteristicsError: action.payload,
      };
    case UPDATE_FACILITY_CHARACTERISTIC_REQUEST:
      return {
        ...state,
        characteristicsLoading: true,
        characteristicsError: null,
      };
    case UPDATE_FACILITY_CHARACTERISTIC_SUCCESS:
      return {
        ...state,
        characteristicsLoading: false,
        characteristicsError: null,
      };
    case UPDATE_FACILITY_CHARACTERISTIC_FAILURE:
      return {
        ...state,
        characteristicsLoading: false,
        characteristicsError: action.payload,
      };
    default:
      return state;
  }
};

export default facilityReducer;
