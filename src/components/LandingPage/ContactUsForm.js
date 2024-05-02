import React from 'react';
import { Typography, Grid, Box, Container } from '@mui/material';
import InputField from '../FormBuilder/InputField';
import ButtonWrapper from '../FormBuilder/Button';
import { Form, Formik } from 'formik';
import TextAreaField from '../FormBuilder/TextAreaField';
import { POST_REQUEST } from 'utils/HTTPRequests';
import { landingPageEndPoints } from 'constants/endPoints';
import { validationSchemaLandingPageForm } from 'utils/validations/formValidation';



const ContactUsForm = () => {


    const initialValues = {
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
    };

    const contactUsSubmit = (data) => {
        // event.preventDefault();        
        // On form submit need to check all fields are valid

        const apiURL = 'https://enervauser.azurewebsites.net/api/v1/contact';
        // const apiURL = landingPageEndPoints.constUsForm;
        console.log(data, "on submit function");
        const requestBody = {
            name: data.name,
            company: data.company,
            email: data.email,
            message: data.message,
            phone: data.phone,

        }

        POST_REQUEST(apiURL, requestBody)
            .then((response) => {
                console.log(response, "response")

            })
            .catch((error) => {
                console.log(error, 'error')


            })


    }

    return (
        <Box component={'section'} className='contact-us-section common-section' >
            <Container maxWidth="lg">



                <Box component={'div'} >
                    <Grid container >
                        <Grid  item xs={12} md={3} className='heading-row' sx={{ paddingRight: {md: '2rem', xs: '1rem'}}} >
                            <Typography variant="h3" sx={{marginBottom: '1.5rem'}} >
                                Contact Us
                            </Typography>
                            <Typography variant="span">
                                 Contact us if you want to learn more about EPP
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Formik
                                initialValues={{
                                    ...initialValues
                                }}
                                validationSchema={validationSchemaLandingPageForm}
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
                                                    name="company"
                                                    placeholder="Company"
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

                                        <Grid display="flex">
                                            <ButtonWrapper type="submit" variant="contained" >
                                                Submit
                                            </ButtonWrapper>

                                        </Grid>
                                    </Form>
                            </Formik>
                        </Grid>
                    </Grid>

                </Box>

            </Container>
        </Box>
    );
}

export default ContactUsForm;
