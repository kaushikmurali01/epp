import React, { useState } from 'react';
import {
    Grid, Box
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//Configure text

import TextAreaField from '../FormBuilder/TextAreaField';

import * as yup from "yup"
import { validationSchemaLogIn } from '../../utils/validations/formValidation';
import InputField from '../FormBuilder/InputField';
import { Form, Formik } from 'formik';

import ButtonWrapper from '../../components/FormBuilder//Button';


// Form Initial state




const initialValues = {
    email: "",
    password: "",
  };
// Modify MUI theme
const theme = createTheme({
    palette: {
      neutral: {
        main: '#d45e68',
        contrastText: '#fff',
      },
    },
    shape: {
        borderRadius: 16,
      }, 
  });

const SignUpForm = () => {

   
    const handelSubmit = (data) => {
        // event.preventDefault();        
        // On form submit need to check all fields are valid
        
        
        console.log(data, "on submit function");      
     
        
    }

    return (
        <React.Fragment>
            <Box component="div" 
                sx={{ 
                    width: {md:'46%', xs:'100%'},
                }}
            >
              
                <div className="form-box">
                    <Formik
                        initialValues={{
                            ...initialValues
                        }}
                        validationSchema={validationSchemaLogIn}
                        onSubmit={handelSubmit}  
                        >
                        <Form>

                            <Grid container spacing={2}>

                                <Grid item xs={12}>
                                    <InputField
                                    name="email"
                                    label="Email"
                                    type = "email"
                                    />
                                </Grid>
                                {/* <Grid item xs={12}>
                                    <InputField
                                    name="password"
                                    label="Password"
                                    type = "password"
                                    />
                                </Grid> */}

                                <Grid item xs={12}>
                                   <TextAreaField
                                   name="message"
                                    label="Message"
                                    
                                   />
                                </Grid>
                                
                                
                                <Grid item xs={12}  justifyContent="center">
                                    <ThemeProvider theme={theme}>
                                        <ButtonWrapper  type="submit" color='neutral'> 
                                             Login
                                        </ButtonWrapper>
                                    </ThemeProvider>
                                </Grid>
                                <Grid item xs={12} display="flex" justifyContent="center">
                                    <Box component="div" sx={{ mt:3, fontWeight: 'bold', color: '#2d80d2', textDecoration: 'underline'}}>
                                        <span >
                                            Forgot Password ?
                                        </span>
                                    </Box>
                                </Grid>
                            </Grid>

                        </Form>
                    </Formik>
                </div>

            </Box>

        </React.Fragment>
    )
}

export default SignUpForm;
