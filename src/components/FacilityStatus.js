import { Box, Button, useTheme } from "@mui/material";

const FacilityStatus = ({ children }) => {
  const { palette } = useTheme();
  const getColor = (text) => {
    switch (text) {
      case "Submit for Approval":
        return palette.status.submit;
      case "Approved":
        return palette.status.approved;
      case "Draft":
        return palette.status.draft;
      default:
        return palette.status.default;
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
        {children}
      </Box>
    </Box>
  );
};

export default FacilityStatus;
