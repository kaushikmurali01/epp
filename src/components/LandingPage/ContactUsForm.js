import React from 'react';
import { Typography, Grid, Box, Container } from '@mui/material';
import InputField from '../FormBuilder/InputField';
import ButtonWrapper from '../FormBuilder/Button';
import { Form, Formik } from 'formik';
import TextAreaField from '../FormBuilder/TextAreaField';



const ContactUsForm = () => {
    

    const initialValues = {
        name: "",
        city: "",
        email: "",
        phone: "",
        message: "",
    };

    const contactUsSubmit = (data) => {
        // event.preventDefault();        
        // On form submit need to check all fields are valid


        console.log(data, "on submit function");


    }

    return (
        <Box component={'section'} className='contact-us-section common-section' >
            <Container maxWidth="lg">



                <Box component={'div'} >
                    <Grid container className='heading-row'>
                        <Grid container item xs={12} justifyContent="center" >
                            <Typography variant="h3" className='ev-theme-heading'>
                                Contact Us
                            </Typography>
                        </Grid>
                    </Grid>
                    <Formik
                        initialValues={{
                            ...initialValues
                        }}
                        // validationSchema={validationSchemaLogIn}
                        onSubmit={contactUsSubmit}
                    >
                        <Form>
                            <ul className='form-data-list' >

                                <li >
                                    <InputField
                                        name="name"
                                        placeholder="Name"
                                        type="text"
                                    />
                                </li>
                                <li  >
                                    <InputField
                                        name="city"
                                        placeholder="City"
                                        type="text"
                                    />
                                </li>
                                <li  >
                                    <InputField
                                        name="email"
                                        placeholder="Email"
                                        type="email"
                                    />
                                </li>

                                <li  >
                                    <InputField
                                        name="phone"
                                        placeholder="Phone"
                                        type="phone"
                                    />
                                </li>

                                <li className='text-area-field'>
                                    <TextAreaField
                                        name="message"
                                        placeholder="Message"
                                        type="text"
                                        rows={8}
                                    />
                                </li>
                            </ul>

                            <Grid display="flex" justifyContent="center">
                                <ButtonWrapper type="submit" variant="contained">
                                    Submit
                                </ButtonWrapper>

                            </Grid>
                        </Form>
                    </Formik>
                </Box>

            </Container>
        </Box>
    );
}

export default ContactUsForm;
