import UserManagePermissions from "pages/UserManagementAdmin/UserManagePermissions";

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
  facilityManagePermissions: "facility-manage-permissions/:id",
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
};

export const userManagementEndPoints = {
  userManagement: "user-management",
  userProfile: "/user-management/profile/:companyId/:userId",
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
