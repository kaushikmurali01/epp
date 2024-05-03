import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { setOption, setOption2 } from "../../../redux/actions/simpleActions";
import { Box, Container, Grid, Typography, InputLabel } from "@mui/material";
import SelectBox from "components/FormBuilder/Select";
import { Form, Formik } from "formik";
import { validationSchemaAddFacility } from "../../../utils/validations/formValidation"
import InputField from "components/FormBuilder/InputField";
import ButtonWrapper from "components/FormBuilder/Button";
import { POST_REQUEST } from "utils/HTTPRequests";
import { facilityEndPoints, uploadFileEndPoints } from "constants/endPoints";
import axios from "axios";

const AddFacilityComponent = (props) => {

    const initialValues = {
        facilityConstructionStatus: "",
        facility_name: "",
        isBuildinTarriffClass: "",
        naicCode: "",
        facilityCategory: "",
        facilityType: "",
        energySavingForFacility: "",
    };

    const buildingFacilitystr = "Is . the building/facility in the tariff class GS > 50KW?*";

    const FacilityConstructionStatusArray = [
        { id: 1, name: 'Construction Status 1', label: 'Construction Status 1', value: 'Construction Status 1' },
        { id: 2, name: 'Construction Status 2', label: 'Construction Status 2', value: 'Construction Status 2' }
    ];

    const FacilityTypeArray = [
        { id: 1, name: 'Customer', label: 'Customer', value: 'Customer' },
        { id: 2, name: 'Aggregator', label: 'Aggregator', value: 'Aggregator' }
    ];

    const FacilityCategoryArray = [
        { id: 1, name: 'Category 1', label: 'Category 1', value: 'Category 1' },
        { id: 2, name: 'Category 2', label: 'Category 2', value: 'Category 2' }
    ];

    const FacilityEnergySavingArray = [
        { id: 1, name: 'Saving 1', label: 'Saving 1', value: 'Saving 1' },
        { id: 2, name: 'Saving 2', label: 'Saving 2', value: 'Saving 2' }
    ];

    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState();

    const handleButtonClick = () => {
        // Trigger the click event on the hidden file input element
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        // Handle the file selection here
        const selectedFile = event.target.files[0];
        console.log('Selected file:', selectedFile);
        setSelectedFile(URL.createObjectURL(selectedFile));
        const formData = new FormData();
        formData.append('file', selectedFile);
        // POST_REQUEST(uploadFileEndPoints.UPLOAD_FILE, formData, true)
        // .then((response) => {
        // })
        // .catch((error) => {
        // });
        axios.post('https://ams-enerva-dev.azure-api.net/company-facility/v1/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(({ data }) => console.log(data));
    };

    const handleSubmit = (values) => {
        console.log(values)

        POST_REQUEST(facilityEndPoints.ADD_FACILITY, values)
            .then((response) => {
            })
            .catch((error) => {
            });
    };

    const deletePicture = () => {
        setSelectedFile('');
    }

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
                        <Box sx={{ display: 'flex', border: '1px solid #D8FFDC', backgroundColor: '#D8FFDC', padding: '0 16px', borderRadius: '10px', width: '200px', height: '38px', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography sx={{ color: '#54585A', fontWeight: '400', fontSize: '12px' }}>
                                Status:
                            </Typography>
                            <Typography sx={{ color: '#348D3D', fontWeight: '500', fontSize: '18px', marginLeft: '5px' }}>
                                Existing
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Typography my={4} sx={{ color: '#696969', fontWeight: '500', fontSize: '14px', border: '1px solid #D0D0D0', backgroundColor: '#EBEBEB', padding: '4px 16px', borderRadius: '10px', width: '175px', height: '38px' }}>
                    Facility Details
                </Typography>

                <Formik
                    initialValues={{ ...initialValues }}
                    validationSchema={validationSchemaAddFacility}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="facility_construction_status" label="Facility construction status*" options={FacilityConstructionStatusArray} />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <InputField name="facility_name" label="Facility Name*" type="text" />
                            </Grid>

                        </Grid>

                        {/* <Grid item xs={12} sm={12} my={2}>
                                <InputLabel sx={{ color: '#2E813E' }}>{buildingFacilitystr}</InputLabel>
                                <Box sx={{ display: 'flex' }} my={2}>
                                    <Typography sx={{ color: '#ffffff', fontWeight: '600', fontSize: '14px', width: '57px', height: '32px', backgroundColor: '#2E813E', borderRadius: '8px 0px 0px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        Yes
                                    </Typography>
                                    <Typography sx={{ color: '#000000', fontWeight: '600', fontSize: '14px', width: '57px', height: '32px', backgroundColor: '#E9E9E9', borderRadius: '0px 8px 8px 0px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        No
                                    </Typography>
                                </Box>
                            </Grid> */}

                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>

                            <Grid item xs={12} sm={4}>
                                <InputField name="naic_code" label="NAIC’s Code" type="text" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="facility_category" label="Facility Category*" options={FacilityCategoryArray} />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <SelectBox name="facility_type" label="Facility Type*" options={FacilityTypeArray} />
                            </Grid>

                        </Grid>

                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                            <Grid item xs={12} sm={4}>
                                <SelectBox name="target_saving" label="What is your target energy savings for this facility?*" options={FacilityEnergySavingArray} />
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} sx={{ marginTop: '10px' }}>
                            <InputLabel sx={{ color: '#2E813E' }}>Facility photo</InputLabel>
                            {!selectedFile ?
                                <>
                                    <Typography my={1} sx={{ color: '#696969', fontWeight: '500', fontSize: '18px', border: '1px solid #D0D0D0', backgroundColor: '#D1FFDA', padding: '6px 34px', borderRadius: '8px', width: '140px', height: '40px' }} onClick={handleButtonClick}>
                                        Upload
                                    </Typography>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange} /></> :
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        <img src={selectedFile} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                    </div>
                                    <div style={{ marginLeft: '20px' }}>
                                        <Typography my={1} sx={{ color: '#2C77E9', fontWeight: '500', fontSize: '16px !important' }} onClick={handleButtonClick}>
                                            Change Picture
                                        </Typography>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange} />
                                        <Typography my={1} sx={{ color: '#FF5858', fontWeight: '500', fontSize: '16px !important' }} onClick={deletePicture}>
                                            Delete Picture
                                        </Typography>
                                    </div>
                                </div>
                            }
                        </Grid>


                        {/* </Grid> */}

                        <Typography my={4} sx={{ color: '#696969', fontWeight: '500', fontSize: '14px', border: '1px solid #D0D0D0', backgroundColor: '#EBEBEB', padding: '4px 16px', borderRadius: '10px', width: '100px', height: '37px' }}>
                            Address
                        </Typography>

                        {/* <Grid container spacing={2} sx={{ marginTop: '10px' }}>

                            <Grid item xs={12} sm={8}>
                                <InputField name="address" label="Address line 1*" type="text" />
                            </Grid>

                        </Grid> */}

                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>

                            <Grid item xs={12} sm={4}>
                                <InputField name="unit_number" label="Unit number*" type="text" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <InputField name="street_number" label="Street number*" type="text" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <InputField name="street_name" label="Street name*" type="text" />
                            </Grid>

                        </Grid>

                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>

                            <Grid item xs={12} sm={3}>
                                <InputField name="city" label="City*" type="text" />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <InputField name="province" label="Province/State*" type="text" />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <InputField name="country" label="Country*" type="text" />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <InputField name="postal_code" label="Zip code/Postal code*" type="text" />
                            </Grid>

                        </Grid>

                        <Box mt={4} rowGap={4}>
                            <ButtonWrapper type="submit" color='neutral' width='165px' height='48px' onClick={handleSubmit}>
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
