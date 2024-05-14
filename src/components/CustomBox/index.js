import { Box, Grid, Typography } from "@mui/material";
import React from "react";

const CustomBox = ({ heading1, heading2, count, ...otherProps }) => {
  const isWideScreen = window.innerWidth > 600;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap="0.75rem"
    >
      <Box
        sx={{
          backgroundColor: "#2E813E",
          color: "#ffffff",
          fontWeight: "500",
          fontSize: "0.75rem",
          fontStyle: "italic",
          maxWidth: "1.32025rem",
          height: "1.32025rem",
          aspectRatio: "1",
          borderRadius: "3.84625rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {count}
      </Box>
      <Typography
        variant="h5"
        sx={{
          color: "#2E813E",
          fontWeight: "500",
          fontSize: "1.125rem !important",
          fontStyle: "italic",
          lineHeight: "106.815%",
          letterSpacing: "-0.01125rem",
        }}
      >
        {heading1}<br/>{heading2}
      </Typography>
    </Box>
  );
};

export default CustomBox;
