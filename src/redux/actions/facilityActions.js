import { facilityEndPoints } from "constants/apiEndPoints";
import {
  fetchFacilityListFailure,
  fetchFacilityListRequest,
  fetchFacilityListSuccess,
} from "./../actionCreators";
import { GET_REQUEST } from "utils/HTTPRequests";

export const fetchFacilityListing = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchFacilityListRequest());
      const response = await GET_REQUEST(facilityEndPoints.FACILITY_LIST);
      const data = response.data;
      dispatch(fetchFacilityListSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(fetchFacilityListFailure(error));
    }
  };
};
