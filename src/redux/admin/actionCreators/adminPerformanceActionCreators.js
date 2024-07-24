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
  GET_EMAIL_ARCHIVE_REQUEST,
  GET_EMAIL_ARCHIVE_SUCCESS,
  GET_EMAIL_ARCHIVE_FAILURE,
  CREATE_CONTACT_REQUEST,
  CREATE_CONTACT_SUCCESS,
  CREATE_CONTACT_FAILURE,
  GET_CONTACT_REQUEST,
  GET_CONTACT_SUCCESS,
  GET_CONTACT_FAILURE,
  UPDATE_CONTACT_REQUEST,
  UPDATE_CONTACT_SUCCESS,
  UPDATE_CONTACT_FAILURE,
  DELETE_CONTACT_REQUEST,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAILURE,
} from "../actionTypes";

export const createEmailTemplateRequest = () => ({
  type: CREATE_EMAIL_TEMPLATE_REQUEST,
});

export const createEmailTemplateSuccess = (data) => ({
  type: CREATE_EMAIL_TEMPLATE_SUCCESS,
  payload: data,
});

export const createEmailTemplateFailure = (error) => ({
  type: CREATE_EMAIL_TEMPLATE_FAILURE,
  payload: error,
});

export const getEmailTemplateRequest = () => ({
  type: GET_EMAIL_TEMPLATE_REQUEST,
});

export const getEmailTemplateSuccess = (data) => ({
  type: GET_EMAIL_TEMPLATE_SUCCESS,
  payload: data,
});

export const getEmailTemplateFailure = (error) => ({
  type: GET_EMAIL_TEMPLATE_FAILURE,
  payload: error,
});

export const updateEmailTemplateRequest = () => ({
  type: UPDATE_EMAIL_TEMPLATE_REQUEST,
});

export const updateEmailTemplateSuccess = (data) => ({
  type: UPDATE_EMAIL_TEMPLATE_SUCCESS,
  payload: data,
});

export const updateEmailTemplateFailure = (error) => ({
  type: UPDATE_EMAIL_TEMPLATE_FAILURE,
  payload: error,
});

export const deleteEmailTemplateRequest = () => ({
  type: DELETE_EMAIL_TEMPLATE_REQUEST,
});

export const deleteEmailTemplateSuccess = (data) => ({
  type: DELETE_EMAIL_TEMPLATE_SUCCESS,
  payload: data,
});

export const deleteEmailTemplateFailure = (error) => ({
  type: DELETE_EMAIL_TEMPLATE_FAILURE,
  payload: error,
});

export const getIncentiveSettingsRequest = () => ({
  type: GET_INCENTIVE_SETTINGS_REQUEST,
});

export const getIncentiveSettingsSuccess = (data) => ({
  type: GET_INCENTIVE_SETTINGS_SUCCESS,
  payload: data,
});

export const getIncentiveSettingsFailure = (error) => ({
  type: GET_INCENTIVE_SETTINGS_FAILURE,
  payload: error,
});

export const updateIncentiveSettingsRequest = () => ({
  type: UPDATE_INCENTIVE_SETTINGS_REQUEST,
});

export const updateIncentiveSettingsSuccess = (data) => ({
  type: UPDATE_INCENTIVE_SETTINGS_SUCCESS,
  payload: data,
});

export const updateIncentiveSettingsFailure = (error) => ({
  type: UPDATE_INCENTIVE_SETTINGS_FAILURE,
  payload: error,
});

export const sendEmailRequest = () => ({
  type: SEND_EMAIL_REQUEST,
});

export const sendEmailSuccess = (data) => ({
  type: SEND_EMAIL_SUCCESS,
  payload: data,
});

export const sendEmailFailure = (error) => ({
  type: SEND_EMAIL_FAILURE,
  payload: error,
});

export const createContactRequest = () => ({
  type: CREATE_CONTACT_REQUEST,
});

export const createContactSuccess = (data) => ({
  type: CREATE_CONTACT_SUCCESS,
  payload: data,
});

export const createContactFailure = (error) => ({
  type: CREATE_CONTACT_FAILURE,
  payload: error,
});
export const getContactRequest = () => ({
  type: GET_CONTACT_REQUEST,
});

export const getContactSuccess = (data) => ({
  type: GET_CONTACT_SUCCESS,
  payload: data,
});

export const getContactFailure = (error) => ({
  type: GET_CONTACT_FAILURE,
  payload: error,
});

export const updateContactRequest = () => ({
  type: UPDATE_CONTACT_REQUEST,
});

export const updateContactSuccess = (data) => ({
  type: UPDATE_CONTACT_SUCCESS,
  payload: data,
});

export const updateContactFailure = (error) => ({
  type: UPDATE_CONTACT_FAILURE,
  payload: error,
});

export const deleteContactRequest = () => ({
  type: DELETE_CONTACT_REQUEST,
});

export const deleteContactSuccess = (data) => ({
  type: DELETE_CONTACT_SUCCESS,
  payload: data,
});

export const deleteContactFailure = (error) => ({
  type: DELETE_CONTACT_FAILURE,
  payload: error,
});

export const getEmailArchiveRequest = () => ({
  type: GET_EMAIL_ARCHIVE_REQUEST,
});

export const getEmailArchiveSuccess = (data) => ({
  type: GET_EMAIL_ARCHIVE_SUCCESS,
  payload: data,
});

export const getEmailArchiveFailure = (error) => ({
  type: GET_EMAIL_ARCHIVE_FAILURE,
  payload: error,
});