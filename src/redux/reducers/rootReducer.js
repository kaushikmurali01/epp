import { combineReducers } from "redux";
import simpleReducer from "./simpleReducer";
import facilityReducer from "./facilityReducer";
import meterReducer from "./meterReducer";
import entriesReducer from "./entriesReducer";
import fileUploadReducer from "./fileUploadReducer";
import globalReducer from "./globalReducer";
export default combineReducers({
  simpleReducer,
  facilityReducer,
  meterReducer,
  entriesReducer,
  fileUploadReducer,
  globalReducer,
});
