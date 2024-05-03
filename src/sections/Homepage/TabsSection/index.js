import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import CustomTab from "../../../components/FormBuilder/CustomTab";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TabsSection = (props) => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setActiveStep(0);
  };

  const customTabStyle = {
    borderRadius: "10px 10px 0 0",
    padding: { xs: "1rem", md: "1.44rem 2.0625rem" },
    maxWidth: "14.25rem",
    minWidth: "6.875rem",
    fontWeight: "700",
    minHeight: "2.4375rem",
    maxHeight: "3.5625rem",
    fontSize: "16px",
    lineHeight: 1,
    textTransform: "capitalize",
  };

  return (
    <Box
      sx={{
        borderBottom: "0.0625rem",
        borderBottomColor: "#89AD90",
        borderBottomStyle: "solid",
        marginBottom: "3.25rem",
      }}
    >
      <Container>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          TabIndicatorProps={{
            style: { display: "none" },
          }}
          TabScrollButtonProps={{
            style: { display: "none" },
          }}
          // visibleScrollbar="true"
        >
          <CustomTab
            label="Dashboard"
            pageName="Homepage"
            sx={customTabStyle}
            onClick={() => navigate('/admin/facility-dashboard')}
          />
          <CustomTab
            label="Facility List"
            pageName="Homepage"
            sx={customTabStyle}
            onClick={() => navigate('/admin/facility-list')}
          />
          <CustomTab
            label="Participant Agreement"
            pageName="Homepage"
            sx={customTabStyle}
          />
          <CustomTab
            label="User Management"
            pageName="Homepage"
            sx={customTabStyle}
          />
        </Tabs>
      </Container>
    </Box>
  );
};

export default TabsSection;
