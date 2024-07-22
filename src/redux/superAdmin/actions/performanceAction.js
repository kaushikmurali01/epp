import { PERFORMANCE_ENDPOINTS } from "constants/apiEndPoints";
import {
  getBaselineDataSummaryFailure,
  getBaselineDataSummaryRequest,
  getBaselineDataSummarySuccess,
} from "../actionCreators/performanceActionCreator";
import NotificationsToast from "utils/notification/NotificationsToast";
import { GET_REQUEST, POST_REQUEST } from "utils/HTTPRequests";

export const getBaselineDataSummary = (
  summaryBody,
) => {
  return async (dispatch) => {
    try {
      dispatch(getBaselineDataSummaryRequest());
      let endpointWithParams = `${PERFORMANCE_ENDPOINTS.GET_BASELINE_DATA_SUMMARY}`;
      const response = await POST_REQUEST(endpointWithParams, summaryBody);
      const data = response.data;
      console.log(response);
      dispatch(getBaselineDataSummarySuccess(data));
      return data;
    } catch (error) {
      console.error(error);
      dispatch(getBaselineDataSummaryFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
