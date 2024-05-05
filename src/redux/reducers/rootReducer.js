import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import facilityReducer from "./facilityReducer";
import meterReducer from "./meterReducer";
export default combineReducers({
  simpleReducer,
  facilityReducer,
  meterReducer,
});
