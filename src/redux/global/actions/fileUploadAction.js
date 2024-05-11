import { fileUploadEndPoints } from "constants/apiEndPoints";
import {
  fileUploadRequest,
  fileUploadSuccess,
  fileUploadFailure,
} from "../actionCreators/fileUploadActionCreator.js";
import { POST_REQUEST } from "utils/HTTPRequests";
import NotificationsTost from "../../../utils/notification/NotificationsToast.js";

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
      NotificationsTost({
        message: "Image uploaded successfully!",
        type: "success",
      });
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fileUploadFailure(error));
      NotificationsTost({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
