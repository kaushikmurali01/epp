import { Box, Button, useTheme } from "@mui/material";

const FacilityStatus = ({ children }) => {
  const { palette } = useTheme();
  const getColor = (text) => {
    switch (text) {
      case 0:
        return palette.status.draft;
      case 1:
        return palette.status.submit;
      case 3:
        return palette.status.approved;
      case 4:
        return palette.status.approved;
      case 5:
        return palette.status.approved;
      default:
        return palette.status.default;
    }
  };

  //   INITIAL : 0,
  // SUBMITTED: 1,
  // IN_REVIEW: 2,
  // BASELINE_APPROVED : 3,
  // APPROVED: 4,
  const showStatus = (status) => {
    switch (status) {
      case 0:
        return "Initial";
      case 1:
        return "Submitted";
      case 3:
        return "In review";
      case 4:
        return "Baseline approved";
      case 5:
        return "approved";
      default:
        return "";
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyItems: "flex-start" }}>
      <Box
        p={1}
        sx={{
          cursor: "default",
          borderRadius: "5px",
          background: `${getColor(children)}`,
          textWrap: "nowrap",
        }}
        variant="contained"
      >
        {showStatus(children)}
      </Box>
    </Box>
  );
};

export default FacilityStatus;
