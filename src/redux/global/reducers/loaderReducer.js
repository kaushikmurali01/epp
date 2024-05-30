import { SHOW_LOADER } from "../actionTypes";

const initialState = {
  show_loader: false,
};

const loaderReducer = (state = initialState, action) => {
  if (action.type === SHOW_LOADER) {
      return {
        show_loader: action.payload,
      };
  }
    return state;
};

export default loaderReducer;
