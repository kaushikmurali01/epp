import {
    FETCH_ADMIN_ENTRIES_LIST_FAILURE,
    FETCH_ADMIN_ENTRIES_LIST_REQUEST,
    FETCH_ADMIN_ENTRIES_LIST_SUCCESS,
  } from "../actionTypes";
  
  export const fetchAdminEntriesListRequest = () => ({
    type: FETCH_ADMIN_ENTRIES_LIST_REQUEST,
  });
  
  export const fetchAdminEntriesListSuccess = (data) => ({
    type: FETCH_ADMIN_ENTRIES_LIST_SUCCESS,
    payload: data,
  });
  
  export const fetchAdminEntriesListFailure = (error) => ({
    type: FETCH_ADMIN_ENTRIES_LIST_FAILURE,
    payload: error,
  });
  