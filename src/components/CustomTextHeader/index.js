import { Box, Grid, Typography } from "@mui/material";
import React from "react";

const CustomTextHeader = ({ heading1, heading2, count, ...otherProps }) => {
  const isWideScreen = window.innerWidth > 600;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap="0.75rem"
      bgcolor={"#FEFFE6"}
      height='7rem'
      width='11rem'
    borderRadius="0.75rem"
    marginRight='0.50rem'
    >
      <Typography
        variant="h4"
        sx={{
          color: "#242424",
          fontWeight: "500",
          fontSize: "0.65rem !important",
          fontStyle: "italic",
          lineHeight: "106.815%",
          letterSpacing: "-0.01125rem",
        }}
      >
        {heading1}<br/>
        <Typography
        variant="h4"
        sx={{
          color: "#242424",
          fontWeight: "500",
          fontSize: "0.95rem !important",
          fontStyle: "italic",
          lineHeight: "106.815%",
          letterSpacing: "-0.01125rem",
        }}
      >
        {heading2}
        </Typography>
      </Typography>
    </Box>
  );
};

export default CustomTextHeader;
