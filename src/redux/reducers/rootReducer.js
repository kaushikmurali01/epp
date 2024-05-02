import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import facilityReducer from "./facilityReducer";
export default combineReducers({
  simpleReducer,
  facilityReducer,
});
