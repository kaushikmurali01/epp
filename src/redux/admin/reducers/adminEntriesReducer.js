import { FETCH_ADMIN_ENTRIES_LIST_FAILURE, FETCH_ADMIN_ENTRIES_LIST_REQUEST, FETCH_ADMIN_ENTRIES_LIST_SUCCESS } from "../actionTypes";


const initialState = {
  entriesList: [],
  loading: false,
  error: null,
};

const adminEntriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADMIN_ENTRIES_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ADMIN_ENTRIES_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        entriesList: action.payload,
        error: null,
      };
    case FETCH_ADMIN_ENTRIES_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default adminEntriesReducer;
