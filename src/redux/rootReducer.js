import { combineReducers } from "redux";
import simpleReducer from "./superAdmin/reducers/simpleReducer";
import facilityReducer from "./superAdmin/reducers/facilityReducer";
import meterReducer from "./superAdmin/reducers/meterReducer";
import entriesReducer from "./superAdmin/reducers/entriesReducer";
import fileUploadReducer from "./global/reducers/fileUploadReducer";
import adminFacilityReducer from "./admin/reducers/adminFacilityReducers";
import adminMeterReducer from "./admin/reducers/adminMeterReducer";
export default combineReducers({
  simpleReducer,
  facilityReducer,
  meterReducer,
  entriesReducer,
  fileUploadReducer,
  adminFacilityReducer,
  adminMeterReducer,
});
