import { meterEndPoints } from "constants/apiEndPoints";
import {
  fetchMeterListFailure,
  fetchMeterListRequest,
  fetchMeterListSuccess,
  addMeterRequest,
  addMeterSuccess,
  addMeterFailure,
  updateMeterRequest,
  updateMeterSuccess,
  updateMeterFailure,
} from "../actionCreators/meterActionCreators";

import { GET_REQUEST, POST_REQUEST, PATCH_REQUEST } from "utils/HTTPRequests";

export const fetchMeterListing = (pageInfo,id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchMeterListRequest());
      const endpointWithParams = `${meterEndPoints.METER_LIST}/${
        (pageInfo.page - 1) * pageInfo.pageSize
      }/${pageInfo.pageSize}?facility_id=${id}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchMeterListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchMeterListFailure(error));
    }
  };
};

export const addMeter = (meterData) => {
  return async (dispatch) => {
    try {
      dispatch(addMeterRequest());
      const response = await POST_REQUEST(meterEndPoints.ADD_METER, meterData);
      const data = response.data;
      dispatch(addMeterSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(addMeterFailure(error));
    }
  };
};


export const updateMeter = (meterId, meterData) => {
  return async (dispatch) => {
    try {
      dispatch(updateMeterRequest());
      const endpointWithParams = `${meterEndPoints.UPDATE_METER}/${meterId}`;
      const response = await PATCH_REQUEST(endpointWithParams, meterData);
      const data = response.data;
      dispatch(updateMeterSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(updateMeterFailure(error));
    }
  };
};