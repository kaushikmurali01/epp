import { createTheme } from "@mui/material";



const getTheme = createTheme();
const theme = createTheme({
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: 0, // Set the margin to zero
          position: "absolute",
          top: "100%",
          left: "0"
      
        },
      },
    },
    
    MuiFormLabel: {
      styleOverrides: {
        root: {
        color: '#2E813E'
      
        },
      },
    },
    
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px',
          borderRadius: '8px',
          minWidth: '120px',
          fontSize: '14px',
          [getTheme.breakpoints.up('sm')]: {
            fontSize: '16px',
          minWidth: '140px',
        },
          [getTheme.breakpoints.up('md')]: {
            fontSize: '18px',
          minWidth: '165px',
        },
      
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
      light: "#F4FFF5",
      thinLight: "F5F9F5",
      contrastText: "#fff",
    },
    primary_2: {
      main: "#54585a",
    },
    secondary: {
      main: "#f26d04",
    },
    dark : {
      main: "#000",
      light: "#242424"
    },
    text: {
      primary: "#2e813e",
      secondary: "#757575",
      secondary2: "#54585A",
    },
    button: {
      primary: "#2e813e",
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
