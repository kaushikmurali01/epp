import { ButtonGroup, styled } from "@mui/material";

export const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  "& .MuiButtonGroup-firstButton": {
    borderRadius: "20.8125rem 0rem 0rem 20.8125rem",
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-middleButton": {
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-lastButton": {
    borderRadius: "0 20.8125rem 20.8125rem 0",
  },
  "& .MuiButton-root": {
    "&:hover": {
      color: "#F7F7F5",
    },
  },
}));

export const buttonStyle = {
  padding: "0.44rem 1.5rem",
  lineHeight: "1",
  height: "max-content",

  ".MuiButtonGroup-firstButton": {
    BorderRight: "10px",
  },
  textWrap: "nowrap",
};

export const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#2E813E",
  color: "#F7F7F5",
};

export const inactiveButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#EBEBEB",
  color: "#696969",
};

export const summaryAccordionContentStyle = {
  color: "#242424",
  padding: "0.375rem 1rem",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 500,
};

export const checkBoxButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
  padding: "0.375rem 0.5rem",
  borderRadius: "15rem",
  fontWeight: "400",
  fontSize: { sm: "0.875rem" },
};
