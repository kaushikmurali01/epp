import {
    FETCH_ENTRIES_LIST_FAILURE,
    FETCH_ENTRIES_LIST_REQUEST,
    FETCH_ENTRIES_LIST_SUCCESS,
  } from "../actionTypes";
  
  const initialState = {
    entriesList: [],
    loading: false,
    error: null,
  };
  
  const entriesReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ENTRIES_LIST_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_ENTRIES_LIST_SUCCESS:
        return {
          ...state,
          loading: false,
          entriesList: action.payload,
          error: null,
        };
      case FETCH_ENTRIES_LIST_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default entriesReducer;
  