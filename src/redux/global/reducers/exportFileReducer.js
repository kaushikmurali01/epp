import {
  CLEAR_NOTIFICATION_STATE,
  FETCH_EXPORT_FILE_RECORD_ID_FAILURE,
  FETCH_EXPORT_FILE_RECORD_ID_REQUEST,
  FETCH_EXPORT_FILE_RECORD_ID_SUCCESS,
  FETCH_EXPORT_STATUS_FAILURE,
  FETCH_EXPORT_STATUS_REQUEST,
  FETCH_EXPORT_STATUS_SUCCESS,
  FETCH_UNREAD_NOTIFICATIONS_FAILURE,
  FETCH_UNREAD_NOTIFICATIONS_REQUEST,
  FETCH_UNREAD_NOTIFICATIONS_SUCCESS,
  MARK_NOTIFICATION_AS_READ_FAILURE,
  MARK_NOTIFICATION_AS_READ_REQUEST,
  MARK_NOTIFICATION_AS_READ_SUCCESS,
} from "../actionTypes";

const initialState = {
  record_id: [],
  export_data: [],
  notification_data: [],
  loading: false,
  error: null,
};

const exportFileReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXPORT_FILE_RECORD_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_EXPORT_FILE_RECORD_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        record_id: action.payload,
        error: null,
      };
    case FETCH_EXPORT_FILE_RECORD_ID_FAILURE:
      return {
        ...state,
        loading: false,
        record_id: null,
        error: action.payload,
      };
    case FETCH_EXPORT_STATUS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_EXPORT_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        export_data: action.payload,
        error: null,
      };
    case FETCH_EXPORT_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        export_data: null,
        error: action.payload,
      };
    case FETCH_UNREAD_NOTIFICATIONS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_UNREAD_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notification_data: action.payload,
        error: null,
      };
    case FETCH_UNREAD_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        notification_data: null,
        error: action.payload,
      };
    case MARK_NOTIFICATION_AS_READ_REQUEST:
      return { ...state, loading: true, error: null };
    case MARK_NOTIFICATION_AS_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case MARK_NOTIFICATION_AS_READ_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_NOTIFICATION_STATE:
      return initialState;
    default:
      return state;
  }
};

export default exportFileReducer;
