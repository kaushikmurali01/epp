import {
  GET_ADMIN_QA_QC_CHECKLIST_FAILURE,
  GET_ADMIN_QA_QC_CHECKLIST_REQUEST,
  GET_ADMIN_QA_QC_CHECKLIST_SUCCESS,
  UPDATE_ADMIN_QA_QC_CHECKLIST_FAILURE,
  UPDATE_ADMIN_QA_QC_CHECKLIST_REQUEST,
  UPDATE_ADMIN_QA_QC_CHECKLIST_SUCCESS,
} from "../actionTypes";

export const getAdminQaQcChecklistRequest = () => ({
  type: GET_ADMIN_QA_QC_CHECKLIST_REQUEST,
});

export const getAdminQaQcChecklistSuccess = (data) => ({
  type: GET_ADMIN_QA_QC_CHECKLIST_SUCCESS,
  payload: data,
});

export const getAdminQaQcChecklistFailure = (error) => ({
  type: GET_ADMIN_QA_QC_CHECKLIST_FAILURE,
  payload: error,
});

export const updateAdminQaQcChecklistRequest = () => ({
  type: UPDATE_ADMIN_QA_QC_CHECKLIST_REQUEST,
});

export const updateAdminQaQcChecklistSuccess = (data) => ({
  type: UPDATE_ADMIN_QA_QC_CHECKLIST_SUCCESS,
  payload: data,
});

export const updateAdminQaQcChecklistFailure = (error) => ({
  type: UPDATE_ADMIN_QA_QC_CHECKLIST_FAILURE,
  payload: error,
});
