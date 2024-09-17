import {
  GET_ADMIN_QA_QC_CHECKLIST_FAILURE,
  GET_ADMIN_QA_QC_CHECKLIST_REQUEST,
  GET_ADMIN_QA_QC_CHECKLIST_SUCCESS,
  UPDATE_ADMIN_QA_QC_CHECKLIST_FAILURE,
  UPDATE_ADMIN_QA_QC_CHECKLIST_REQUEST,
  UPDATE_ADMIN_QA_QC_CHECKLIST_SUCCESS,
} from "../actionTypes";

const initialState = {
  loading: false,
  error: null,
  checklistQuestionsList: [],
};

const adminQaQcChecklistReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ADMIN_QA_QC_CHECKLIST_REQUEST:
      return { ...state, loading: true };
    case GET_ADMIN_QA_QC_CHECKLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        checklistQuestionsList: action.payload,
        error: null,
      };
    case GET_ADMIN_QA_QC_CHECKLIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_ADMIN_QA_QC_CHECKLIST_REQUEST:
      return { ...state, loading: true };
    case UPDATE_ADMIN_QA_QC_CHECKLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_ADMIN_QA_QC_CHECKLIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default adminQaQcChecklistReducer;
