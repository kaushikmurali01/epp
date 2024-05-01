import { createTheme } from "@mui/material";

// this get theme variable is used to override the default properties
const getTheme = createTheme();

// this is used to override the properties according to the theme
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
          padding: '0.625rem',
          borderRadius: '0.5rem',
          minWidth: '7.5rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          textTransform: 'inherit',
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
          [getTheme.breakpoints.up('sm')]: {
            fontSize: '1rem',
            minWidth: '8.75rem',
          },
          [getTheme.breakpoints.up('md')]: {
            fontSize: '1.125rem',
            minWidth: '10.135rem',
          },
      
        },
      },
    },
  },
  typography: {
    base: 18,
    fontFamily: `'Asap', 'Arial', sans-serif`,
    // Define typography styles for all heading elements (h1 to h6)
    h1: {
      fontSize: '2.25rem', 
      fontWeight: 600, 
      color: '#242424',
      [getTheme.breakpoints.up('sm')]: {
        fontSize: '2.625rem',
      },
      [getTheme.breakpoints.up('md')]: {
        fontSize: '3.5rem', // ~ 56px
      },  
      
    },
    h2: {
      fontSize: '3rem',   // ~ 48px
      fontWeight: 600,   
      color: '#242424',
      
    },
    h3: {
      fontSize: '1.5rem',  
      fontWeight: 600, 
      color: '#242424',   
      [getTheme.breakpoints.up('md')]: {
        fontSize: '2.25rem', // ~ 36px
      },
      
    },
    h4: {
      fontSize: '1.5rem',  // ~ 24px
      fontWeight: 600, 
      color: '#242424',   
      
    },
    h5: {
      fontWeight: 600,
      fontSize: '0.875rem', // ~ 14px    
      color: '#242424',
      [getTheme.breakpoints.up('sm')]: {
       fontSize: '1rem', // ~ 16px
     },
     [getTheme.breakpoints.up('md')]: {
       fontSize: '1.25rem', // ~ 20px
     },  
    },
    h6: {
      fontSize: '1.125rem',    // ~ 18px
      fontWeight: 600,    
      color: '#242424',
      
    },
    span: {
      fontSize: '0.875rem', // ~ 14px    
      lineHeight: '1.25rem',
      color: '#242424',
      [getTheme.breakpoints.up('sm')]: {
       fontSize: '1rem', // ~ 16px
       lineHeight: '1.375rem'

     },
     [getTheme.breakpoints.up('md')]: {
       fontSize: '1.125rem', // ~ 18px
       lineHeight: '1.625rem'
     },  
    },
    p: {
      fontSize: '1rem',  
      lineHeight: '1.25rem',
      color: '#242424',
      fontWeight: '400',
      [getTheme.breakpoints.up('sm')]: {
       fontSize: '1.125rem', 
       lineHeight: '1.375rem',
     },
     [getTheme.breakpoints.up('md')]: {
       fontSize: '1.25rem', 
       lineHeight: '1.625rem'
     },  
    },
    body1: {
      fontSize: '1rem',  
      lineHeight: '1.25rem',
      color: '#242424',
      fontWeight: '400',
      [getTheme.breakpoints.up('sm')]: {
       fontSize: '1.125rem', 
       lineHeight: '1.375rem'
     },
     [getTheme.breakpoints.up('md')]: {
       fontSize: '1.25rem', 
       lineHeight: '1.625rem'
     },  
    },
    body2: {
      fontSize: '0.875rem',  
      lineHeight: '1.25rem',
      fontWeight: '400',

     [getTheme.breakpoints.up('md')]: {
       fontSize: '1rem', 

     },  
    },

    small: {
      fontSize: '0.75rem',  
      lineHeight: '1rem',
      color: '#808080',
      fontWeight: '400',
      [getTheme.breakpoints.up('sm')]: {
       fontSize: '0.875rem', 
       lineHeight: '1.25rem'
     },
    },
    
  },

  palette: {
    primary: {
      main: "#2e813e",
      light: "#F4FFF5",
      thinLight: "#F5F9F5",
      thinGrayLight: '#F7F7F5',
      contrastText: "#fff",
    },
    primary_2: {
      main: "#54585a",
      gray: '#808080'
    },
    blue: {
      main: '#2C77E9',
    },
    secondary: {
      // main: "#f26d04",
      main: "#2E813E",
    },
    danger: {
      main: '#FF5858',
    },
    dark : {
      main: "#000",
      light: "#242424"
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
    box: {
      primary: '#2E813E1A'
    }
  },
  shape: {
    borderRadius: 8,
  },
  
});

export default theme;
