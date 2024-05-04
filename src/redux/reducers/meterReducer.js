import {
    FETCH_METER_LIST_FAILURE,
    FETCH_METER_LIST_REQUEST,
    FETCH_METER_LIST_SUCCESS,
  } from "./../actionTypes";
  
  const initialState = {
    MeterList: [],
    loading: false,
    error: null,
  };
  
  const MeterReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_METER_LIST_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_METER_LIST_SUCCESS:
        return {
          ...state,
          loading: false,
          MeterList: action.payload,
          error: null,
        };
      case FETCH_METER_LIST_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default MeterReducer;
  