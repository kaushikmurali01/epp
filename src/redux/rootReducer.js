import { combineReducers } from "redux";
import simpleReducer from "./superAdmin/reducers/simpleReducer";
import facilityReducer from "./superAdmin/reducers/facilityReducer";
import meterReducer from "./superAdmin/reducers/meterReducer";
import entriesReducer from "./superAdmin/reducers/entriesReducer";
import fileUploadReducer from "./global/reducers/fileUploadReducer";
import adminFacilityReducer from "./admin/reducers/adminFacilityReducers";
import adminMeterReducer from "./admin/reducers/adminMeterReducer";
import loaderReducer from "./global/reducers/loaderReducer";
import adminEntriesReducer from "./admin/reducers/adminEntriesReducer";
import adminCompanyReducer from "./admin/reducers/adminCompanyReducer";
import baselineReducer from "./superAdmin/reducers/baselineReducer";
import adminBaselineReducer from "./admin/reducers/adminBaselineReducer";
import adminPerformanceReducer from "./admin/reducers/adminPerformanceReducer";
import performanceReducer from "./superAdmin/reducers/performanceReducer";
import adminQaQcChecklistReducer from "./admin/reducers/adminQaQcChecklistReducer";
export default combineReducers({
  simpleReducer,
  facilityReducer,
  meterReducer,
  entriesReducer,
  fileUploadReducer,
  adminFacilityReducer,
  adminMeterReducer,
  adminEntriesReducer,
  adminCompanyReducer,
  loaderReducer,
  baselineReducer,
  adminBaselineReducer,
  adminPerformanceReducer,
  performanceReducer,
  adminQaQcChecklistReducer,
});
