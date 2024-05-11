import React from "react";
import { ListItem, ListItemText, styled } from "@mui/material";

const MicroStyledListItem = styled(ListItem)(({ theme }) => ({
  width: "auto",
  "&:first-child": {
    "&:after": {
      content: '""',
      display: "block",
      borderRight: `0.0625rem solid ${theme.palette.divider}`,
      height: "100%",
      marginLeft: "1.44rem",
    },
  },
  "&:last-child": {
    // no change required
  },
  "&:not(:first-child):not(:last-child)": {
    "&:after": {
      content: '""',
      display: "block",
      borderRight: `0.0625rem solid ${theme.palette.divider}`,
      height: "100%",
      marginLeft: "1.44rem",
    },
  },
  "&:only-child": {
    margin: 0,
    "&:after": {
      content: "none",
    },
  },
}));

const MicroStyledListItemText = styled(ListItemText)(({ theme }) => ({
  margin: 0,
  display: "grid",
  gap: "0.25rem",
  "& .MuiTypography-root": {
    color: "#54585A",
    fontSize: "0.75rem !important",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal !important",
    "&:last-child": {
      color: "#242424",
      fontSize: "0.875rem !important",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "normal",
    },
  },
}));

const MicroStyledListItemComponent = ({ primary, secondary }) => {
  return (
    <MicroStyledListItem disablePadding>
      <MicroStyledListItemText primary={primary} secondary={secondary} />
    </MicroStyledListItem>
  );
};

export default MicroStyledListItemComponent;
