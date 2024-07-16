export const facilityEndPoints = {
  ADD_EDIT_FACILITY: "/company-facility/v1/facility",
  FACILITY_LIST: "/company-facility/v1/facility-listing",
  GET_FACILITY_BY_ID: "/company-facility/v1/facility-details",
  SUBMIT_FACILITY_FOR_APPROVAL: "/company-facility/v1/facility-submission",
  GET_FACILITY_DETAILS: "/company-facility/v1/facility-details",
  ADD_METER: "/company-facility/v1/facility-meter",
  DELETE_FACILITY: "/company-facility/v1/facility",
  ADD_FACILITY_CHARACTERISTIC: "/company-facility/v1/facility-characteristics",
  GET_FACILITY_CHARACTERISTIC: "/company-facility/v1/facility-characteristics",
  UPDATE_FACILITY_CHARACTERISTIC:
    "/company-facility/v1/facility-characteristics",
  GET_FACILITY_STATUS: "/company-facility/v1/facility-status",
  UPDATE_FACILITY_STATUS: "/company-facility/v1/facility-status",
  ASSIGN_FACILITIES: "enerva-user/v1/resource-permission/add",
  FACILITIES_DROPDOWN: "/company-facility/v1/program/facility-dropdown",
  GET_CATEGORIES_TYPES_AND_NAICS: "company-facility/v1/facility-naic",
  GET_FACILITY_MEASURE_LIST: "company-facility/v1/facility-measure-lists",
  ADD_FACILITY_MEASURE: "company-facility/v1/facility-measure",
  UPDATE_FACILITY_MEASURE: "company-facility/v1/facility-measure",
  GET_FACILITY_MEASURE_DETAILS: "company-facility/v1/facility-measure-details",
  DELETE_FACILITY_MEASURE_REPORT: "company-facility/v1/facility-measure",
  GET_FACILITY_SAVING_DOCUMENT_LIST:
    "company-facility/v1/facility-saving-document-lists",
  ADD_FACILITY_SAVING_DOCUMENT: "company-facility/v1/facility-saving-document",
  UPDATE_FACILITY_SAVING_DOCUMENT:
    "company-facility/v1/facility-saving-document",
  GET_FACILITY_SAVING_DOCUMENT_DETAILS:
    "company-facility/v1/facility-saving-document-details",
  DELETE_FACILITY_SAVING_DOCUMENT:
    "company-facility/v1/facility-saving-document",
};

export const adminFacilityEndpoints = {
  ADMIN_STATISTICS: "company-facility/v1/program/facility-statistics",
  ADMIN_FACILITY_LIST: "company-facility/v1/program/facility-listing",
  ADMIN_ADD_EDIT_FACILITY: "/company-facility/v1/program/facility",
  ADMIN_DELETE_FACILITY: "company-facility/v1/program/facility",
  ADD_ADMIN_FACILITY_CHARACTERISTIC:
    "/company-facility/v1/facility-characteristics",
  GET_ADMIN_FACILITY_CHARACTERISTIC:
    "/company-facility/v1/facility-characteristics",
  UPDATE_ADMIN_FACILITY_CHARACTERISTIC:
    "/company-facility/v1/facility-characteristics",
  GET_ADMIN_FACILITY_DETAILS: "/company-facility/v1/facility-details",
  GET_ADMIN_FACILITY_STATUS: "/company-facility/v1/facility-status",
  UPDATE_ADMIN_FACILITY_STATUS: "/company-facility/v1/facility-status",
  ADMIN_ASSIGN_FACILITIES: "enerva-user/v1/resource-permission/add",
  ADMIN_FACILITIES_DROPDOWN: "/company-facility/v1/program/facility-dropdown",
  DOWNLOAD_BULK_FACILITIES: "company-facility/v1/csv-facilities",
  DOWNLOAD_FACILITY_BY_ID: "/company-facility/v1/csv-facility",
  GET_FACILITY_MEASURE_LIST: "company-facility/v1/facility-measure-lists",
  ADD_FACILITY_MEASURE: "company-facility/v1/facility-measure",
  UPDATE_FACILITY_MEASURE: "company-facility/v1/facility-measure",
  GET_FACILITY_MEASURE_DETAILS: "company-facility/v1/facility-measure-details",
  DELETE_FACILITY_MEASURE_REPORT: "company-facility/v1/facility-measure",
  GET_FACILITY_SAVING_DOCUMENT_LIST:
    "company-facility/v1/facility-saving-document-lists",
  ADD_FACILITY_SAVING_DOCUMENT: "company-facility/v1/facility-saving-document",
  UPDATE_FACILITY_SAVING_DOCUMENT:
    "company-facility/v1/facility-saving-document",
  GET_FACILITY_SAVING_DOCUMENT_DETAILS:
    "company-facility/v1/facility-saving-document-details",
  DELETE_FACILITY_SAVING_DOCUMENT:
    "company-facility/v1/facility-saving-document",
  ADMIN_FACILITY_LIST_ACTIVE: "company-facility/v1/facility-listing-admin",
  ADMIN_FACILITY_LIST_INPROCESS: "company-facility/v1/facility-inprocess-admin",
  ADMIN_FACILITY_LIST_BY_ID: "/company-facility/v1/facility-users-list"
};

