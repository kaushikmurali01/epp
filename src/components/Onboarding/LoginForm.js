import React, { useState } from 'react';
import {
    Grid, Box, Card, CardContent, Typography
} from '@mui/material';
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from '@mui/material/styles';
//Configure text



import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../components/FormBuilder/InputField';
import ButtonWrapper from '../../components/FormBuilder//Button';
import { validationSchemaLogIn } from '../../utils/validations/formValidation';
import InputFieldPassword from '../FormBuilder/InputFieldPassword';
import theme from '../../styles/theme';




// Form Initial state

const initialValues = {
    email: "",
    password: "",
};

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

            <Card>
                <CardContent sx={{ padding: '50px', paddingBottom: '50px !important' }}>
                    <Container maxWidth="sm">
                        <Box my={4}>
                            <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.secondary2', fontWeight: 'bold', marginTop: '10px' }}>
                                Login
                            </Typography>
                            <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.secondary2', fontWeight: '400', fontSize: '16px' }}>
                                Company/Main Administrator Account
                            </Typography>


                        <div className="form-box" id='api'>
                            <Formik
                                initialValues={{
                                    ...initialValues
                                }}
                                validationSchema={validationSchemaLogIn}
                                onSubmit={loginSubmit}
                            >
                                <Form>

                                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>

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


                                            <Grid item xs={6} justifyContent="center" sx={{ mt: 3 }}>
                                                <ButtonWrapper type="submit" color='neutral' width='165px' height='48px'>
                                                    Login
                                                </ButtonWrapper>
                                            </Grid>
                                            <Grid item xs={6} display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
                                                <Typography sx={{ mt: 3, fontWeight: 'bold', color: '#2C77E9' }}>
                                                    Forgot Password ?
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                    </Form>
                                </Formik>
                            </div>
                        </Box>
                    </Container>
                </CardContent>
            </Card>

        </React.Fragment>
    )
}

export default LoginForm;
