import { meterEndPoints } from "constants/apiEndPoints";
import {
  fetchMeterListFailure,
  fetchMeterListRequest,
  fetchMeterListSuccess,
} from "../actionCreators/meterActionCreators";

import { GET_REQUEST } from "utils/HTTPRequests";

export const fetchMeterListing = (pageInfo) => {
  return async (dispatch) => {
    try {
      dispatch(fetchMeterListRequest());
      const endpointWithParams = `${meterEndPoints.METER_LIST}/${
        (pageInfo.page - 1) * pageInfo.pageSize
      }/${pageInfo.pageSize}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchMeterListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchMeterListFailure(error));
    }
  };
};
