import React, { useContext, useRef } from 'react';
import { Typography, Grid, Box, Container, Button } from '@mui/material';
import InputField from '../FormBuilder/InputField';
import ButtonWrapper from '../FormBuilder/Button';
import { Form, Formik, useFormikContext } from 'formik';
import TextAreaField from '../FormBuilder/TextAreaField';
import { POST_REQUEST } from 'utils/HTTPRequests';

import { validationSchemaLandingPageForm } from 'utils/validations/formValidation';

import { SnackbarContext } from '../../utils/notification/SnackbarProvider';
import { LANDING_PAGE } from 'constants/apiEndPoints';
import NotificationsToast from 'utils/notification/NotificationsToast';


const ContactUsForm = () => {
    const formikProps = useFormikContext();
    // Create a ref for the form element
    const contactUsFormRef = useRef(null);
    const { showSnackbar } = useContext(SnackbarContext);
    const initialValues = {
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
    };

    const contactUsSubmit = (data) => {
        // event.preventDefault();        
        const apiURL = LANDING_PAGE.CONTACT_US_FORM;
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
                NotificationsToast({ message: "Your form has been submitted!", type: "success" });
                // showSnackbar('Your form has been submitted!', 'success', { vertical: 'top', horizontal: 'right' });
                // Reset the form after successful submission
                setTimeout(() => {
                    contactUsFormRef.current.reset();
                }, 1000);

            })
            .catch((error) => {
                console.log(error, 'error')
                NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
                // showSnackbar(error?.message ? error.message : 'Something went wrong!', 'error', { vertical: 'top', horizontal: 'right' });


            })


    }


    return (
        <Box id='contactUsFormSection' component={'section'} className='contact-us-section common-section' >
            <Container maxWidth="lg">
                <Box component={'div'} >
                    <Grid container >
                        <Grid item xs={12} md={3} className='heading-row' sx={{ paddingRight: { md: '2rem', xs: '1rem' } }} >
                            <Typography variant="h3" sx={{ marginBottom: '1.5rem' }} >
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
                                <Form ref={contactUsFormRef}>
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
