import { Box, Button, useTheme } from "@mui/material";

const FacilityStatus = ({ children }) => {
  const { palette } = useTheme();
  const getColor = (text) => {
    switch (text) {
      case 0:
        return "#E9E9E9";
      case 1:
        return "#FFBB6C";
      case 3:
        return "#DCFF88";
      case 4:
        return "#CFEEFF";
      case 5:
        return "#CFEEFF";
      case 6:
        return "#CFEEFF";
      default:
        return palette.status.default;
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
        return "approved";
      case 6:
        return "rejected";
      default:
        return "NA";
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
        {showSubmissionStatus(children)}
      </Box>
    </Box>
  );
};

export default FacilityStatus;
