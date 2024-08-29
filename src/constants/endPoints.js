

export const authEndpoints = {
  login: "/login",
  signup: "/sign-up",
  forgetPassword: "/forget-password",
  resetPassword: "/reset-password",
  otpVerification: "/otp-verification",
};

export const dashboardEndpoints = {
  profile: "/profile",
  dashBoard: "/dashboard",
  admin: "/admin",
};

export const uploadFileEndPoints = {
  UPLOAD_FILE: "/company-facility/v1/upload",
};

export const pageSubEndspoints = {
  index: "",
  dashboard: "dashboard",
};

export const facilityEndPoints = {
  facilityDashboard: "facility-dashboard",
  addFacility: "add-facility",
  editFacility: "edit-facility/:id",
  facilityList: "facility-list",
  userManagement: "user-management",
  facilityDetails: "facility-details/:id",
  entriesDetails: "entries-details/:id",
  facilityManagePermissions: ":name/manage-access",
  facilityListNew: "facility-list-new",
  facilityManageAccessUsers: "facility-manage-access-users"
};

export const enervaEndPoints = {
  companies: "companies",
  reportManagement: "report-management",
  programManagement: "program-management",
  roleAndPermissionManagement: "roles-permissions-management",
  clientManagement: "client-management",
  companyProfile: "company-profile/:id",
  companyAgreement: "company-agreement/:id",
  companyUsers: "company-users/:id",
  companyManageAccess: "company-manage-access/:id",
  companyUserManageAccessByName: ':name/manage-access',
  addUser: "add-user",
  managePermission: "manage-permission",
};

export const userManagementEndPoints = {
  userManagement: "user-management",
  userManagementNew: "user-management-new",
  userManagementAccess: "user-management/manage-access",
  userProfile: "user-management/profile/:companyId/:userId",
};

export const evUserManagementEndPoints = {
  evUserManagement: "ev-user-management",
};

export const participantAgreementEndPoints = {
  participantAgreement: "participant-agreement",
};

export const profilePageEndPoints = {
  profilePage: "profile",
  ChangePassword: "change-password",
};
