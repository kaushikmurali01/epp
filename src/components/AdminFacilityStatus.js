import { Box, Button, useTheme } from "@mui/material";

const AdminFacilityStatus = ({ children }) => {
  const { palette } = useTheme();
  const getColor = (text) => {
    switch (text) {
      case 0:
        return "#E9E9E9";
      case 1:
        return "#DCFF88";
      case 2:
        return "#CFEEFF";
      case 3:
        return "#FFC6C4";
      default:
        return "#54585A33";
    }
  };

  const showSubmissionStatus = (status) => {
    switch (status) {
      case 0:
        return "Draft";
      case 1:
        return "Approved";
      case 2:
        return "In Review";
      case 3:
        return "#FF5858";
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

export default AdminFacilityStatus;
