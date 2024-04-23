import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: 0, // Set the margin to zero
          position: "absolute",
          top: "100%",
          left: "0",
        },
      },
    },
  },
  typography: {
    base: 14,
    fontFamily: `'Asap', 'Arial', sans-serif`,
  },
  palette: {
    primary: {
      main: "#2e813e",
      contrastText: "#fff",
    },
    primary_2: {
      main: "#54585a",
    },
    secondary: {
      main: "#f26d04",
    },
    text: {
      primary: "#2e813e",
      primary2: "#242424",
      secondary: "#757575",
      secondary2: "#54585A",
    },
    button: {
      primary: "#2e813e",
    },
    neutral: {
      main: "#2E813E",
      contrastText: "#fff",
    },
    status: {
      submit: "#FFCA99",
      approved: "#A2E00A",
      draft: "#D4D4D4",
      default: "#9BDBFF",
    },
    slider: {
      low: "#FFA4A4",
      medium: "#FFBB6C",
      high: "#50EE60",
      background: "#F2F2F2",
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
