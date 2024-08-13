import { DELETE_REQUEST, GET_REQUEST, PATCH_REQUEST, POST_REQUEST, PUT_REQUEST } from "utils/HTTPRequests";
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
  getAdminBaselineDataSummaryFailure,
  getAdminBaselineDataSummaryRequest,
  getAdminBaselineDataSummarySuccess,
  createAdminNonRoutineEventFailure,
  createAdminNonRoutineEventRequest,
  createAdminNonRoutineEventSuccess,
  getAdminNonRoutineEventListFailure,
  getAdminNonRoutineEventListRequest,
  getAdminNonRoutineEventListSuccess,
  addAdminNonRoutineEventDataFailure,
  addAdminNonRoutineEventDataRequest,
  addAdminNonRoutineEventDataSuccess,
  getAdminNonRoutineEventDetailRequest,
  getAdminNonRoutineEventDetailSuccess,
  getAdminNonRoutineEventDetailFailure,
  deleteAdminNonRoutineEventDataRequest,
  deleteAdminNonRoutineEventDataSuccess,
  deleteAdminNonRoutineEventRequest,
  deleteAdminNonRoutineEventSuccess,
  deleteAdminNonRoutineEventFailure,
  deleteAdminNonRoutineEventDataFailure,
  editAdminNonRoutineEventFailure,
  editAdminNonRoutineEventRequest,
  editAdminNonRoutineEventSuccess,
  editAdminNonRoutineEventDataRequest,
  editAdminNonRoutineEventDataSuccess,
  editAdminNonRoutineEventDataFailure,
  calculateAdminPerformanceReportRequest,
  calculateAdminPerformanceReportSuccess,
  calculateAdminPerformanceReportFailure,
  updateAdminPerformanceReportRequest,
  updateAdminPerformanceReportSuccess,
  updateAdminPerformanceReportFailure,
  getAdminPerformanceReportRequest,
  getAdminPerformanceReportSuccess,
  getAdminPerformanceReportFailure,
  scoreAdminPerformanceDataRequest,
  scoreAdminPerformanceDataSuccess,
  scoreAdminPerformanceDataFailure,
  getAdminPerformanceDataMinMaxDateRequest,
  getAdminPerformanceDataMinMaxDateSuccess,
  getAdminPerformanceDataMinMaxDateFailure,
  getAdminPerformanceDataVisualizationRequest,
  getAdminPerformanceDataVisualizationSuccess,
  getAdminPerformanceDataVisualizationFailure,
} from "../actionCreators/adminPerformanceActionCreators";
import NotificationsToast from "../../../utils/notification/NotificationsToast";
import { PERFORMANCE_ADMIN_SETTINGS_ENDPOINTS, PERFORMANCE_ENDPOINTS } from "constants/apiEndPoints";

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

