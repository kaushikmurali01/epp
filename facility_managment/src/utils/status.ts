export const HTTP_STATUS_CODES = {
  SUCCESS: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED_ACCESS: 401,
  PAYMENT_REQUIRED: 402,
  ALREADY_EXIST: 403,
  RECORD_NOT_FOUND: 404,
  CONFLICT_ERROR: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const RESPONSE_MESSAGES = {
  sUCError: "SequelizeUniqueConstraintError",
  noContent: "No Content",
  singupSuccess: "Signup Success",
  Success: "Success",
  invalidJson: "Invalid JSON",
  loginSuccess: "Successfully Login",
  inccorectCreds: "Incorrect Password",
  unauthorized: "Unauthorized",
  userNotFound:
    "This email has not been registered. Please use a valid email id.",
  accountActive: "Account Activated Successfully",
  accountDeactive: "Account Deactivated Successfully",
  accountNotFound: "Sorry not able to fetch the account",
  notFound404: "Sorry not able to fetch the details",
  wrongPassword: "Incorrect Password",
  pUpdated: "Password Updated Successfully",
  prUpdated: "Profile Updated Successfully",
  incorrectOtp: "OTP is incorrect please try again",
  expiredOtp: "OTP is gets expired",
  accounNotActive: "Your Account is notactivated yet, verify it first",
  otpVerified: "OTP verified successfully",
  otpSent: "OTP sent successfully",
  dataUnique: "Data Should be unique",
  emailNotExist: "Please enter a registered email address",
  paAlreadySigned: "You have already sign the participant agreement",
};

export const STATUS = {
  NOT_ACTIVE: 0,
  IS_ACTIVE: 1,
  IS_BLOCKED: 2,
  IS_DELETED: 3,
};
export const BASE_LINE_STATUS = {
  draft: "DRAFT",
  created: "CREATED",
  submit: "SUBMITTED",
  rejected: "REJECTED",
  requested: "REQUESTED",
};
export const userType = {
  ADMIN: 1,
  SUPER_ADMIN: 2,
  USER: 3,
  ENERVA_ADMIN: 6,
};
