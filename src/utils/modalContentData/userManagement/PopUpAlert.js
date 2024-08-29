import React from 'react'
import { Grid, Typography } from '@mui/material'
import { validationSchemaAlertPopUp } from 'utils/validations/formValidation';
import { Form, Formik } from 'formik';
import TextAreaField from 'components/FormBuilder/TextAreaField';
import ButtonWrapper from 'components/FormBuilder/Button';
import { POST_REQUEST } from 'utils/HTTPRequests';
import NotificationsToast from 'utils/notification/NotificationsToast';

const initialValues = {
    comment: "",
};


const PopUpAlert = ({ modalContent, setModalConfig, apiData }) => {

    const handelFormSubmit = (formdata) => {
        const payload = {
            "email": apiData?.item?.email,
            "comment": formdata?.comment,
            "first_name": apiData.item?.first_name
        }
        console.log(payload, apiData, apiData.apiURL, formdata, "check payload");
       

        POST_REQUEST(apiData.apiURL, payload)
            .then(_response => {
                NotificationsToast({ message: "Alert sent successfully!", type: "success" });
                setModalConfig((prevState) => ({
                    ...prevState,
                    modalVisible: false,
                    modalBodyContent: '',
                }));
            })
            .catch(error => {
                console.log(error, 'error')
                NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
            })
    }

    return (
        <Grid container alignItems='flexStart' flexDirection="column" textAlign='left' sx={{ minWidth: {xs: '100%', sm: '28rem'}, gap: '2rem', padding: { md: '0 5%' } }} >

            <Grid item>
                <Typography variant="h4" sx={{ marginBottom: '0.5rem', color: 'text.secondary2' }}>
                    {modalContent?.title}
                </Typography>
                <Typography variant="small">
                    {modalContent?.content}
                </Typography>
            </Grid>
            <Grid item xs={12} lg={10}>
                <Formik
                    initialValues={{
                        ...initialValues
                    }}
                    validationSchema={validationSchemaAlertPopUp}
                    onSubmit={handelFormSubmit}
                >
                    <Form>
                        <TextAreaField
                            name="comment"
                            label="Comment"
                            type="text"
                            rows={8}
                        />

                        <Grid display="flex" sx={{ marginTop: '1.5rem' }}>
                            <ButtonWrapper type="submit" variant="contained" >
                                Submit
                            </ButtonWrapper>

                        </Grid>
                    </Form>
                </Formik>
            </Grid>
        </Grid>
    )
}

export default PopUpAlert
