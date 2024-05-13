import { adminEntriesEndPoints } from "constants/apiEndPoints";
import { GET_REQUEST } from "utils/HTTPRequests";
import NotificationsToast from "utils/notification/NotificationsToast";
import {
  fetchAdminEntriesListFailure,
  fetchAdminEntriesListRequest,
  fetchAdminEntriesListSuccess,
} from "../actionCreators/adminEntriesActionCreators";

export const fetchAdminEntriesListing = (pageInfo, id) => {
  return async (dispatch) => {
    try {
      dispatch(fetchAdminEntriesListRequest());
      const endpointWithParams = `${adminEntriesEndPoints.ENTRIES_LIST}/${
        (pageInfo.page - 1) * pageInfo.pageSize
      }/${pageInfo.pageSize}?facility_meter_detail_id=${id}`;
      const response = await GET_REQUEST(endpointWithParams);
      const data = response.data;
      dispatch(fetchAdminEntriesListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchAdminEntriesListFailure(error));
      NotificationsToast({
        message: error?.message ? error.message : "Something went wrong!",
        type: "error",
      });
    }
  };
};
