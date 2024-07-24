import {
  GET_BASELINE_DATA_SUMMARY_FAILURE,
  GET_BASELINE_DATA_SUMMARY_REQUEST,
  GET_BASELINE_DATA_SUMMARY_SUCCESS,
} from "../actionTypes";

export const getBaselineDataSummaryRequest = () => ({
  type: GET_BASELINE_DATA_SUMMARY_REQUEST,
});

export const getBaselineDataSummarySuccess = (data) => ({
  type: GET_BASELINE_DATA_SUMMARY_SUCCESS,
  payload: data,
});

export const getBaselineDataSummaryFailure = (error) => ({
  type: GET_BASELINE_DATA_SUMMARY_FAILURE,
  payload: error,
});
