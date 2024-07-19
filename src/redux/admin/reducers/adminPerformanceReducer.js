import {
  CREATE_EMAIL_TEMPLATE_REQUEST,
  CREATE_EMAIL_TEMPLATE_SUCCESS,
  CREATE_EMAIL_TEMPLATE_FAILURE,
  GET_EMAIL_TEMPLATE_REQUEST,
  GET_EMAIL_TEMPLATE_SUCCESS,
  GET_EMAIL_TEMPLATE_FAILURE,
  UPDATE_EMAIL_TEMPLATE_REQUEST,
  UPDATE_EMAIL_TEMPLATE_SUCCESS,
  UPDATE_EMAIL_TEMPLATE_FAILURE,
  DELETE_EMAIL_TEMPLATE_REQUEST,
  DELETE_EMAIL_TEMPLATE_SUCCESS,
  DELETE_EMAIL_TEMPLATE_FAILURE,
  GET_INCENTIVE_SETTINGS_REQUEST,
  GET_INCENTIVE_SETTINGS_SUCCESS,
  GET_INCENTIVE_SETTINGS_FAILURE,
  UPDATE_INCENTIVE_SETTINGS_REQUEST,
  UPDATE_INCENTIVE_SETTINGS_SUCCESS,
  UPDATE_INCENTIVE_SETTINGS_FAILURE,
  SEND_EMAIL_REQUEST,
  SEND_EMAIL_SUCCESS,
  SEND_EMAIL_FAILURE,
} from "../actionTypes";

const initialState = {
  loading: false,
  emailTemplate: null,
  emailTemplateList: [],
  editedEmailTemplate: null,
  incentiveSettings: null,
  emailSent: "",
  error: null,
};

const adminPerformanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EMAIL_TEMPLATE_REQUEST:
      return { ...state, loading: true };
    case CREATE_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        emailTemplate: action.payload,
        error: null,
      };
    case CREATE_EMAIL_TEMPLATE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_EMAIL_TEMPLATE_REQUEST:
      return { ...state, loading: true };
    case GET_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        emailTemplateList: action.payload,
        error: null,
      };
    case GET_EMAIL_TEMPLATE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_EMAIL_TEMPLATE_REQUEST:
      return { ...state, loading: true };
    case UPDATE_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        editedEmailTemplate: action.payload,
        error: null,
      };
    case UPDATE_EMAIL_TEMPLATE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_EMAIL_TEMPLATE_REQUEST:
      return { ...state, loading: true };
    case DELETE_EMAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_EMAIL_TEMPLATE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_INCENTIVE_SETTINGS_REQUEST:
      return { ...state, loading: true };
    case GET_INCENTIVE_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        incentiveSettings: action.payload,
        error: null,
      };
    case GET_INCENTIVE_SETTINGS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_INCENTIVE_SETTINGS_REQUEST:
      return { ...state, loading: true };
    case UPDATE_INCENTIVE_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        incentiveSettings: action.payload,
        error: null,
      };
    case UPDATE_INCENTIVE_SETTINGS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SEND_EMAIL_REQUEST:
      return { ...state, loading: true };
    case SEND_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        emailSent: action.payload,
        error: null,
      };
    case SEND_EMAIL_FAILURE:
      return { ...state, loading: false, error: action.payload };
    
    default:
      return state;
  }
};

export default adminPerformanceReducer;
