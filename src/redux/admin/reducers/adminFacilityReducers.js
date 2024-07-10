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
  FETCH_ADMIN_FACILITY_DETAILS_REQUEST,
  FETCH_ADMIN_FACILITY_DETAILS_SUCCESS,
  FETCH_ADMIN_FACILITY_DETAILS_FAILURE,
  FETCH_ADMIN_FACILITY_STATUS_REQUEST,
  FETCH_ADMIN_FACILITY_STATUS_SUCCESS,
  FETCH_ADMIN_FACILITY_STATUS_FAILURE,
  UPDATE_ADMIN_FACILITY_STATUS_REQUEST,
  UPDATE_ADMIN_FACILITY_STATUS_SUCCESS,
  UPDATE_ADMIN_FACILITY_STATUS_FAILURE,
  ADMIN_ASSIGN_FACILITIES_REQUEST,
  ADMIN_ASSIGN_FACILITIES_SUCCESS,
  ADMIN_ASSIGN_FACILITIES_FAILURE,
  FETCH_ADMIN_FACILITIES_DROPDOWN_REQUEST,
  FETCH_ADMIN_FACILITIES_DROPDOWN_SUCCESS,
  FETCH_ADMIN_FACILITIES_DROPDOWN_FAILURE,
  FETCH_ADMIN_STATISTICS_REQUEST,
  FETCH_ADMIN_STATISTICS_SUCCESS,
  FETCH_ADMIN_STATISTICS_FAILURE,
  DOWNLOAD_FACILITIES_BULK_REQUEST,
  DOWNLOAD_FACILITIES_BULK_SUCCESS,
  DOWNLOAD_FACILITIES_BULK_FAILURE,
  DOWNLOAD_FACILITY_ROW_REQUEST,
  DOWNLOAD_FACILITY_ROW_SUCCESS,
  DOWNLOAD_FACILITY_ROW_FAILURE,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_REQUEST,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_SUCCESS,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_FAILURE,
  ADMIN_ADD_FACILITY_MEASURE_REPORT_REQUEST,
  ADMIN_ADD_FACILITY_MEASURE_REPORT_SUCCESS,
  ADMIN_ADD_FACILITY_MEASURE_REPORT_FAILURE,
  FETCH_ADMIN_FACILITY_DOCUMENT_LIST_REQUEST,
  FETCH_ADMIN_FACILITY_DOCUMENT_LIST_SUCCESS,
  FETCH_ADMIN_FACILITY_DOCUMENT_LIST_FAILURE,
  ADMIN_ADD_FACILITY_DOCUMENT_REQUEST,
  ADMIN_ADD_FACILITY_DOCUMENT_SUCCESS,
  ADMIN_ADD_FACILITY_DOCUMENT_FAILURE,
  FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_REQUEST,
  FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_SUCCESS,
  FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_FAILURE,
  UPDATE_ADMIN_FACILITY_DOCUMENT_REQUEST,
  UPDATE_ADMIN_FACILITY_DOCUMENT_SUCCESS,
  UPDATE_ADMIN_FACILITY_DOCUMENT_FAILURE,
  DELETE_ADMIN_FACILITY_DOCUMENT_REQUEST,
  DELETE_ADMIN_FACILITY_DOCUMENT_SUCCESS,
  DELETE_ADMIN_FACILITY_DOCUMENT_FAILURE,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_REQUEST,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_SUCCESS,
  FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_FAILURE,
  UPDATE_ADMIN_FACILITY_MEASURE_REPORT_REQUEST,
  UPDATE_ADMIN_FACILITY_MEASURE_REPORT_SUCCESS,
  UPDATE_ADMIN_FACILITY_MEASURE_REPORT_FAILURE,
  DELETE_ADMIN_FACILITY_MEASURE_REPORT_REQUEST,
  DELETE_ADMIN_FACILITY_MEASURE_REPORT_SUCCESS,
  DELETE_ADMIN_FACILITY_MEASURE_REPORT_FAILURE,
  FETCH_ADMIN_FACILITY_LIST_ACTIVE_REQUEST,
  FETCH_ADMIN_FACILITY_LIST_ACTIVE_SUCCESS,
  FETCH_ADMIN_FACILITY_LIST_ACTIVE_FAILURE,
} from "../actionTypes";

const initialState = {
  facilityList: [],
  facilityActiveList: [],
  characteristics: [],
  facilityDetails: [],
  facilityStatus: [],
  facilitiesDropdown: [],
  facilityStatistics: [],
  downloadFacilitiesBulkData: [],
  downloadFacilityRowData: [],
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
    case FETCH_ADMIN_FACILITY_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_DETAILS_SUCCESS:
      return {
        ...state,
        facilityDetails: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_DETAILS_FAILURE:
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
    case FETCH_ADMIN_FACILITY_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityStatus: action.payload,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_ADMIN_FACILITY_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_ADMIN_FACILITY_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_ADMIN_FACILITY_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADMIN_ASSIGN_FACILITIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_ASSIGN_FACILITIES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADMIN_ASSIGN_FACILITIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_FACILITIES_DROPDOWN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_FACILITIES_DROPDOWN_SUCCESS:
      return {
        ...state,
        loading: false,
        facilitiesDropdown: action.payload,
        error: null,
      };
    case FETCH_ADMIN_FACILITIES_DROPDOWN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_STATISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_STATISTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityStatistics: action.payload,
        error: null,
      };
    case FETCH_ADMIN_STATISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DOWNLOAD_FACILITIES_BULK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DOWNLOAD_FACILITIES_BULK_SUCCESS:
      return {
        ...state,
        loading: false,
        downloadFacilitiesBulkData: action.payload,
        error: null,
      };
    case DOWNLOAD_FACILITIES_BULK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DOWNLOAD_FACILITY_ROW_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DOWNLOAD_FACILITY_ROW_SUCCESS:
      return {
        ...state,
        loading: false,
        downloadFacilityRowData: action.payload,
        error: null,
      };
    case DOWNLOAD_FACILITY_ROW_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityMeasureReportList: action.payload,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_MEASURE_REPORT_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADMIN_ADD_FACILITY_MEASURE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_ADD_FACILITY_MEASURE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADMIN_ADD_FACILITY_MEASURE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityMeasureReportDetails: action.payload,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_MEASURE_REPORT_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_ADMIN_FACILITY_MEASURE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_ADMIN_FACILITY_MEASURE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_ADMIN_FACILITY_MEASURE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_ADMIN_FACILITY_MEASURE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_ADMIN_FACILITY_MEASURE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_ADMIN_FACILITY_MEASURE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_FACILITY_DOCUMENT_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_DOCUMENT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityDocumentList: action.payload,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_DOCUMENT_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADMIN_ADD_FACILITY_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_ADD_FACILITY_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADMIN_ADD_FACILITY_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        facilityDocumentDetails: action.payload,
        error: null,
      };
    case FETCH_ADMIN_FACILITY_DOCUMENT_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_ADMIN_FACILITY_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_ADMIN_FACILITY_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_ADMIN_FACILITY_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_ADMIN_FACILITY_DOCUMENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_ADMIN_FACILITY_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_ADMIN_FACILITY_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case FETCH_ADMIN_FACILITY_LIST_ACTIVE_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_ADMIN_FACILITY_LIST_ACTIVE_SUCCESS:
        return {
          ...state,
          loading: false,
          facilityActiveList: action.payload,
          error: null,
        };
      case FETCH_ADMIN_FACILITY_LIST_ACTIVE_FAILURE:
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