export const PA_MANAGEMENT = {
  GET_PA_DATA: "/company-facility/v1/pa-details",
  CREATE_PA: "/company-facility/v1/pa-details",
  SIGN_PA: "company-facility/v1/sign-pa",
};

export const USER_MANAGEMENT = {
  // GET REQUEST
  GET_USER_LIST: "/enerva-user/v1/combinedusers",
  GET_USER_ROLE: "/enerva-user/v1/roles",
  GET_REQUEST_TO_JOIN_USER_ROLE: "/enerva-user/v1/requestroles",
  GET_DEFAULT_PERMISSIONS_BY_ROLE_ID: "/enerva-user/v1/rolepermission",
  GET_FILTER_USER_LIST: "/enerva-user/v1/filteredusers",

  GET_COMPANY_LIST: "/enerva-user/v1/companies",
  GET_COMPANY_DETAILS: "/enerva-user/v1/fetch/company",
  COMPANY_SEND_ALERT: "/enerva-user/v1/company/sendAlert",
  COMPANIES_DROPDOWN: "/enerva-user/v1/dropDown/companies",
  UPDATE_COMPANY_STATUS: "/enerva-user/v1/company/updateStatus",
  GET_USER_PERMISSONS_BY_ID: "/enerva-user/v1/user/permissions",
  GET_DROPDOWN_COMPANY_LIST: "enerva-user/v1/dropDown/companies",
  GET_AVAILABLE_USERS_FOR_PERMISSIONS: "/enerva-user/v1/getCompanyUser",
  DELETE_COMPANY: "enerva-user/v1/company",
  GET_USER_BY_COMPANY: "/enerva-user/v1/getUserByCompany",

  // POST REQUEST
  SEND_INVITATION_BY_ADMIN: "/enerva-user/v1/invitations",
  JOIN_REQUEST: "/enerva-user/v1/createrequest",
  ACCEPT_USER_REQUEST: "/enerva-user/v1/acceptinvite",
  REJECT_USER_REQUEST: "/enerva-user/v1/rejectinvite",
  GET_COMPANY_LIST_WITH_SEARCH: "/enerva-user/v1/companies/search",
  // DELETE REQUEST
  DELETE_USER_REQUEST: "/enerva-user/v1/users",
  // EDIT REQUEST
  EDIT_INVITATION_BY_ADMIN: "/enerva-user/v1/assign",
  GET_USER_DETAILS: "enerva-user/v1/user",

  EDIT_PROFILE: "/enerva-user/v1/users",

  UPDATE_SUPER_ADMIN_PERMISSIONS: "/enerva-user/v1/changeCompanySuperUser",

  GET_LIST_OF_COMPANIES_BY_USER: "/enerva-user/v1/usercompanies",
  ACCEPT_REJECT_INVITE: "enerva-user/v1/acceptuserinvitation",
};

export const ENERVA_USER_MANAGEMENT = {
  GET_ENERVA_USER_LIST: "/enerva-user/v1/enerva",
  GET_IESO_USER_LIST: "/enerva-user/v1/ieso",
  GET_CUSTOMER_USER_LIST: "/enerva-user/v1/customer",
  GET_POST_ENERVA_USER_LIST: "/enerva-user/v1/search/users",

  GET_EV_DEFAULT_PERMISSIONS_BY_ROLE_ID:
    "/enerva-user/v1/program/rolepermission",

  GET_EV_USER_PERMISSONS_BY_ID: "/enerva-user/v1/program/user/permissions",
  // POST REQUEST
  SEND_EV_INVITATION_BY_ADMIN: "/enerva-user/v1/program/send",

  SEND_USER_ALERT: "/enerva-user/v1/alert/send",
  // DELETE REQUEST
  DELETE_ENERVA_USER_REQUEST: "/enerva-user/v1/usersadmin",
  VIEW_USER_PROFILE: "/enerva-user/v1/usercompanybyuser",
  // EDIT REQUEST
  EDIT_EV_INVITATION_BY_ADMIN: "/enerva-user/v1/adassign",
  USER_ACTIVE_IN_ACTIVE: "enerva-user/v1/user/status",
};

