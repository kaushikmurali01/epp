import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import facilityReducer from "./facilityReducer";
import meterReducer from "./meterReducer";
import entriesReducer from "./entriesReducer";
export default combineReducers({
  simpleReducer,
  facilityReducer,
  meterReducer,
  entriesReducer
});
