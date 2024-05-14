import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import CustomTab from "../../../components/FormBuilder/CustomTab";
import { Box, Container } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { tabsData } from "utils/tabsrouting";

const TabsSection = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const userData= useSelector(
    (state) => state?.facilityReducer?.userDetails || {}
  );

  const userDetails = userData?.user || {};
  const userPermissions = userData?.permissions || {};

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setActiveStep(0);
  };

  const [tabsToShow, setTabsToShow] = useState([{
    label: "Dashboard",
    route:'/facility-dashboard'
  }])

   const checkIfUrlInTabRoute = () => {
    const pathName = location.pathname;
    let parts = pathName.split("/");
    let firstUrlPathAfter = '/'

    if (parts.length > 1) {
        let firstAfterSlash = parts[1];
        firstUrlPathAfter = `/${firstAfterSlash}`
    }

    let a = tabsToShow?.some(obj => Object.values(obj).includes(firstUrlPathAfter));
    const index = tabsToShow.findIndex(obj => Object.values(obj).includes(firstUrlPathAfter));
    setTabValue(index);
  }

  useEffect(() => {
    
      let tabForUser = tabsData(userDetails?.type, userDetails?.rolename, userPermissions )
      let tabs = [...tabsToShow, ...tabForUser];
      setTabsToShow(tabs);
  }, [userData])

  useEffect(() => {
    checkIfUrlInTabRoute()
  },)

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
          onChange={(event, value) => handleTabChange(event, value)}
          variant="scrollable"
          TabIndicatorProps={{
            style: { display: "none" },
          }}
          TabScrollButtonProps={{
            style: { display: "none" },
          }}
        >
          {Array.isArray(tabsToShow) && tabsToShow.length && tabsToShow.map(tab=> (
            <CustomTab
            label={tab.label}
            pageName="Homepage"
            sx={customTabStyle}
            onClick={() => navigate(tab.route)}
          />
          ))}
        </Tabs>
      </Container>
    </Box>
  );
};

export default TabsSection;
