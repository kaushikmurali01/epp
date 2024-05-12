import {
  FILE_UPLOAD_REQUEST,
  FILE_UPLOAD_SUCCESS,
  FILE_UPLOAD_FAILURE,
} from "../actionTypes";

const initialState = {
  loading: false,
  file: null,
  error: null,
};

const fileUploadReducer = (state = initialState, action) => {
  switch (action.type) {
    case FILE_UPLOAD_REQUEST:
      return { ...state, loading: true, file: null, error: null };
    case FILE_UPLOAD_SUCCESS:
      return { ...state, loading: false, file: action.payload, error: null };
    case FILE_UPLOAD_FAILURE:
      return { ...state, loading: false, file: null, error: action.payload };
    default:
      return state;
  }
};

export default fileUploadReducer;
