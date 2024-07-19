import { DELETE_REQUEST, GET_REQUEST, POST_REQUEST, PUT_REQUEST } from "utils/HTTPRequests";
import {
  createEmailTemplateFailure,
  createEmailTemplateRequest,
  createEmailTemplateSuccess,
  getEmailTemplateFailure,
  getEmailTemplateRequest,
  getEmailTemplateSuccess,
  updateEmailTemplateFailure,
  updateEmailTemplateRequest,
  updateEmailTemplateSuccess,
  deleteEmailTemplateFailure,
  deleteEmailTemplateRequest,
  deleteEmailTemplateSuccess,
  getIncentiveSettingsFailure,
  getIncentiveSettingsRequest,
  getIncentiveSettingsSuccess,
  updateIncentiveSettingsFailure,
  updateIncentiveSettingsRequest,
  updateIncentiveSettingsSuccess,
  sendEmailFailure,
  sendEmailRequest,
  sendEmailSuccess,
} from "../actionCreators/adminPerformanceActionCreators";
import NotificationsToast from "../../../utils/notification/NotificationsToast";
import { PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS } from "constants/apiEndPoints";

export const createEmailTemplate = (templateData) => {
  return async (dispatch) => {
    dispatch(createEmailTemplateRequest());
    const apiURL = PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.CRUD_EMAIL_TEMPLATE;

    try {
      const response = await POST_REQUEST(apiURL, templateData);
      dispatch(createEmailTemplateSuccess(response?.data))
      NotificationsToast({
        message: "Email template created successfully.",
        type: "success",
      });
    } catch (error) {
      dispatch(createEmailTemplateFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getEmailTemplate = (facilityId) => {
  return async (dispatch) => { 
    dispatch(getEmailTemplateRequest());
    const apiURL = PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.GET_EMAIL_TEMPLATE;
    try {
      const response = await GET_REQUEST(`${apiURL}/${facilityId}`);
      dispatch(getEmailTemplateSuccess(response?.data));
      return response;
    } catch (error) {
      dispatch(getEmailTemplateFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
 
export const updateEmailTemplate = (templateData) => {
  return async (dispatch) => {
    dispatch(updateEmailTemplateRequest());

    const { template_id, name, body, subject } = templateData;

    const apiURL = `${PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.CRUD_EMAIL_TEMPLATE}/${template_id}`;

    let payload = {
      name,
      subject,
      body,
    };
    try {
      const response = await PUT_REQUEST(apiURL, payload);
      dispatch(updateEmailTemplateSuccess(response?.data));
      NotificationsToast({
        message: "Email template updated successfully.",
        type: "success",
      });
    } catch (error) {
      dispatch(updateEmailTemplateFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteEmailTemplate = (template_id) => {
  return async (dispatch) => {
    dispatch(deleteEmailTemplateRequest());
    const apiURL = PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.CRUD_EMAIL_TEMPLATE;
    try {
      const response = await DELETE_REQUEST(`${apiURL}/${template_id}`);
      dispatch(deleteEmailTemplateSuccess(response?.data));
      NotificationsToast({
        message: response?.message
          ? response.message
          : "Email template deleted successfully.",
        type: "success",
      });
    } catch (error) {
      dispatch(deleteEmailTemplateFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getIncentiveSettings = (facilityId) => {
  return async (dispatch) => {
    dispatch(getIncentiveSettingsRequest());
    const apiURL = PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.GET_UPDATE_INCENTIVE_SETTINGS;
    try {
      const response = await GET_REQUEST(`${apiURL}/${facilityId}`);
      dispatch(getIncentiveSettingsSuccess(response?.data));
      return response;
    } catch (error) {
      dispatch(getIncentiveSettingsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateIncentiveSettings = (updatedSettingsPayload, facility_id) => {
  return async (dispatch) => {
    dispatch(updateIncentiveSettingsRequest());
    const apiURL = `${PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.GET_UPDATE_INCENTIVE_SETTINGS}/${facility_id}`;

    try {
      const response = await PUT_REQUEST(apiURL, updatedSettingsPayload);
      dispatch(updateIncentiveSettingsSuccess(response?.data));
      NotificationsToast({
        message: "Settings updated successfully.",
        type: "success",
      });
    } catch (error) {
      dispatch(updateIncentiveSettingsFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const sendEmail = (emailPayload, facility_id) => {
  return async (dispatch) => {
    dispatch(sendEmailRequest());
    const apiURL = `${PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.SEND_EMAIL}/${facility_id}`;

    try {
      const response = await POST_REQUEST(apiURL, emailPayload);
      dispatch(sendEmailSuccess(response?.data));
      NotificationsToast({
        message: "Email sent successfully.",
        type: "success",
      });
    } catch (error) {
      dispatch(sendEmailFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};