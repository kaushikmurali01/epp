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
  createContactFailure,
  createContactRequest,
  createContactSuccess,
  getContactRequest,
  getContactSuccess,
  getContactFailure,
  deleteContactRequest,
  deleteContactSuccess,
  deleteContactFailure,
  updateContactRequest,
  updateContactSuccess,
  updateContactFailure,
  getEmailArchiveFailure,
  getEmailArchiveRequest,
  getEmailArchiveSuccess,
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

export const createContact = (contactPayload, facilityId) => {
  return async (dispatch) => {
    dispatch(createContactRequest());
    const apiURL = `${PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.CRUD_CONTACTS}/${facilityId}/contact`;

    try {
      const response = await POST_REQUEST(apiURL, contactPayload);
      dispatch(createContactSuccess(response?.data));
      NotificationsToast({
        message: "Contact created successfully.",
        type: "success",
      });
    } catch (error) {
      dispatch(createContactFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getContacts = (facilityId) => {
  return async (dispatch) => {
    dispatch(getContactRequest());
    const apiURL = `${PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.CRUD_CONTACTS}/${facilityId}/contacts`;
    try {
      const response = await GET_REQUEST(apiURL);
      dispatch(getContactSuccess(response?.data));
    } catch (error) {
      dispatch(getContactFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteContact = (facilityId, contactId) => {
  return async (dispatch) => {
    dispatch(deleteContactRequest());
    const apiURL = PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.CRUD_CONTACTS;
    try {
      const response = await DELETE_REQUEST(
        `${apiURL}/${facilityId}/contact/${contactId}`
      );
      dispatch(deleteContactSuccess(response?.data));
      NotificationsToast({
        message: response?.message
          ? response.message
          : "Contact deleted successfully.",
        type: "success",
      });
    } catch (error) {
      dispatch(deleteContactFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateContact = (contactId, updatedContactPayload, facilityId) => {
  return async (dispatch) => {
    dispatch(updateContactRequest());
    const apiURL = `${PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.CRUD_CONTACTS}/${facilityId}/contact/${contactId}`;
    try {
      const response = await PUT_REQUEST(apiURL, updatedContactPayload);
      dispatch(updateContactSuccess(response?.data));
      NotificationsToast({
        message: "Contact updated successfully.",
        type: "success",
      });
    } catch (error) {
      dispatch(updateContactFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getEmailArchiveList = (facilityId) => {
  return async (dispatch) => {
    dispatch(getEmailArchiveRequest());
    const apiURL = PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS.SEND_EMAIL;
    try {
      const response = await GET_REQUEST(`${apiURL}/${facilityId}`);
      dispatch(getEmailArchiveSuccess(response?.data));
      return response;
    } catch (error) {
      dispatch(getEmailArchiveFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};