import { createTheme } from "@mui/material";
import { useTheme } from '@mui/material/styles';

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
          fontWeight: '600',
          textTransform: 'inherit',
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
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
    base: 18,
    fontFamily: `'Asap', 'Arial', sans-serif`,
    // Define typography styles for all heading elements (h1 to h6)
    h1: {
      fontSize: '2.25rem', 
      fontWeight: 600, 
      color: '#242424',
      [getTheme.breakpoints.up('sm')]: {
        fontSize: '3rem',
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
      fontSize: '2.25rem',  // ~ 36px
      fontWeight: 600, 
      color: '#242424',   
      
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
       fontSize: '1.125rem', // ~ 18px
     },  
    },
    h6: {
      fontSize: '1rem',    // ~ 16px
      fontWeight: 600,    
      color: '#242424',
      
    },
    span: {
      fontSize: '0.875rem', // ~ 14px    
      lineHeight: '1.25rem',
      fontFamily: `'Asap', 'Arial', sans-serif`,
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
      fontFamily: `'Asap', 'Arial', sans-serif`,
      color: '#242424',
      fontSize: '400',
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
      fontFamily: `'Asap', 'Arial', sans-serif`,
      color: '#242424',
      fontSize: '400',
      [getTheme.breakpoints.up('sm')]: {
       fontSize: '1.125rem', 
       lineHeight: '1.375rem'

     },
     [getTheme.breakpoints.up('md')]: {
       fontSize: '1.25rem', 
       lineHeight: '1.625rem'
     },  
    },
    
  },

  palette: {
    primary: {
      main: "#2e813e",
      light: "#F4FFF5",
      thinLight: "#F5F9F5",
      contrastText: "#fff",
    },
    primary_2: {
      main: "#54585a",
    },
    secondary: {
      // main: "#f26d04",
      main: "#2E813E",
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
