import {
  FILE_UPLOAD_REQUEST,
  FILE_UPLOAD_SUCCESS,
  FILE_UPLOAD_FAILURE,
} from "../actionTypes";

export const fileUploadRequest = () => ({
  type: FILE_UPLOAD_REQUEST,
});

export const fileUploadSuccess = (data) => ({
  type: FILE_UPLOAD_SUCCESS,
  payload: data,
});

export const fileUploadFailure = (error) => ({
  type: FILE_UPLOAD_FAILURE,
  payload: error,
});
