import React, { lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, Modal, Typography, styled } from "@mui/material";
import { Visibility, Create, Description, People } from "@mui/icons-material";
import DashboardRoutes from "./dashboard";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  MsalProvider,
  useAccount,
} from "@azure/msal-react";

import { GET_REQUEST } from "utils/HTTPRequests";
import { USER_MANAGEMENT } from "constants/apiEndPoints";
import { CustomerRoutes } from "./customerRoutes";
import { EnervaRoutes } from "./enervaRoutes";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../redux/superAdmin/actions/facilityActions";
import Loader from "pages/Loader";
import { IndividualUserRoutes } from "./individualUserRoutes";

const CommonLayout = lazy(() => import("layout/dashboardLayout")); //todo

const RoutesComp = () => {
  const { pathname } = useLocation();
  const [showNewUserPopup, setNewUserPopUp] = useState(false);
  const [isNewUser ,setIsNewuser] = useState(false)
  const token = localStorage.getItem(
    `msal.${process.env.REACT_APP_AZURE_B2C_CLIENT_ID}.active-account`
  );
  const { instance, accounts, inProgress } = useMsal();
  const dispatch = useDispatch();

  const userData= useSelector(
    (state) => state?.facilityReducer?.userDetails || {}
  );

  const userDetails = userData?.user || {};
  const userCompany = userData?.company || {};
  const userPermissions = userData?.permissions || {};

  localStorage.setItem('userDetails', JSON.stringify(userDetails))
  localStorage.setItem('userPermissions', JSON.stringify(userPermissions))

  const activeAccount = instance.getActiveAccount();
  const account = useAccount(accounts[0] || {});

  const onClose = () => {
    localStorage.setItem('newUserPopupDisplayed', true)
    setNewUserPopUp(false);
  };

  const selectRouter = (userType) => {
    switch (userType) {
      case 2:
        return <CustomerRoutes userDetails={userDetails} userPermissions={userPermissions} userCompany={userCompany}/>;
      case 1:
        return (<EnervaRoutes />);
      case 3:
        return (<IndividualUserRoutes userDetails={userDetails} userPermissions={userPermissions}/>);
    //   default:
    //     return <UnprotectedRouter />;
    }
  };

  useEffect(() => {
    if (account) {
      instance
        .acquireTokenSilent({
          scopes: [],
        })
        .then((response) => {
          console.log("response.", response)
          localStorage.setItem("accessToken", response?.idToken);
          if(localStorage.getItem("selectedCompanyId")){
            dispatch(fetchUserDetails(localStorage.getItem("selectedCompanyId")));
          } else{
            localStorage.setItem("selectedCompanyId", 0)
            dispatch(fetchUserDetails());
          }
          
          if(response?.idTokenClaims?.newUser){
            setIsNewuser(true)
          }
        });
    }
  }, [account]);

  useEffect(() => {
    if (isNewUser && !localStorage.getItem('newUserPopupDisplayed') && (userDetails.type == 2 || userDetails.type == 3)) {
      setNewUserPopUp(true);
    }
  }, [isNewUser, userData])

  console.log("user info", userDetails)

  useEffect(() => {
    instance.handleRedirectPromise()
        .then((response) => {
            if (response) {
                // Handle successful login or password change
                console.log('Password change successful:', response);
            }
        })
        .catch((error) => {
            console.error('Error during authentication:', error);
        });
  }, []);

  const accessItems = [
    {
      text: "View all the facilities that have been created and/or submitted",
    },
    {
      text: "Create facilities, enter/edit data for them and submit them for baseline energy modelling",
    },
    {
      text: "Review, sign and/or download the Participant Agreement",
    },
    {
      text: "View and update the user list for the company including managing individual user permissions",
    },
  ];

  return userDetails?.type ? (
    <>
      <CommonLayout>
        {/* <DashboardRoutes /> */}
        {selectRouter(userDetails?.type)}
      </CommonLayout>

      <Modal
        open={showNewUserPopup}
        onClose={onClose}
        aria-labelledby="welcome-modal"
        aria-describedby="first-time-user-welcome-modal"
        disableAutoFocus
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "500px", md: "48rem" },
            borderRadius: "2rem",
            bgcolor: "#fff",
            p: 4,
          }}
          className={"modal-size"}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
              mb: 2,
            }}
          >
            <img src="/images/new_user_popup_icon.svg" alt="new user pop up" />
          </Box>
          <Box
            sx={{
              width: "100%",
              mt: 2,
              mb: 4,
              textAlign: { xs: "center", md: "start" },
            }}
          >
            <Typography variant="h4" sx={{ color: "text.secondary2" }}>
              Welcome to the EPP Program.
            </Typography>
            <Typography variant="small2" sx={{ color: "text.secondary2" }}>
              You are all set to start saving energy and earning incentives.
            </Typography>
          </Box>

          {/* <List
            disablePadding
            className="welcomeModalList"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: "0.5rem", md: "0" },
              width: "100%",
              mt: 2,
              mb: 2,
              justifyContent: "space-between",
            }}
          >
            <ListItem
              disablePadding
              sx={{
                width: { xs: "max-content", md: "auto" },
                padding: "0.25rem 0.75rem",
                borderRadius: "208.3125rem",
                background: "#CAFFCF",
                color: "#242424",
                fontSize: "0.875rem",
                fontWeight: 400,
                lineHeight: "185.714%",
              }}
            >
              Create your facility
            </ListItem>
            <img
              src="/images/dashboard-arrow.svg"
              alt="arrow"
              style={{ width: "15px" }}
            />
            <ListItem
              disablePadding
              sx={{
                width: { xs: "max-content", md: "auto" },
                padding: "0.25rem 0.75rem",
                borderRadius: "208.3125rem",
                background: "#CAFFCF",
                color: "#242424",
                fontSize: "0.875rem",
                fontWeight: 400,
                lineHeight: "185.714%",
              }}
            >
              Enter facility data and submit
            </ListItem>
            <img
              src="/images/dashboard-arrow.svg"
              alt="arrow"
              style={{ width: "15px" }}
            />
            <ListItem
              disablePadding
              sx={{
                width: { xs: "auto", sm: "max-content", md: "auto" },
                padding: "0.25rem 0.75rem",
                borderRadius: "208.3125rem",
                background: "#CAFFCF",
                color: "#242424",
                fontSize: "0.875rem",
                fontWeight: 400,
                lineHeight: "185.714%",
                textAlign: "center",
              }}
            >
              Review and accept Baseline Energy Model
            </ListItem>
          </List> */}

          <Typography variant="body2" gutterBottom>
            Depending on the access you have been granted, you can do the
            following:
          </Typography>
          <List sx={{padding: 0}}>
            {accessItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemText secondaryTypographyProps={{color: "#242424"}} secondary={`${index + 1}) ${item.text}`} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body2" style={{ marginTop: "16px" }}>
            If you have not been granted any access yet by the administrators
            for the company, you will not be able to see anything. Please
            contact them to get your access.
          </Typography>
          <Box
            sx={{
              width: "100%",
              mt: 4,
              textAlign: { xs: "center", md: "start" },
            }}
          >
            <Button
              variant="contained"
              onClick={() => onClose()}
              style={{
                padding: "0.2rem 1rem",
                minWidth: "unset",
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  ) : (
    <>
      <CommonLayout></CommonLayout>
      <Loader />
    </>
  );
};

export default RoutesComp;
