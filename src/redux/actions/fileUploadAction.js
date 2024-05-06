import { fileUploadEndPoints } from "constants/apiEndPoints";
import {
  fileUploadRequest,
  fileUploadSuccess,
  fileUploadFailure,
} from "../actionCreators/fileUploadActionCreator";
import { POST_REQUEST } from "utils/HTTPRequests";

export const fileUploadAction = (uploadData) => {
  console.log(uploadData);
  return async (dispatch) => {
    try {
      dispatch(fileUploadRequest());
      const formData = new FormData();
      formData.append("file", uploadData);
      const endpoint = fileUploadEndPoints.FILE_UPLOAD;
      const response = await POST_REQUEST(endpoint, formData, true);
      const data = response.data;
      dispatch(fileUploadSuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(fileUploadFailure(error));
    }
  };
};
