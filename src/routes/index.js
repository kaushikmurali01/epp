import React, { lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Box, Button, Modal, Typography, useMediaQuery } from "@mui/material";
import DashboardRoutes from "./dashboard";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  MsalProvider,
  useAccount,
} from "@azure/msal-react";

const CommonLayout = lazy(() => import("layout/dashboardLayout")); //todo

const RoutesComp = () => {
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const { pathname } = useLocation();
  const [showNewUserPopup, setNewUserPopUp] = useState(true);
  const token = localStorage.getItem(
    `msal.${process.env.REACT_APP_AZURE_B2C_CLIENT_ID}.active-account`
  );
  const { instance, accounts, inProgress } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const account = useAccount(accounts[0] || {});

  const onClose = () => {
    setNewUserPopUp(false);
  };

  useEffect(() => {
    if (account) {
      instance
        .acquireTokenSilent({
          scopes: [],
        })
        .then((response) => {
          localStorage.setItem("accessToken", response?.idToken);
          if (response?.idTokenClaims?.newUser) {
            setNewUserPopUp(true);
          }
        });
    }
  }, [account]);

  return true ? (
    <>
      <CommonLayout>
        <DashboardRoutes />
      </CommonLayout>
      <Modal
        open={showNewUserPopup}
        onClose={onClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isSmallScreen ? 200 : 500,
            borderRadius: "2rem",
            bgcolor: "#fff",
            p: 4,
          }}
          className={'modal-size'}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
              mb: 2
            }}
          >
             <img src='/images/new_user_popup_icon.svg' alt='new user pop up' />
          </Box>
          <Box 
          sx={{
            width: "100%",
            mt: 2,
            mb: 4
          }}>
          <Typography variant="h4" sx={{ color: "text.secondary2" }}>
              Welcome to the EPP Program.
            </Typography>
            <Typography variant="small2" sx={{ color: "text.secondary2" }}>
              You are all set to start saving energy and earn incentives.
            </Typography>
          </Box>

          <Box 
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              mt: 2,
              mb: 2,
              justifyContent: 'space-between'
            }}>
            <div>
            Create your facility
            </div>
            <span>

            </span>
            <div>
            Enter facility data and submit
            </div>
            <span>

            </span>
            <div>
            Review and accept Baseline Model
            </div>

          </Box>

          <Box
            sx={{
              width: "100%",
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              onClick={() =>setNewUserPopUp(false)}
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
  ) : null;
};

export default RoutesComp;
