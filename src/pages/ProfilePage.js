import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MicroStyledListItemComponent from "components/ProfilePageComponents/MicroStyledComponent";
import { GET_REQUEST, PUT_REQUEST } from "utils/HTTPRequests";
import InputField from "components/FormBuilder/InputField";
import { Form, Formik } from "formik";
import ButtonWrapper from "components/FormBuilder/Button";
import { validationSchemaProfileDetails } from "utils/validations/formValidation";
import { USER_MANAGEMENT, fileUploadEndPoints } from "constants/apiEndPoints";
import { POST_REQUEST } from "utils/HTTPRequests";
import EditProfileComponent from "components/ProfilePageComponents/EditProfileComponent";
import { useDispatch } from "react-redux";
import Loader from "./Loader";

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
    marginBlockEnd: "0.75rem",
    width: "83.07px",
  };

  const roleInfoStyleContentStyle = {
    ...otherInfoStyleContentStyle,
    width: "auto",
  };

  const dispatch = useDispatch();
  const [showEditPage, setShowEditPage] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const [profilePicture, setProfilePicture] = useState("");

  // Function to handle file input change
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      setProfilePicture(e.target.result);
    };
    uploadFile(file);
  };

  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const endpoint = fileUploadEndPoints.FILE_UPLOAD;
    POST_REQUEST(endpoint, formData, true, "").then((response) => {
      if (response?.data?.sasTokenUrl) {
        setProfilePicture(response?.data?.sasTokenUrl);
      }
    });
  };

  // Function to delete the picture
  const deletePicture = () => {
    setProfilePicture("");
  };

  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    phonenumber: "",
    email: "",
    company_name: "",
    website: "",
    unit_number: "",
    street_number: "",
    street_name: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
  });

  const [userProfileData, setUserProfileData] = useState();

  const getUserProfileData = () => {
    dispatch({ type: "SHOW_LOADER", payload: true });
    const apiURL = "/enerva-user/v1/user";
    GET_REQUEST(apiURL)
      .then((res) => {
        setUserProfileData(res?.data);
        setProfilePicture(
          res?.data?.user?.profile_pic ||
            "/images/landingPage/generic_profile.png"
        );
        setInitialValues((prevValues) => {
          return {
            ...prevValues,
            first_name: res?.data?.user?.first_name || "",
            last_name: res?.data?.user?.last_name || "",
            phonenumber: res?.data?.user?.phonenumber || "",
            email: res?.data?.user?.email || "",
            company_name: res?.data?.company?.company_name || "",
            website: res?.data?.company?.website || "",
            unit_number: res?.data?.company?.unit_number || "",
            street_number: res?.data?.company?.street_number || "",
            street_name: res?.data?.company?.street_name || "",
            city: res?.data?.company?.city || "",
            province: res?.data?.company?.state || "",
            country: res?.data?.company?.country || "",
            postal_code: res?.data?.company?.postal_code || "",
          };
        });
        dispatch({ type: "SHOW_LOADER", payload: false });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserProfileData();
  }, []);

  const handleSubmit = (values) => {
    dispatch({ type: "SHOW_LOADER", payload: true });
    const newValues = { ...values };
    const body = {
      user: {
        first_name: newValues.first_name,
        last_name: newValues.last_name,
        phonenumber: newValues.phonenumber,
        email: newValues.email,
        profile_pic: profilePicture || "",
      },
    };

    //check if role is super-admin
    if (
      userProfileData?.user?.rolename == "Super-Admin" &&
      userProfileData?.user?.type == "2"
    ) {
      // type 2 is for customer
      body.company = {
        company_name: newValues.company_name,
        website: newValues.website,
        city: newValues.city,
        state: newValues.state,
        postal_code: newValues.postal_code,

        country: newValues.country,
        unit_number: newValues.unit_number,
        street_number: newValues.street_number,
        street_name: newValues.street_name,
      };
    }

    const endpoint = USER_MANAGEMENT.EDIT_PROFILE;
    PUT_REQUEST(endpoint, body).then((response) => {
      window.location.reload();
      dispatch({ type: "SHOW_LOADER", payload: false });
    });
  };

  return (
    <>
      {userProfileData ? (
        <Container sx={{ position: "relative" }}>
          <Typography
            variant="h4"
            fontWeight={"700"}
            marginBlockEnd={"3rem"}
            display={"flex"}
            alignItems={"center"}
          >
            {showEditPage ? (
              <>
                <IconButton
                  onClick={() => setShowEditPage(false)}
                  sx={{
                    backgroundColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                    marginRight: "1rem",
                  }}
                >
                  <ArrowBackIcon
                    sx={{
                      color: "#fff",
                      fontSize: "1.25rem",
                    }}
                  />
                </IconButton>
                Back to Profile{" "}
              </>
            ) : (
              "My profile"
            )}
          </Typography>

          <Grid
            container
            gap={"2rem"}
            wrap="nowrap"
            sx={{
              flexDirection: { xs: "column", md: "row" },
              justifyContent: { xs: "center", md: "flex-start" },
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Grid
              container
              item
              sx={{
                // width: { xs: "8.5rem", md: "12.5rem" },
                width: "auto",
                flex: "none", // Ensure it doesn't flex
                gap: "1.25rem",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                style={{
                  width: "12.5rem",
                  height: "12.5rem",
                  maxWidth: "100%",
                  aspectRatio: 1,
                  borderRadius: "100%",
                }}
                src={profilePicture}
                alt="profile"
              />
              {showEditPage && (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  gap={"1.25rem"}
                  sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
                >
                  <input
                    type="file"
                    id="profilePhotoChange"
                    style={{ display: "none" }}
                    onChange={handleFileInputChange}
                    accept="image/png, image/gif, image/jpeg, image/jpg"
                  />
                  <Button
                    sx={profileButtonStyle}
                    onClick={() =>
                      document.getElementById("profilePhotoChange").click()
                    }
                  >
                    Change Picture
                  </Button>
                  <Button sx={profileButtonStyle} onClick={deletePicture}>
                    Delete Picture
                  </Button>
                </Box>
              )}
            </Grid>

            {!showEditPage && (
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
                    <Typography variant="h3">
                      {(userProfileData?.user?.first_name || "") +
                        " " +
                        (userProfileData?.user?.last_name || "")}
                    </Typography>
                    <Typography variant="h6">
                      Role: {userProfileData?.user?.rolename || ""}
                    </Typography>
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
                    <Button
                      sx={profileButtonStyle}
                      onClick={() => setShowEditPage(true)}
                    >
                      Edit Profile
                    </Button>
                    <Button sx={profileButtonStyle}>
                      Change Super administrator
                    </Button>
                  </Grid>
                </Grid>

                <Box display={"flex"} flexDirection={"column"} gap={"3.25rem"}>
                  <Box
                    display={"flex"}
                    gap={"1.25rem"}
                    flexDirection={"column"}
                  >
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
                      {userProfileData?.user?.phonenumber && (
                        <MicroStyledListItemComponent
                          primary="Phone Number"
                          secondary={userProfileData?.user?.phonenumber || ""}
                        />
                      )}
                      {/* {userProfileData?.user?.landline && (
                    <MicroStyledListItemComponent
                      primary="Phone Number"
                      secondary={userProfileData?.user?.landline}
                    />
                  )} */}
                      {userProfileData?.user?.email && (
                        <MicroStyledListItemComponent
                          primary="Email Address"
                          secondary={userProfileData?.user?.email || ""}
                        />
                      )}
                      {userProfileData?.company?.company_name && (
                        <MicroStyledListItemComponent
                          primary="Company Name"
                          secondary={
                            userProfileData?.company?.company_name || ""
                          }
                        />
                      )}
                    </List>
                  </Box>

                  <Box
                    display={"flex"}
                    gap={"1.25rem"}
                    flexDirection={"column"}
                  >
                    <Typography variant="h6" sx={tabStyle}>
                      Company details
                    </Typography>
                    <Box>
                      {userProfileData?.company?.company_name && (
                        <Typography
                          variant="h5"
                          sx={{
                            color: "#242424)",
                            fontSize: "1.125rem !important",
                            fontWeight: 600,
                            lineHeight: "normal",
                          }}
                        >
                          {userProfileData?.company?.company_name || ""}
                        </Typography>
                      )}
                      {userProfileData?.company?.website && (
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#242424)",
                            fontSize: "0.875rem !important",
                            fontWeight: 400,
                            lineHeight: "normal",
                          }}
                        >
                          {userProfileData?.company?.website || ""}
                        </Typography>
                      )}
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
                      {userProfileData?.company?.unit_number && (
                        <MicroStyledListItemComponent
                          primary="Unit number"
                          secondary={userProfileData?.company?.unit_number}
                        />
                      )}
                      {userProfileData?.company?.street_number && (
                        <MicroStyledListItemComponent
                          primary="Street number"
                          secondary={userProfileData?.company?.street_number}
                        />
                      )}
                      {userProfileData?.company?.street_name && (
                        <MicroStyledListItemComponent
                          primary="Street name"
                          secondary={userProfileData?.company?.street_name}
                        />
                      )}
                      {userProfileData?.company?.city && (
                        <MicroStyledListItemComponent
                          primary="City"
                          secondary={userProfileData?.company?.city}
                        />
                      )}
                      {userProfileData?.company?.state && (
                        <MicroStyledListItemComponent
                          primary="Province/State"
                          secondary={userProfileData?.company?.state}
                        />
                      )}
                      {userProfileData?.company?.country && (
                        <MicroStyledListItemComponent
                          primary="Country"
                          secondary={userProfileData?.company?.country}
                        />
                      )}
                      {userProfileData?.company?.postal_code && (
                        <MicroStyledListItemComponent
                          primary="Zip code/Postal code"
                          secondary={userProfileData?.company?.postal_code}
                        />
                      )}
                    </List>
                  </Box>

                  {/* <Box display={"flex"} gap={"1.25rem"} flexDirection={"column"}>
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
                      primary="Company name"
                      secondary="Role"
                      primaryTypographyProps={otherInfoHeaderStyle}
                      secondaryTypographyProps={otherInfoHeaderStyle}
                    />
                  </ListItem>

                  <ListItem
                    disablePadding
                    sx={{ flexDirection: "column", alignItems: "flex-start" }}
                  >
                    <ListItemText
                      sx={{ display: "flex", gap: "2.5rem", margin: 0 }}
                      primary="testing technologies pvt ltd"
                      secondary="hsiuh iuhuw duoicjnwd"
                      primaryTypographyProps={otherInfoStyleContentStyle}
                      secondaryTypographyProps={otherInfoStyleContentStyle}
                    />
                    <ListItemText
                      sx={{ display: "flex", gap: "2.5rem", margin: 0 }}
                      primary="test"
                      secondary="super-admin super duper"
                      primaryTypographyProps={otherInfoStyleContentStyle}
                      secondaryTypographyProps={roleInfoStyleContentStyle}
                    />
                  </ListItem>
                </List>
              </Box> */}
                </Box>
              </Grid>
            )}
          </Grid>

          {showEditPage && (
            <EditProfileComponent
              tabStyle={tabStyle}
              initialValues={initialValues}
              handleSubmit={handleSubmit}
            />
          )}
        </Container>
      ) : (
        <Loader sectionLoader={true} minHeight={"50vh"} />
      )}
    </>
  );
};

export default ProfilePage;
