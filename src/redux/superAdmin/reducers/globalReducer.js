import { SHOW_LOADER } from "../actionTypes";

const initialState = {
  show_loader: false,
};

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADER:
      return {
        show_loader: action.payload,
      };
    default:
      return state;
  }
};

export default globalReducer;