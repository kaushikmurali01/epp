import {
    FETCH_ADMIN_COMPANY_DETAILS_FAILURE,
    FETCH_ADMIN_COMPANY_DETAILS_REQUEST,
  FETCH_ADMIN_COMPANY_DETAILS_SUCCESS,
  FETCH_ADMIN_COMPANY_LIST_FAILURE,
  FETCH_ADMIN_COMPANY_LIST_REQUEST,
  FETCH_ADMIN_COMPANY_LIST_SUCCESS,
} from "../actionTypes";

const initialState = {
  companyList: [],
  companyDetails:[],
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
    default:
      return state;
  }
};

export default adminCompanyReducer;
