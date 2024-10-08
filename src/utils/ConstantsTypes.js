export const BASELINE_STATUS = {
  DRAFT: "DRAFT",
  CALCULATED: "CALCULATED",
  SUBMITTED: "SUBMITTED", //when baseline is finally submitted after Admin Review completion
  USER_SUBMITTED: "USER_SUBMITTED", //when user submits for review to Admin
  REQUESTED: "REQUESTED",
  REVIEWED: "REVIEWED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

export const INVERTED_FACILITY_ID_SUBMISSION_STATUS = {
  0: "Draft",
  1: "Ready for submission",
  2: "Submitted",
  3: "In review",
  5: "Approved",
  6: "Rejected",
  4: "Baseline approved",
  7: "Baseline modeling stage",
  8: "Enrollment in progress, approval pending",
  9: "Baseline pending review",
  10: "Baseline pending approval",
  11: "Baseline submitted",
  12: "Application approved",
  13: "P4P 1st pending",
  14: "In P4P 1st",
  15: "P4P 1st approved",
  16: "P4P 2nd pending",
  17: "In P4P 2nd",
  18: "P4P 2nd approved",
  19: "P4P 3rd pending",
  20: "In P4P 3rd",
  21: "P4P 3rd approved",
};
