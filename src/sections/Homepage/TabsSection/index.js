import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import CustomTab from "../../../components/FormBuilder/CustomTab";
import { Container } from "@mui/material";


const TabsSection = (props) => {

    const [tabValue, setTabValue] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setActiveStep(0);
    };

    return (
        <>
       <Container sx={{ marginTop:"150px" }}>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ mt: 4 }}
                TabIndicatorProps={{
                    style: { display: "none" },
                }}
            >
                <CustomTab
                    label="Dashboard"
                    pageName="Homepage"
                    sx={{
                        borderRadius: "10px 10px 0 0",
                        maxWidth: '200px !important',
                        height: '57px !important',
                    }}
                />
                <CustomTab
                    label="Facility List"
                    pageName="Homepage"
                    sx={{
                        borderRadius: "10px 10px 0 0",
                        maxWidth: '200px !important',
                        height: '57px !important',
                    }}
                />
                <CustomTab
                    label="Participant Agreement"
                    pageName="Homepage"
                    sx={{
                        borderRadius: "10px 10px 0 0",
                        maxWidth: '200px !important',
                        height: '57px !important',
                    }}
                />
                <CustomTab
                    label="User Management"
                    pageName="Homepage"
                    sx={{
                        borderRadius: "10px 10px 0 0",
                        maxWidth: '200px !important',
                        height: '57px !important',
                    }}
                />
            </Tabs>
            </Container>
        </>

    );
};

export default TabsSection;
