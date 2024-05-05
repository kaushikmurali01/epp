import {
    FETCH_ENTRIES_LIST_FAILURE,
    FETCH_ENTRIES_LIST_REQUEST,
    FETCH_ENTRIES_LIST_SUCCESS,
  } from "../actionTypes";
  
  export const fetchEntriesListRequest = () => ({
    type: FETCH_ENTRIES_LIST_REQUEST,
  });
  
  export const fetchEntriesListSuccess = (data) => ({
    type: FETCH_ENTRIES_LIST_SUCCESS,
    payload: data,
  });
  
  export const fetchEntriesListFailure = (error) => ({
    type: FETCH_ENTRIES_LIST_FAILURE,
    payload: error,
  });
  