import { Box, Button, useTheme } from "@mui/material";

const AdminFacilityStatus = ({ children }) => {
  const { palette } = useTheme();
  const getColor = (text) => {
    switch (text) {
      case 0:
        return "#E9E9E9";
      case 1:
        return "#d48fe3";
      case 2:
        return "#8e78de";
      case 3:
        return "#CFEEFF";
      case 4:
        return "#a9bf75";
      case 5:
        return "#DCFF88";
      case 6:
        return "#ffa6a3";
      default:
        return "#54585A33";
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

  return (
    <Box sx={{ width: "100%", display: "flex", justifyItems: "flex-start" }}>
      <Box
        p={1}
        sx={{
          cursor: "default",
          borderRadius: "55px",
          padding: "5px 15px",
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

export default AdminFacilityStatus;
