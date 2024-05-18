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
};

export const adminFacilityEndpoints = {
  ADMIN_STATISTICS: "company-facility/v1/program/facility-statistics",
  ADMIN_FACILITY_LIST: "company-facility/v1/program/facility-listing",
  ADMIN_ADD_EDIT_FACILITY: "/company-facility/v1/facility",
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
  GET_DEFAULT_PERMISSIONS_BY_ROLE_ID: "/enerva-user/v1/rolepermission",
  GET_FILTER_USER_LIST: "/enerva-user/v1/filteredusers",

  GET_COMPANY_LIST: "/enerva-user/v1/companies",
  GET_COMPANY_DETAILS: "/enerva-user/v1/fetch/company",
  COMPANY_SEND_ALERT: "/enerva-user/v1/company/sendAlert",
  UPDATE_COMPANY_STATUS: "/enerva-user/v1/company/updateStatus",
  GET_USER_PERMISSONS_BY_ID: "/enerva-user/v1/user/permissions",
  // POST REQUEST
  SEND_INVITATION_BY_ADMIN: "/enerva-user/v1/invitations",
  JOIN_REQUEST: "/enerva-user/v1/createrequest",
  ACCEPT_USER_REQUEST: "/enerva-user/v1/acceptinvite",
  REJECT_USER_REQUEST: "/enerva-user/v1/rejectinvite",
  // DELETE REQUEST
  DELETE_USER_REQUEST: "/enerva-user/v1/users",
  // EDIT REQUEST
  EDIT_INVITATION_BY_ADMIN: "/enerva-user/v1/assign",
  GET_USER_DETAILS: "enerva-user/v1/user",

  EDIT_PROFILE: "/enerva-user/v1/users",

  GET_LIST_OF_COMPANIES_BY_USER: "/enerva-user/v1/usercompanies",
  ACCEPT_REJECT_INVITE: "enerva-user/v1/acceptuserinvitation",
};

export const ENERVA_USER_MANAGEMENT = {
  GET_ENERVA_USER_LIST: "/enerva-user/v1/enerva",
  GET_IESO_USER_LIST: "/enerva-user/v1/ieso",
  GET_CUSTOMER_USER_LIST: "enerva-user/v1/customer",
  GET_AGGREGATOR_USER_LIST: "",

  GET_EV_DEFAULT_PERMISSIONS_BY_ROLE_ID:
    "/enerva-user/v1/program/rolepermission",

  GET_EV_USER_PERMISSONS_BY_ID: "/enerva-user/v1/program/user/permissions",
  // POST REQUEST
  SEND_EV_INVITATION_BY_ADMIN: "/enerva-user/v1/program/send",

  SEND_USER_ALERT: "/enerva-user/v1/alert/send",
  // DELETE REQUEST
  // DELETE_EV_USER_REQUEST: "",
  VIEW_USER_PROFILE: "/enerva-user/v1/usercompanybyuser",
  // EDIT REQUEST
  EDIT_EV_INVITATION_BY_ADMIN: "/enerva-user/v1/adassign",
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
