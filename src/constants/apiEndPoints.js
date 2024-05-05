export const facilityEndPoints = {
  ADD_EDIT_FACILITY: "/company-facility/v1/facility",
  FACILITY_LIST: "/company-facility/v1/facility-listing",
  GET_FACILITY_BY_ID: "/company-facility/v1/facility-details",
  SUBMIT_FACILITY_FOR_APPROVAL: "/company-facility/v1/facility-submission",
  GET_FACILITY_DETAILS: "/company-facility/v1/facility-details",
};

export const USER_MANAGEMENT = {
  // GET REQUEST
  GET_USER_LIST: "/enerva-user/v1/combinedusers",
  GET_USER_ROLE: "/enerva-user/v1/roles",
  GET_DEFAULT_PERMISSIONS_BY_ROLE_ID: "/enerva-user/v1/rolepermission",
  GET_INVITATIONS_LIST: "/enerva-user/v1/invitations",
  GET_COMPANY_LIST: "/enerva-user/v1/companies",
  // POST REQUEST
  SEND_INVITATION_BY_ADMIN: "/enerva-user/v1/invitations",
  JOIN_REQUEST: "/enerva-user/v1/createrequest"
}

export const LANDING_PAGE = {
  CONTACT_US_FORM: "/enerva-user/v1/contact",
  GET_NEWS: "/enerva-user/v1/news"
}
export const meterEndPoints = {
  ADD_METER: "/company-facility/v1/facility-meter",
  METER_LIST: "/company-facility/v1/facility-meter-listing",
};

export const imageUploadEndPoints = {
  IMAGE_UPLOAD: "/company-facility/v1/upload",
};

export const entriesEndPoints = {
  ENTRIES_LIST: "/company-facility/v1/facility-meter-entries",
};
