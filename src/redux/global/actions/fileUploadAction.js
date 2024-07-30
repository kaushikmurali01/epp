import { fileUploadEndPoints } from "constants/apiEndPoints";
import {
  fileUploadRequest,
  fileUploadSuccess,
  fileUploadFailure,
} from "../actionCreators/fileUploadActionCreator.js";
import { POST_REQUEST } from "utils/HTTPRequests";
import NotificationsToast from "../../../utils/notification/NotificationsToast.js";

export const fileUploadAction = (uploadData) => {
  return async (dispatch) => {
    try {
      dispatch(fileUploadRequest());
      const formData = new FormData();
      formData.append("file", uploadData);
      const endpoint = fileUploadEndPoints.FILE_UPLOAD;
      const response = await POST_REQUEST(endpoint, formData, true, "");
      const data = response.data;
      dispatch(fileUploadSuccess(data));
      NotificationsToast({
        message: "File uploaded successfully!",
        type: "success",
      });
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fileUploadFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const documentFileUploadAction = (uploadData) => {
  return async (dispatch) => {
    try {
      dispatch(fileUploadRequest());
      const formData = new FormData();
      formData.append("file", uploadData);
      const endpoint = fileUploadEndPoints.FILE_UPLOAD;
      const response = await POST_REQUEST(endpoint, formData, true, "");
      const data = response.data;
      dispatch(fileUploadSuccess(data));
      // NotificationsToast({
      //   message: "Image uploaded successfully!",
      //   type: "success",
      // });
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fileUploadFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};


export const commonDocumentFileUploadAction = (endPoint,payload,onUploadProgress) => {
  return async (dispatch) => {
    try {
      dispatch(fileUploadRequest());
      // console.log(endPoint,payload, "check upload");
      // return;
      const response = await POST_REQUEST(endPoint, payload, true, "",onUploadProgress);
      const data = response.data;
      dispatch(fileUploadSuccess(data));
      NotificationsToast({
        message: data?.message || data?.error,
        type: data?.error ? "error" : "success",
      });
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fileUploadFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
