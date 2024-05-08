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
  characteristics: [],
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
    case SUBMIT_FACILITY_FOR_APPROVAL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SUBMIT_FACILITY_FOR_APPROVAL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case SUBMIT_FACILITY_FOR_APPROVAL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_FACILITY_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACILITY_DETAILS_SUCCESS:
      return {
        ...state,
        facilityDetails: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_FACILITY_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_FACILITY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_FACILITY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_FACILITY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_FACILITY_CHARACTERISTIC_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_FACILITY_CHARACTERISTIC_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADD_FACILITY_CHARACTERISTIC_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_FACILITY_CHARACTERISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACILITY_CHARACTERISTICS_SUCCESS:
      return {
        ...state,
        characteristics: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_FACILITY_CHARACTERISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_FACILITY_CHARACTERISTIC_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_FACILITY_CHARACTERISTIC_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_FACILITY_CHARACTERISTIC_FAILURE:
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