export const getAdminBaselineDataSummary = (facility_id, meter_type) => {
  return async (dispatch) => {
    try {
      dispatch(getAdminBaselineDataSummaryRequest());
      let endpointWithParams = `${PERFORMANCE_ENDPOINTS.GET_BASELINE_DATA_SUMMARY}?facility_id=${facility_id}&meter_type=${meter_type}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(getAdminBaselineDataSummarySuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(getAdminBaselineDataSummaryFailure(error));
      NotificationsToast({
        message: error?.response?.data?.error
          ? error?.response?.data?.error
          : error.message,
        type: "error",
      });
      throw error;
    }
  };
};

export const addAdminNonRoutineEvent = (nonRoutinePayload) => {
  return async (dispatch) => {
    try {
      dispatch(createAdminNonRoutineEventRequest());
      let apiUrl = PERFORMANCE_ENDPOINTS.ADD_NON_ROUTINE_EVENT;
      const response = await POST_REQUEST(apiUrl, nonRoutinePayload);
      dispatch(createAdminNonRoutineEventSuccess(response?.data));
      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(createAdminNonRoutineEventFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getAdminNonRoutineEventList = (
  facilityId,
  meter_type,
  page,
  limit
) => {
  return async (dispatch) => {
    try {
      dispatch(getAdminNonRoutineEventListRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.GET_NON_ROUTINE_EVENT_LIST}/${facilityId}/${page}/${limit}?meter_type=${meter_type}`;
      const response = await GET_REQUEST(apiURL);
      dispatch(getAdminNonRoutineEventListSuccess(response?.data?.data?.rows));
      return response?.data?.data;
    } catch (error) {
      console.error(error);
      dispatch(getAdminNonRoutineEventListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const addAdminNonRoutineEventData = (nonRoutineDataPayload) => {
  return async (dispatch) => {
    try {
      dispatch(addAdminNonRoutineEventDataRequest());
      let apiUrl = PERFORMANCE_ENDPOINTS.ADD_NON_ROUTINE_EVENT_DATA;
      const response = await POST_REQUEST(apiUrl, nonRoutineDataPayload);
      dispatch(addAdminNonRoutineEventDataSuccess(response?.data));
      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(addAdminNonRoutineEventDataFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getAdminNonRoutineEventDetails = (eventId) => {
  return async (dispatch) => {
    try {
      dispatch(getAdminNonRoutineEventDetailRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.GET_NON_ROUTINE_EVENT_DETAIL}/${eventId}`;
      const response = await GET_REQUEST(apiURL);
      const data = response?.data?.data;
      dispatch(getAdminNonRoutineEventDetailSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(getAdminNonRoutineEventDetailFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteAdminNonRoutineEvent = (eventId) => {
  return async (dispatch) => {
    try {
      dispatch(deleteAdminNonRoutineEventRequest());
      let apiUrl = PERFORMANCE_ENDPOINTS.DELETE_NON_ROUTINE_EVENT;
      const response = await DELETE_REQUEST(`${apiUrl}/${eventId}`);
      dispatch(deleteAdminNonRoutineEventSuccess(response.data));
      NotificationsToast({
        message: response?.message
          ? response.message
          : "Non routine event deleted successfully.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteAdminNonRoutineEventFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const deleteAdminNonRoutineEventData = (data_entry_id) => {
  return async (dispatch) => {
    try {
      dispatch(deleteAdminNonRoutineEventDataRequest());
      let apiUrl = PERFORMANCE_ENDPOINTS.DELETE_NON_ROUTINE_EVENT_DATA;
      const response = await DELETE_REQUEST(`${apiUrl}/${data_entry_id}`);
      dispatch(deleteAdminNonRoutineEventDataSuccess(response.data));
      NotificationsToast({
        message: response?.message
          ? response.message
          : "Non routine event data deleted successfully.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      dispatch(deleteAdminNonRoutineEventDataFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateAdminNonRoutineEvent = (eventId, payload) => {
  return async (dispatch) => {
    try {
      dispatch(editAdminNonRoutineEventRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.EDIT_NON_ROUTINE_EVENT}/${eventId}`;
      const response = await PATCH_REQUEST(apiURL, payload);
      dispatch(editAdminNonRoutineEventSuccess(response?.data));
    } catch (error) {
      console.error(error);
      dispatch(editAdminNonRoutineEventFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateAdminNonRoutineEventData = (eventId, payload) => {
  return async (dispatch) => {
    try {
      dispatch(editAdminNonRoutineEventDataRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.EDIT_NON_ROUTINE_EVENT}/${eventId}`;
      const response = await PATCH_REQUEST(apiURL, payload);
      dispatch(editAdminNonRoutineEventDataSuccess(response?.data));
    } catch (error) {
      console.error(error);
      dispatch(editAdminNonRoutineEventDataFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const scoreAdminPerformanceData = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(scoreAdminPerformanceDataRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.SCORE_PERFORMANCE_DATA}`;
      const response = await POST_REQUEST(apiURL, payload);
      dispatch(scoreAdminPerformanceDataSuccess(response?.data));
    } catch (error) {
      console.error(error);
      dispatch(scoreAdminPerformanceDataFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const calculateAdminPerformanceReport = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(calculateAdminPerformanceReportRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.CALCULATE_PERFORMANCE_REPORT}`;
      const response = await POST_REQUEST(apiURL, payload);
      dispatch(calculateAdminPerformanceReportSuccess(response?.data));
    } catch (error) {
      console.error(error);
      dispatch(calculateAdminPerformanceReportFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const updateAdminPerformanceReportInDB = (facility_id, payload) => {
  return async (dispatch) => {
    try {
      dispatch(updateAdminPerformanceReportRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.UPDATE_PERFORMANCE_REPORT}/${facility_id}`;
      const response = await POST_REQUEST(apiURL, payload);
      dispatch(updateAdminPerformanceReportSuccess(response));
    } catch (error) {
      console.error(error);
      dispatch(updateAdminPerformanceReportFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getAdminPerformanceReportFromDB = (
  facility_id,
  meter_type,
  performance_type
) => {
  return async (dispatch) => {
    try {
      dispatch(getAdminPerformanceReportRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.GET_PERFORMANCE_REPORT}/${facility_id}/${meter_type}?performance_type=${performance_type}`;
      const response = await GET_REQUEST(apiURL);
      dispatch(getAdminPerformanceReportSuccess(response?.data?.data));
    } catch (error) {
      console.error(error);
      dispatch(getAdminPerformanceReportFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};

export const getAdminPerformanceDataMinMaxDate = (facility_id, meter_type) => {
  return async (dispatch) => {
    try {
      dispatch(getAdminPerformanceDataMinMaxDateRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.GET_PERFORMANCE_DATA_MIN_MAX_DATE}?facility_id=${facility_id}&meter_type=${meter_type}`;
      const response = await GET_REQUEST(apiURL);
      dispatch(getAdminPerformanceDataMinMaxDateSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(getAdminPerformanceDataMinMaxDateFailure(error));
      NotificationsToast({
        message: error?.response?.data?.error ? error.response?.data?.error : "Something went wrong!",
        type: "error",
      });
      throw error;
    }
  };
};

export const getAdminPerformanceDataVisualization = (facility_id, meter_type) => {
  return async (dispatch) => {
    try {
      dispatch(getAdminPerformanceDataVisualizationRequest());
      let apiURL = `${PERFORMANCE_ENDPOINTS.GET_PERFORMANCE_DATA_VISUALIZATION}`;
      const response = await GET_REQUEST(apiURL, facility_id, meter_type);
      dispatch(getAdminPerformanceDataVisualizationSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(getAdminPerformanceDataVisualizationFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};