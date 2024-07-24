import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

const Error404 = (props) => {
  const navigate = useNavigate();
  navigate("/");

  return (
    <Grid
      sx={{
        padding: { xs: "1rem", md: "4rem" },
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        display: "flex",
      }}
    >
      <Typography variant="h1" color="initial" textAlign={"center"}>
        Welcome to the EPP Portal{" "}
      </Typography>
      <Typography
        variant="p"
        color="initial"
        textAlign={"center"}
        sx={{ marginBlock: { xs: "1rem", md: "1.5rem" } }}
      >
        Please note, you do not have access to view this page. Administrators
        will give you access to see the dashboard.
      </Typography>
      {props?.userDetails?.type == 2 ? (
        <Link
          to="/"
          style={{
            color: "#2e813e",
            paddingTop: " 1.5rem",
            paddingBottom: "1.5rem",
          }}
        >
          Go Home
        </Link>
      ) : null}

      {props?.userDetails?.type == 3 ? (
        <>
          <Typography
            variant="p"
            color="initial"
            textAlign={"center"}
            sx={{ marginBlock: { xs: "1rem", md: "1.5rem" } }}
          >
            If you have received an email from a company to join, you can join
            that company by accepting the invitation by clicking on the
            notification icon in the header in the top right.
          </Typography>
          <Typography
            variant="p"
            color="initial"
            textAlign={"center"}
            sx={{ marginBlock: { xs: "1rem", md: "1.5rem" } }}
          >
            If you are a new user, and want to join a company, please click on
            “Request to join company” on the header.
          </Typography>
        </>
      ) : null}
    </Grid>
  );
};

export default Error404;