import React from "react";
import { Box, useTheme } from "@mui/material";

const AdminFacilityStatus = ({ children }) => {
  const { palette } = useTheme();

  const getColors = (status) => {
    switch (status) {
      case 0:
        return { background: "#E9E9E9", text: "#000000" }; // Draft
      case 1:
        return { background: "#9C27B0", text: "#FFFFFF" }; // Ready for submission
      case 2:
        return { background: "#3F51B5", text: "#FFFFFF" }; // Submitted
      case 3:
        return { background: "#03A9F4", text: "#000000" }; // In review
      case 4:
        return { background: "#2e813e", text: "#FFFFFF" }; // Baseline approved
      case 5:
        return { background: "#1e6329", text: "#FFFFFF" }; // Approved
      case 6:
        return { background: "#F44336", text: "#FFFFFF" }; // Rejected
      default:
        return { background: "#9E9E9E", text: "#000000" }; // NA
    }
  };

  const showSubmissionStatus = (status) => {
    switch (status) {
      case 0:
        return "Draft";
      case 1:
        return "Ready for submission";
      case 2:
        return "Submitted";
      case 3:
        return "In review";
      case 4:
        return "Baseline approved";
      case 5:
        return "Approved";
      case 6:
        return "Rejected";
      default:
        return "NA";
    }
  };

  const { background, text } = getColors(children);

  return (
    <Box sx={{ width: "100%", display: "flex", justifyItems: "flex-start" }}>
      <Box
        p={1}
        sx={{
          cursor: "default",
          borderRadius: "55px",
          padding: "5px 15px",
          background: background,
          color: text,
          textWrap: "nowrap",
          fontStyle: "italic",
          fontWeight: "bold",
        }}
        variant="contained"
      >
        {showSubmissionStatus(children)}
      </Box>
    </Box>
  );
};

export default AdminFacilityStatus;
