import { SHOW_LOADER,SHOW_EV_PAGE_LOADER } from "../actionTypes";

const initialState = {
  show_loader: false,
  ev_pageLoader: false,
};

const loaderReducer = (state = initialState, action) => {
  // if (action.type === SHOW_LOADER) {
  //     return {
  //       show_loader: action.payload,
  //     };
  // }
  //   return state;
  switch (action.type) {
    case "SHOW_LOADER":
      return { ...state, show_loader: action.payload };
    case "SHOW_EV_PAGE_LOADER":
      return { ...state, ev_pageLoader: action.payload };
    default:
      return state;
  }
};

export default loaderReducer;
