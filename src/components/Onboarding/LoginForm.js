import React, { useState } from 'react';
import {
    Grid, Box, Card, CardContent, Typography
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//Configure text



import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../components/FormBuilder/InputField';
import ButtonWrapper from '../../components/FormBuilder//Button';
import { validationSchemaLogIn } from '../../utils/validations/formValidation';
import InputFieldPassword from '../FormBuilder/InputFieldPassword';




// Form Initial state

const initialValues = {
    email: "",
    password: "",
};
// Modify MUI theme
const theme = createTheme({
    palette: {
        neutral: {
            main: '#2E813E',
            contrastText: '#fff',
        },
    },
    shape: {
        borderRadius: 16,
    },
});

const LoginForm = () => {

    // Login Form Submit Button.
    const loginSubmit = (data) => {
        // event.preventDefault();        
        // On form submit need to check all fields are valid

        let params = {
            email: data.email,
            password: data.password
        }
        console.log(params, data, "on submit function");


    }


    return (
        <React.Fragment>
            <Box component="div"
                sx={{
                    width: { md: '35%', xs: '100%' },
                }}
            >

                <Card>
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Log In
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Company/Main Administrator Account
                        </Typography>


                        <div className="form-box">
                            <Formik
                                initialValues={{
                                    ...initialValues
                                }}
                                validationSchema={validationSchemaLogIn}
                                onSubmit={loginSubmit}
                            >
                                <Form>

                                    <Grid container spacing={2}>

                                        <Grid item xs={12}>
                                            <InputField
                                                name="email"
                                                label="Email Id"
                                                type="email"
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
                                            <InputFieldPassword
                                                name="password"
                                                type="password"
                                                label="Password"
                                                showeyeicon="true"
                                                showpasswordHints="false"
                                            />
                                        </Grid>


                                        <Grid item xs={6} justifyContent="center">
                                            <ThemeProvider theme={theme}>
                                                <ButtonWrapper type="submit" color='neutral' width='165px' height='48px'>
                                                    Login
                                                </ButtonWrapper>
                                            </ThemeProvider>
                                        </Grid>
                                        <Grid item xs={6} display="flex" justifyContent="flex-end">
                                            <Typography sx={{ mt: 3, fontWeight: 'bold', color: '#2C77E9' }}>
                                                Forgot Password ?
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                </Form>
                            </Formik>
                        </div>

                    </CardContent>
                </Card>
            </Box>

        </React.Fragment>
    )
}

export default LoginForm;
