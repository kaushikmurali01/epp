import React from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import MicroStyledListItemComponent from "components/ProfilePageComponents/MicroStyledComponent";


const ProfilePage = () => {
  const profileButtonStyle = {
    color: "#2C77E9",
    fontSize: "1rem",
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "115.559%",
    padding: 0,
    justifyContent: "flex-end",
    "&:hover": { background: "transparent" },
  };

  const tabStyle = {
    width: "max-content",
    padding: "0.375rem 1rem",
    borderRadius: "138.875rem",
    border: "1px solid #D0D0D0",
    background: "#EBEBEB",
    color: "#696969",
    fontSize: "0.875rem !important",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "normal",
  };

  const otherInfoHeaderStyle = {
    color: "#54585A",
    fontSize: "0.75rem !important",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "1 !important",
    paddingBlockEnd: "0.5rem",
    borderBottom: "0.025rem solid #242424",
  };

  const otherInfoStyleContentStyle = {
    color: "#54585A",
    fontSize: "0.875rem !important",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "1 !important",
    marginBlockEnd: "0.5rem",
  };

  

  return (
    <Container>
      <Typography variant="h4" fontWeight={"700"} marginBlockEnd={"3rem"}>
        My profile
      </Typography>

      <Grid
        container
        gap={"2rem"}
        wrap="nowrap"
        sx={{
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "flex-start",
          alignItems: { xs: "center", md: "flex-start" },
        }}
      >
        <Grid
          container
          item
          sx={{
            width: { xs: "8.5rem", md: "12.5rem" },
            flex: "none", // Ensure it doesn't flex
          }}
        >
          <figure>
            <img
              style={{
                maxWidth: "100%",
                width: "100%",
                height: "100%",
                flexShrink: "0",
                aspectRatio: 1,
                borderRadius: "100%",
              }}
              src="/images/landingPage/header_banner.jpg"
              alt="profile"
            />
          </figure>
        </Grid>

        <Grid container item sx={{ flex: "1", gap: "1.5rem" }}>
          <Grid
            container
            columnGap={"1rem"}
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            alignContent="stretch"
            wrap="nowrap"
          >
            <Grid item>
              <Typography variant="h3">Ben Miller</Typography>
              <Typography variant="h6">Role: Super Admin</Typography>
            </Grid>
            <Grid
              container
              item
              width={"auto"}
              direction="column"
              justify="flex-start"
              alignItems="flex-end"
              alignContent="stretch"
              wrap="nowrap"
              gap="1.25rem"
            >
              <Button sx={profileButtonStyle}>Change Password</Button>
              <Button sx={profileButtonStyle}>Edit Profile</Button>
              <Button sx={profileButtonStyle}>
                Change Super administrator
              </Button>
            </Grid>
          </Grid>

          <Box display={"flex"} flexDirection={"column"} gap={"3.25rem"}>
            <Box display={"flex"} gap={"1.25rem"} flexDirection={"column"}>
              <Typography variant="h6" sx={tabStyle}>
                Contact information
              </Typography>
              <List
                disablePadding
                sx={{
                  display: "flex",
                  width: "auto",
                  flexWrap: "wrap",
                  gap: "1.44rem",
                }}
                className="profileLists"
              >
                
                <MicroStyledListItemComponent
                  primary="primary"
                  secondary="secondary"
                />
              </List>
            </Box>

            <Box display={"flex"} gap={"1.25rem"} flexDirection={"column"}>
              <Typography variant="h6" sx={tabStyle}>
                Company details
              </Typography>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#242424)",
                    fontSize: "1.125rem !important",
                    fontWeight: 600,
                    lineHeight: "normal",
                  }}
                >
                  Wallmart
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#242424)",
                    fontSize: "0.875rem !important",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  www.wallmartdummy.com
                </Typography>
              </Box>
              <List
                disablePadding
                sx={{
                  display: "flex",
                  width: "auto",
                  flexWrap: "wrap",
                  gap: "1.44rem",
                }}
                className="profileLists"
              >
                <MicroStyledListItemComponent
                  primary="primary"
                  secondary="secondary"
                />
                <MicroStyledListItemComponent
                  primary="primary"
                  secondary="secondary"
                />
                <MicroStyledListItemComponent
                  primary="primary"
                  secondary="secondary"
                />
                <MicroStyledListItemComponent
                  primary="primary"
                  secondary="secondary"
                />
                <MicroStyledListItemComponent
                  primary="primary"
                  secondary="secondary"
                />
              </List>
            </Box>

            <Box display={"flex"} gap={"1.25rem"} flexDirection={"column"}>
              <Typography variant="h6" sx={tabStyle}>
                Also part of:
              </Typography>

              <List
                disablePadding
                sx={{
                  display: "flex",
                  width: "auto",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  flexDirection: "row",
                }}
              >
                <ListItem disablePadding>
                  <ListItemText
                    sx={{ display: "flex", gap: "2.5rem", margin: 0 }}
                    primary="test"
                    secondary="12432rf"
                    primaryTypographyProps={otherInfoHeaderStyle}
                    secondaryTypographyProps={otherInfoHeaderStyle}
                  />
                </ListItem>

                {/* loop over below ListItem */}
                <ListItem disablePadding>
                  <ListItemText
                    sx={{ display: "flex", gap: "2.5rem", margin: 0 }}
                    primary="test"
                    secondary="hsiuhiuhuwduoicjnwd"
                    primaryTypographyProps={otherInfoStyleContentStyle}
                    secondaryTypographyProps={otherInfoStyleContentStyle}
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
