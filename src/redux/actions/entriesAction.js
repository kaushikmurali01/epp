import { entriesEndPoints, meterEndPoints } from "constants/apiEndPoints";

import { GET_REQUEST } from "utils/HTTPRequests";
import {
    fetchEntriesListFailure,
    fetchEntriesListRequest,
    fetchEntriesListSuccess
} from "../actionCreators/entriesActionCreators";

export const fetchEntriesListing = (pageInfo, id) => {
    return async (dispatch) => {
        try {
            dispatch(fetchEntriesListRequest());
            const endpointWithParams = `${entriesEndPoints.ENTRIES_LIST}/${(pageInfo.page - 1) * pageInfo.pageSize
                }/${pageInfo.pageSize}?facility_meter_detail_id=${id}`;
            const response = await GET_REQUEST(endpointWithParams);
            const data = response.data;
            console.log(data)
            dispatch(fetchEntriesListSuccess(data));
        } catch (error) {
            console.error(error);
            dispatch(fetchEntriesListFailure(error));
        }
    };
};
