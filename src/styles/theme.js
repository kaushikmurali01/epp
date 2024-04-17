import { createTheme } from "@mui/material";

const theme = createTheme({
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
      secondary: "#757575",
    },
    neutral: {
      main: '#2E813E',
      contrastText: '#fff',
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
