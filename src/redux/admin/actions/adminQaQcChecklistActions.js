import { QA_QC_CHECKLIST_ENDPOINT } from "constants/apiEndPoints";
import {
  getAdminQaQcChecklistFailure,
  getAdminQaQcChecklistRequest,
  getAdminQaQcChecklistSuccess,
  updateAdminQaQcChecklistFailure,
  updateAdminQaQcChecklistRequest,
  updateAdminQaQcChecklistSuccess,
} from "../actionCreators/adminQaQcChecklistActionCreator";
import { GET_REQUEST, PUT_REQUEST } from "utils/HTTPRequests";
import NotificationsToast from "utils/notification/NotificationsToast";

export const getQaQcChecklist = (facility_id) => {
  return async (dispatch) => {
    dispatch(getAdminQaQcChecklistRequest());
    const apiURL = QA_QC_CHECKLIST_ENDPOINT.CHECKLIST;
    try {
      const response = await GET_REQUEST(`${apiURL}/${facility_id}`);
      dispatch(getAdminQaQcChecklistSuccess(response?.data?.data));
      console.log(response?.data?.data);
      return response?.data?.data;
    } catch (error) {
      dispatch(getAdminQaQcChecklistFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateQaQcChecklist = (payloadWithAnswer) => {
  return async (dispatch) => {
    dispatch(updateAdminQaQcChecklistRequest());
    const { facility_id, ques_id, answer } = payloadWithAnswer;

    const apiURL = `${QA_QC_CHECKLIST_ENDPOINT.CHECKLIST}/${facility_id}/${ques_id}`;

    let payload = {
      answer: answer,
    };

    try {
      const response = await PUT_REQUEST(apiURL, payload);
      dispatch(updateAdminQaQcChecklistSuccess(response?.data));
      NotificationsToast({
        message: "Checklist updated successfully.",
        type: "success",
      });
    } catch (error) {
      dispatch(updateAdminQaQcChecklistFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
