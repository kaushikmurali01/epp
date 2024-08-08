import {
  FETCH_FACILITY_LIST_FAILURE,
  FETCH_FACILITY_LIST_REQUEST,
  FETCH_FACILITY_LIST_SUCCESS,
  GET_USER_DETAILS_FAILURE,
  GET_USER_DETAILS_REQUEST,
  GET_USER_DETAILS_SUCCESS,
  SUBMIT_FACILITY_FOR_APPROVAL_REQUEST,
  SUBMIT_FACILITY_FOR_APPROVAL_SUCCESS,
  SUBMIT_FACILITY_FOR_APPROVAL_FAILURE,
  FETCH_FACILITY_DETAILS_REQUEST,
  FETCH_FACILITY_DETAILS_SUCCESS,
  FETCH_FACILITY_DETAILS_FAILURE,
  DELETE_FACILITY_REQUEST,
  DELETE_FACILITY_SUCCESS,
  DELETE_FACILITY_FAILURE,
  FETCH_FACILITY_CHARACTERISTICS_REQUEST,
  FETCH_FACILITY_CHARACTERISTICS_SUCCESS,
  FETCH_FACILITY_CHARACTERISTICS_FAILURE,
  FETCH_FACILITY_STATUS_REQUEST,
  FETCH_FACILITY_STATUS_SUCCESS,
  FETCH_FACILITY_STATUS_FAILURE,
  UPDATE_FACILITY_STATUS_REQUEST,
  UPDATE_FACILITY_STATUS_SUCCESS,
  UPDATE_FACILITY_STATUS_FAILURE,
  UPDATE_FACILITY_CHARACTERISTICS_REQUEST,
  UPDATE_FACILITY_CHARACTERISTICS_SUCCESS,
  UPDATE_FACILITY_CHARACTERISTICS_FAILURE,
  ADD_FACILITY_CHARACTERISTICS_FAILURE,
  ADD_FACILITY_CHARACTERISTICS_SUCCESS,
  ADD_FACILITY_CHARACTERISTICS_REQUEST,
  ASSIGN_FACILITIES_REQUEST,
  ASSIGN_FACILITIES_SUCCESS,
  ASSIGN_FACILITIES_FAILURE,
  FETCH_FACILITIES_DROPDOWN_REQUEST,
  FETCH_FACILITIES_DROPDOWN_SUCCESS,
  FETCH_FACILITIES_DROPDOWN_FAILURE,
  FETCH_FACILITY_MEASURE_REPORT_LIST_REQUEST,
  FETCH_FACILITY_MEASURE_REPORT_LIST_SUCCESS,
  FETCH_FACILITY_MEASURE_REPORT_LIST_FAILURE,
  FETCH_FACILITY_MEASURE_REPORT_DETAILS_FAILURE,
  FETCH_FACILITY_MEASURE_REPORT_DETAILS_SUCCESS,
  FETCH_FACILITY_MEASURE_REPORT_DETAILS_REQUEST,
  DELETE_FACILITY_MEASURE_REPORT_REQUEST,
  DELETE_FACILITY_MEASURE_REPORT_SUCCESS,
  DELETE_FACILITY_MEASURE_REPORT_FAILURE,
  FETCH_FACILITY_DOCUMENT_LIST_REQUEST,
  FETCH_FACILITY_DOCUMENT_LIST_SUCCESS,
  FETCH_FACILITY_DOCUMENT_LIST_FAILURE,
  FETCH_FACILITY_DOCUMENT_DETAILS_REQUEST,
  FETCH_FACILITY_DOCUMENT_DETAILS_SUCCESS,
  FETCH_FACILITY_DOCUMENT_DETAILS_FAILURE,
  DELETE_FACILITY_DOCUMENT_REQUEST,
  DELETE_FACILITY_DOCUMENT_SUCCESS,
  DELETE_FACILITY_DOCUMENT_FAILURE,
  UPDATE_FACILITY_MEASURE_REPORT_REQUEST,
  UPDATE_FACILITY_MEASURE_REPORT_SUCCESS,
  UPDATE_FACILITY_MEASURE_REPORT_FAILURE,
  UPDATE_FACILITY_DOCUMENT_REQUEST,
  UPDATE_FACILITY_DOCUMENT_SUCCESS,
  UPDATE_FACILITY_DOCUMENT_FAILURE,
  ADD_FACILITY_MEASURE_REPORT_REQUEST,
  ADD_FACILITY_MEASURE_REPORT_SUCCESS,
  ADD_FACILITY_MEASURE_REPORT_FAILURE,
  ADD_FACILITY_DOCUMENT_REQUEST,
  ADD_FACILITY_DOCUMENT_SUCCESS,
  ADD_FACILITY_DOCUMENT_FAILURE,
  SEND_HELP_REQ_FOR_MEASURE_REQUEST,
  SEND_HELP_REQ_FOR_MEASURE_SUCCESS,
  SEND_HELP_REQ_FOR_MEASURE_FAILURE,
  GET_WATERFALL_DATA_REQUEST,
  GET_WATERFALL_DATA_SUCCESS,
  GET_WATERFALL_DATA_FAILURE,
} from "../actionTypes";

