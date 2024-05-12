import {
  DELETE_ADMIN_FACILITY_FAILURE,
  DELETE_ADMIN_FACILITY_REQUEST,
  DELETE_ADMIN_FACILITY_SUCCESS,
  FETCH_ADMIN_FACILITY_LIST_FAILURE,
  FETCH_ADMIN_FACILITY_LIST_REQUEST,
  FETCH_ADMIN_FACILITY_LIST_SUCCESS,
  FETCH_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
  FETCH_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  FETCH_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  UPDATE_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  ADD_ADMIN_FACILITY_CHARACTERISTICS_FAILURE,
  ADD_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS,
  ADD_ADMIN_FACILITY_CHARACTERISTICS_REQUEST,
} from "../actionTypes";

const initialState = {
  facilityList: [],
  characteristics: [],
  loading: false,
  error: null,
};

const adminFacilityReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADMIN_FACILITY_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityList: action.payload,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_ADMIN_FACILITY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_ADMIN_FACILITY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_ADMIN_FACILITY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case ADD_ADMIN_FACILITY_CHARACTERISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADD_ADMIN_FACILITY_CHARACTERISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_FACILITY_CHARACTERISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS:
      return {
        ...state,
        characteristics: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_CHARACTERISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_ADMIN_FACILITY_CHARACTERISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_ADMIN_FACILITY_CHARACTERISTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_ADMIN_FACILITY_CHARACTERISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default adminFacilityReducer;
