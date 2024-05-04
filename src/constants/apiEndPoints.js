export const facilityEndPoints = {
  ADD_FACILITY: "/facility",
  FACILITY_LIST: "/facility-listing",
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
  CONTACT_US_FORM: "/api/v1/contact",
  GET_NEWS: "/api/v1/news"
}