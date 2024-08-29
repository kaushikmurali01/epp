import {
  FETCH_ADMIN_COMPANY_DETAILS_FAILURE,
  FETCH_ADMIN_COMPANY_DETAILS_REQUEST,
  FETCH_ADMIN_COMPANY_DETAILS_SUCCESS,
  FETCH_ADMIN_COMPANY_LIST_FAILURE,
  FETCH_ADMIN_COMPANY_LIST_REQUEST,
  FETCH_ADMIN_COMPANY_LIST_SUCCESS,
  ADMIN_COMPANY_SEND_ALERT_REQUEST,
  ADMIN_COMPANY_SEND_ALERT_SUCCESS,
  ADMIN_COMPANY_SEND_ALERT_FAILURE,
  ADMIN_COMPANY_UPDATE_STATUS_REQUEST,
  ADMIN_COMPANY_UPDATE_STATUS_SUCCESS,
  ADMIN_COMPANY_UPDATE_STATUS_FAILURE,
  FETCH_ADMIN_COMPANIES_DROPDOWN_REQUEST,
  FETCH_ADMIN_COMPANIES_DROPDOWN_SUCCESS,
  FETCH_ADMIN_COMPANIES_DROPDOWN_FAILURE,
  DELETE_COMPANY_REQUEST,
  DELETE_COMPANY_SUCCESS,
  DELETE_COMPANY_FAILURE,
  CHANGE_COMPANY_SUPER_ADMIN_REQUEST,
  CHANGE_COMPANY_SUPER_ADMIN_SUCCESS,
  CHANGE_COMPANY_SUPER_ADMIN_FAILURE,
  FETCH_COMPANY_USER_LIST_REQUEST,
  FETCH_COMPANY_USER_LIST_SUCCESS,
  FETCH_COMPANY_USER_LIST_FAILURE,
  FETCH_USERS_BY_COMPANY_REQUEST,
  FETCH_USERS_BY_COMPANY_SUCCESS,
  FETCH_USERS_BY_COMPANY_FAILURE,
} from "../actionTypes";

const initialState = {
  companyList: [],
  companyDetails: [],
  companiesDropdown: [],
  companyUserList: [],
  companyUsersById: [],
  loading: false,
  error: null,
};

const adminCompanyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADMIN_COMPANY_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_COMPANY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        companyList: action.payload,
        error: null,
      };
    case FETCH_ADMIN_COMPANY_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_COMPANY_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_COMPANY_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        companyDetails: action.payload,
        error: null,
      };
    case FETCH_ADMIN_COMPANY_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADMIN_COMPANY_SEND_ALERT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_COMPANY_SEND_ALERT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADMIN_COMPANY_SEND_ALERT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADMIN_COMPANY_UPDATE_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_COMPANY_UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADMIN_COMPANY_UPDATE_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_ADMIN_COMPANIES_DROPDOWN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_COMPANIES_DROPDOWN_SUCCESS:
      return {
        ...state,
        loading: false,
        companiesDropdown: action.payload,
        error: null,
      };
    case FETCH_ADMIN_COMPANIES_DROPDOWN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_COMPANY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_COMPANY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_COMPANY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CHANGE_COMPANY_SUPER_ADMIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CHANGE_COMPANY_SUPER_ADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case CHANGE_COMPANY_SUPER_ADMIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_COMPANY_USER_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_COMPANY_USER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        companyUserList: {
          ...action?.payload,
          data: action?.payload?.data?.map((item) => ({
            ...item,
            full_name: `${item?.User?.first_name} ${item?.User?.last_name}`,
          })),
        },
        error: null,
      };
    case FETCH_COMPANY_USER_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_USERS_BY_COMPANY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_USERS_BY_COMPANY_SUCCESS:
      return {
        ...state,
        loading: false,
        companyUsersById: action.payload,
        error: null,
      };
    case FETCH_USERS_BY_COMPANY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default adminCompanyReducer;