export const ROLES_PERMISSIONS_MANAGEMENT = {
  ROLES_PERMISSIONS: "/enerva-user/v1/program/rolepermission",
  USER_TYPES: "/enerva-user/v1/program/usertypes",
  GET_ROLE_PERMISSIONS_BY_ID: "/enerva-user/v1/program/rolepermissiondetail",
  GET_ALL_PERMISSIONS_LIST: "enerva-user/v1/program/allpermissions",

  // GET_ROLES_PERMISSIONS_LIST: "/enerva-user/v1/program/rolepermission",

  // // POST REQUEST
  // ADD_ROLES_PERMISSIONS: "/enerva-user/v1/program/rolepermission",

  // // DELETE REQUEST
  // DELETE_EV_USER_REQUEST: "/enerva-user/v1/program/rolepermission",
  // // EDIT REQUEST
  // EDIT_ROLES_PERMISSIONS: "/enerva-user/v1/program/rolepermission",
};

export const LANDING_PAGE = {
  CONTACT_US_FORM: "/public-api/v1/contact",
  GET_NEWS: "/public-api/v1/news",
};
export const meterEndPoints = {
  ADD_METER: "/company-facility/v1/facility-meter",
  METER_LIST: "/company-facility/v1/facility-meter-listing",
  GET_METER_DETAILS: "/company-facility/v1/facility-meter-details",
  UPDATE_METER: "/company-facility/v1/facility-meter",
  DELETE_METER: "/company-facility/v1/facility-meter",
  METER_STATISTICS: "company-facility/v1/facility-meter-statistics",
};

export const adminMeterEndPoints = {
  ADD_METER: "/company-facility/v1/facility-meter",
  METER_LIST: "/company-facility/v1/facility-meter-listing",
  GET_METER_DETAILS: "/company-facility/v1/facility-meter-details",
  UPDATE_METER: "/company-facility/v1/facility-meter",
  DELETE_METER: "/company-facility/v1/facility-meter",
  METER_STATISTICS: "company-facility/v1/facility-meter-statistics",
};
export const imageUploadEndPoints = {
  IMAGE_UPLOAD: "/company-facility/v1/upload",
};

export const entriesEndPoints = {
  ENTRIES_LIST: "/company-facility/v1/facility-meter-entries",
  ADD_EDIT_ENTRY: "/company-facility/v1/facility-meter-entry",
  DELETE_ENTRY: "/company-facility/v1/facility-meter-entry",
};

export const adminEntriesEndPoints = {
  ENTRIES_LIST: "/company-facility/v1/facility-meter-entries",
  ADD_EDIT_ENTRY: "/company-facility/v1/facility-meter-entry",
  DELETE_ENTRY: "/company-facility/v1/facility-meter-entry",
};

export const fileUploadEndPoints = {
  FILE_UPLOAD: "company-facility/v1/upload",
};

export const dashboardEndPoints = {
  ADMIN_DASHBOARD_STATS: "company-facility/v1/dashboard/statistics",
};

export const hourlyEndPoints = {
  GET_HOURLY_DATA:
    "company-facility/v1/facility-meter-hourly-entries/0/10?facility_meter_detail_id=",
  ADD_HOURLY_DATA: "company-facility/v1/facility-meter-hourly-entry",
  DELETE_HOURLY_DATA: "company-facility/v1/facility-meter-hourly-entry/",
};

export const POWERBI_ENDPOINTS = {
  GET_POWERBI_TOKEN: "/GenerateToken",
  GET_AZURE_TOKEN_FOR_POWER_BI: "etl/v1/etl/access-token",
};

export const WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS = {
  ADD_INDEPENDENT_VARIABLE: "etl/v1/etl/independent_variable",
  GET_INDEPENDENT_VARIABLE: "etl/v1/etl/independent_variable",
  UPDATE_INDEPENDENT_VARIABLE: "etl/v1/etl/independent_variable",
  DELETE_INDEPENDENT_VARIABLE: "etl/v1/etl/independent_variable",
  UPLOAD_INDEPENDENT_VARIABLE_FILE: "etl/v1/etl/upload-file-iv",
  GET_WEATHER_STATION: "weather/v1/get_station_details",
};

export const BASELINE_ENDPOINTS = {
  CHECK_SUFFICIENCY: "v1/check_sufficiency",
  INDEPENDENT_VARIABLE: "etl/v1/etl/independent_variable",
  STATION_DETAILS: "weather/v1/get_station_details",
  BASELINE_PERIOD: "weather/v1/get_min_max_dates",
  CHECK_ISSUES_DETAILS: "v1/check_issues",
  SHOW_OBSERVE_DATA_LIST: "v1/get_observed_data",
  ADD_BASELINE_DB: "company-facility/v1/baseline",
  FETCH_BASELINE_DB: "company-facility/v1/getBaseline",
  UPDATE_BASELINE_DB: "company-facility/v1/baseline",
  FETCH_BASELINE_LIST_DB: "company-facility/v1/getBaselineList",
  ADD_ASSIGNEE_DB: "company-facility/v1/baseline/addAssignee",
  SUBMIT_REJECTED_BASELINE_DB: "company-facility/v1/submitRejectedBaseline",
  SUBMIT_BASELINE_D_T: "model/v1/model_summary",
};
