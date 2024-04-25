import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setOption, setOption2 } from "../../../redux/actions/simpleActions";
import { Box, Container, Grid, Typography } from "@mui/material";
import SelectBox from "components/FormBuilder/Select";
import { Form, Formik } from "formik";
import { validationSchemaAddFacility } from "../../../utils/validations/formValidation"
import InputField from "components/FormBuilder/InputField";
import ButtonWrapper from "components/FormBuilder/Button";

const AddFacilityComponent = (props) => {

    const initialValues = {
        facilityConstructionStatus: "",
        facilityName: "",
        isBuildinTarriffClass: "",
        naicCode: "",
        facilityCategory: "",
        facilityType: "",
        energySavingForFacility: "",
    };

    const handleSubmit = (values) => {
    };

    return (
        <>
            <Container my={4} sx={{ marginTop: '50px' }}>
                <Grid container className='heading-row'>
                    <Grid container item xs={10} >
                        <Typography sx={{ fontWeight: '600', fontSize: '24px' }}>
                            Add Facility
                        </Typography>
                    </Grid>
                    <Grid container item xs={2}>
                        <Box sx={{ display: 'flex', border: '1px solid #D8FFDC', backgroundColor: '#D8FFDC', padding: '0 16px', borderRadius: '10px', width: '150px', height: '29px' }}>
                        <Typography sx={{ color: '#54585A', fontWeight: '400', fontSize: '12px', marginTop: '5px' }}>
                            Status:
                        </Typography>
                        <Typography sx={{ color: '#348D3D', fontWeight: '500', fontSize: '18px', marginLeft: '5px' }}>
                            Existing
                        </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Typography my={4} sx={{ color: '#696969', fontWeight: '500', fontSize: '14px', border: '1px solid #D0D0D0', backgroundColor: '#EBEBEB', padding: '4px 16px', borderRadius: '10px', width: '125px', height: '29px' }}>
                    Facility Details
                </Typography>

                <Formik
                    initialValues={{ ...initialValues }}
                    validationSchema={validationSchemaAddFacility}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="facilityConstructionStatus" label="Facility construction status*" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="Facility construction status*" label="Facility construction status*" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="Facility construction status*" label="Facility construction status*" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="naicCode" label="NAIC’s Code" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="facilityCategory" label="Facility Category*" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="facilityType" label="Facility Type*" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="energySavingForFacility" label="What is your target energy savings for this facility?*" />
                            </Grid>

                        </Grid>

                        <Typography my={4} sx={{ color: '#696969', fontWeight: '500', fontSize: '14px', border: '1px solid #D0D0D0', backgroundColor: '#EBEBEB', padding: '4px 16px', borderRadius: '10px', width: '80px', height: '29px' }}>
                    Address
                </Typography>

                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>

                            <Grid item xs={12} sm={4}>
                                <InputField name="streetNumber" label="Street Number*" type="text" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <InputField name="streetName" label="Street Name*" type="text" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <InputField name="city" label="City*" type="text" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="provinceState" label="Province/State*" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <InputField name="postalCode" label="Postal Code*" type="text" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="country" label="Country*" />
                            </Grid>

                        </Grid>

                        <Box mt={4} rowGap={4}>
                            <ButtonWrapper type="submit" color='neutral' width='165px' height='48px'>
                                Add Facility
                            </ButtonWrapper>
                        </Box>
                    </Form>
                </Formik>

            </Container>
        </>

    );
};

const mapDispatchToProps = (dispatch) => ({
    setOption: (optionOne) => dispatch(setOption(optionOne)),
    setOption2: (optionTwo) => dispatch(setOption2(optionTwo)),
});

export default connect(null, mapDispatchToProps)(AddFacilityComponent);
