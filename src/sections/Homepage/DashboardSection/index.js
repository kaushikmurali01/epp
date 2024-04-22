import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import CustomTab from "../../../components/FormBuilder/CustomTab";
import { Box, Container, Grid, Typography } from "@mui/material";
import CustomBox from "../../../components/CustomBox";
import AccountRegistration from "../../../assets/images/account-registration.svg";
import SubmitFacility from "../../../assets/images/submit-facility.svg";
import CreateFacility from "../../../assets/images/create-facility.svg";

const DashboardSection = (props) => {

    const [tabValue, setTabValue] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setActiveStep(0);
    };

    return (
        <>
            <Container>
                <Box my={4}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.secondary2', fontWeight: 'bold' }}>
                        Welcome Ben
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.secondary2', fontWeight: '400', fontSize: '16px' }}>
                        Few steps away from enrolling your facility
                    </Typography>

                    <Grid container spacing={2} sx={{ marginTop: '10px' }}>

                        <CustomBox heading='Account Registration' label='Lorem ipsum dolor sit amet consectetur.' color='text.primary' border='1px dotted #2e813e' image={AccountRegistration} />
                        <CustomBox heading='Submit facility for Baseline Model' label='Lorem ipsum dolor sit amet consectetur.' color='text.secondary2' border='1px dotted #54585A' image={SubmitFacility} />
                        <CustomBox heading='Create Facility' label='Lorem ipsum dolor sit amet consectetur.' color='text.secondary2' border='1px dotted #54585A' image={CreateFacility} />
                        <CustomBox heading='Review and accept baseline model' label='Lorem ipsum dolor sit amet consectetur.' color='text.secondary2' border='1px dotted #54585A' image={SubmitFacility} />

                    </Grid>


                </Box>
            </Container>
        </>

    );
};

export default DashboardSection;
