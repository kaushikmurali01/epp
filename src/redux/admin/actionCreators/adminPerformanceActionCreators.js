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
  type: GET_EMAIL_TEMPLATE_REQUEST,
});

export const sendEmailSuccess = (data) => ({
  type: GET_EMAIL_TEMPLATE_SUCCESS,
  payload: data,
});

export const sendEmailFailure = (error) => ({
  type: GET_EMAIL_TEMPLATE_FAILURE,
  payload: error,
});