const initialState = {
  facilityList: [],
  characteristics: [],
  facilityDetails: [],
  facilityStatus: [],
  userDetails: {},
  facilitiesDropdown: [],
  facilityMeasureReportList: [],
  facilityMeasureReportDetails: [],
  facilityDocumentList: [],
  facilityDocumentDetails: [],
  waterfallData: [],
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

    case GET_USER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_USER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        userDetails: action.payload,
        error: null,
      };
    case GET_USER_DETAILS_FAILURE:
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
    case ADD_FACILITY_CHARACTERISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_FACILITY_CHARACTERISTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADD_FACILITY_CHARACTERISTICS_FAILURE:
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
    case UPDATE_FACILITY_CHARACTERISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_FACILITY_CHARACTERISTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_FACILITY_CHARACTERISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_FACILITY_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACILITY_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityStatus: action.payload,
        error: null,
      };
    case FETCH_FACILITY_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_FACILITY_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_FACILITY_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_FACILITY_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ASSIGN_FACILITIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ASSIGN_FACILITIES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ASSIGN_FACILITIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_FACILITIES_DROPDOWN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACILITIES_DROPDOWN_SUCCESS:
      return {
        ...state,
        loading: false,
        facilitiesDropdown: action.payload,
        error: null,
      };
    case FETCH_FACILITIES_DROPDOWN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_FACILITY_MEASURE_REPORT_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACILITY_MEASURE_REPORT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityMeasureReportList: action.payload,
        error: null,
      };
    case FETCH_FACILITY_MEASURE_REPORT_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_FACILITY_MEASURE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_FACILITY_MEASURE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADD_FACILITY_MEASURE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_FACILITY_MEASURE_REPORT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACILITY_MEASURE_REPORT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityMeasureReportDetails: action.payload,
        error: null,
      };
    case FETCH_FACILITY_MEASURE_REPORT_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_FACILITY_MEASURE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_FACILITY_MEASURE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_FACILITY_MEASURE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_FACILITY_MEASURE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_FACILITY_MEASURE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_FACILITY_MEASURE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_FACILITY_DOCUMENT_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACILITY_DOCUMENT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityDocumentList: action.payload,
        error: null,
      };
    case FETCH_FACILITY_DOCUMENT_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_FACILITY_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_FACILITY_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADD_FACILITY_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_FACILITY_DOCUMENT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_FACILITY_DOCUMENT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityDocumentDetails: action.payload,
        error: null,
      };
    case FETCH_FACILITY_DOCUMENT_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_FACILITY_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_FACILITY_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_FACILITY_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_FACILITY_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_FACILITY_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_FACILITY_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SEND_HELP_REQ_FOR_MEASURE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SEND_HELP_REQ_FOR_MEASURE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case SEND_HELP_REQ_FOR_MEASURE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_WATERFALL_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_WATERFALL_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        waterfallData: action.payload,
        error: null,
      };
    case GET_WATERFALL_DATA_FAILURE:
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
