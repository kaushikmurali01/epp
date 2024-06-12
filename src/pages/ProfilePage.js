import React, { useEffect, useMemo, useState } from "react";
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
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MicroStyledListItemComponent from "components/ProfilePageComponents/MicroStyledComponent";
import { GET_REQUEST, PUT_REQUEST } from "utils/HTTPRequests";
import InputField from "components/FormBuilder/InputField";
import { Form, Formik } from "formik";
import ButtonWrapper from "components/FormBuilder/Button";
import { USER_MANAGEMENT, fileUploadEndPoints } from "constants/apiEndPoints";
import { POST_REQUEST } from "utils/HTTPRequests";
import EditProfileComponent from "components/ProfilePageComponents/EditProfileComponent";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { fetchUserDetails } from "../redux/superAdmin/actions/facilityActions";
import EvModal from "utils/modal/EvModal";
import NotificationsToast from "utils/notification/NotificationsToast";
import SelectBox from "components/FormBuilder/Select";
import { requestToJoinCompanyFormValidationSchema, updateProfilePageRoleSchema } from "utils/validations/formValidation";

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
  const [getUsersList, setUsersList] = useState([]);
  const dispatch = useDispatch();
  const [showEditPage, setShowEditPage] = useState(false);
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState("");
  const userData= useSelector(
    (state) => state?.facilityReducer?.userDetails || {}
  );

  const userDetails = userData?.user || {};
  const userPermissions = userData?.permissions || {};

  const [profilePicture, setProfilePicture] = useState("");


  const [modalConfig, setModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: true,
      modalClass: "",
      headerTextStyle: { color: 'rgba(84, 88, 90, 1)' },
      headerSubTextStyle: { marginTop: '1rem' },
      fotterActionStyle: {justifyContent: "center", gap: '1rem'},
      modalBodyContentStyle: {minHeight: '110px', minWidth: {xs: '100%', sm: '500px'}, display: 'flex',flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', color: 'dark.light'}
    },
    headerText: "",
    headerSubText: '',
  });



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

  const getAvailableUserData = useMemo(() => {
    return {getUsersList, userData };
  }, [getUsersList,userData]);

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
    rolename: "",
    type: ""
  });
  

  const [userProfileData, setUserProfileData] = useState();

  const UpdateRolePermissionForm = ({userInfo}) => {
        console.log(userInfo, "role check")

    const updateRoleInitialValues = {
      selectUser: '',
    };


    const handelReloadPage = () => {
      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
      setTimeout(() => {
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
        window.location.reload()
      }, 1000);
     
    }

    const formSubmit = (formData) => {
      // dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
      
      const selectedUser = formData.selectUser.toString() || '';
      const companyId = userInfo.userData?.company?.id || '';

      const apiURL = USER_MANAGEMENT.UPDATE_SUPER_ADMIN_PERMISSIONS+"/"+companyId+"/"+selectedUser;
      // const apiURL = "https://enervauser.azurewebsites.net/api"+USER_MANAGEMENT.UPDATE_SUPER_ADMIN_PERMISSIONS+"/"+companyId+"/"+selectedUser;
    
     

      console.log(apiURL,"check api url");

      setModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalUI: {
          ...prevState.modalUI,
          crossIcon: true,
          headerSubTextStyle: {...prevState.modalUI.headerSubTextStyle, textAlign: 'center' },
          fotterActionStyle: { justifyContent: "center", gap: "1rem" },
        },
        buttonsUI: {
          ...prevState.buttonsUI,
          saveButton: true,
          cancelButton: false,
          cancelButtonStyle: {
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.main" },
            color: "#fff",
          },
          saveButtonName: "Okay",
      },
      headerText: "",
      headerSubText: '',
      modalBodyContent:  <Typography variant="h5"> Role has been updated successfully. </Typography>,
      saveButtonAction: () =>  handelReloadPage(), 
      }));
      return;

      POST_REQUEST(apiURL)
        .then((response) => {

          console.log(response, 'success');
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: true,
            modalUI: {
              ...prevState.modalUI,
              crossIcon: true,
              headerSubTextStyle: {...prevState.modalUI.headerSubTextStyle, textAlign: 'center' },
              fotterActionStyle: { justifyContent: "center", gap: "1rem" },
            },
            buttonsUI: {
              ...prevState.buttonsUI,
              saveButton: true,
              cancelButton: false,
              cancelButtonStyle: {
                backgroundColor: "primary.main",
                "&:hover": { backgroundColor: "primary.main" },
                color: "#fff",
              },
              saveButtonName: "Okay",
          },
          headerText: "",
          headerSubText: '',
          modalBodyContent:  <Typography variant="h5"> Role has been updated successfully. </Typography>,
          saveButtonAction: () =>  handelReloadPage(), 
          }));
          dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });

        })
        .catch((error) => {
          console.log(error, 'error')
          NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
          dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });

        })

    }
    return (
      <Formik
        initialValues={{
          ...updateRoleInitialValues
        }}
        validationSchema={updateProfilePageRoleSchema}
        onSubmit={formSubmit}
      >
        <Form style={{width: '100%'}}>
       
          <Stack sx={{ marginBottom: '1rem' }}>
            <SelectBox name="selectUser" label="Select User" options={userInfo.getUsersList} valueKey="id" labelKey="fullName" />
          </Stack>



          {/* <SelectBox /> */}
          <Grid display="flex" sx={{ marginTop: '1.5rem' }}>
            <ButtonWrapper type="submit" variant="contained"  >
              Submit
            </ButtonWrapper>

          </Grid>
        </Form>
      </Formik>
    )
  }

  const handelChangeUserRolePermissions = ()=> {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      buttonsUI: {
        ...prevState.buttonsUI,
        saveButton: false,
        cancelButton: false,
    },
    headerText: "Change super administrator",
    headerSubText: '',
      modalBodyContent: <UpdateRolePermissionForm userInfo={getAvailableUserData} /> 

    }));

  }

  const handelChangeUserRoleConfirmation = (role) => { 
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,    
      buttonsUI: {
        ...prevState.buttonsUI,
        saveButton: true,
        cancelButton: true,
        saveButtonName: "Yes,Change",
        cancelButtonName: "Cancel",
        successButtonStyle: {backgroundColor: 'primary.main',"&:hover": {backgroundColor: 'primary.mainDarkShade'}, color: '#fff'},
        cancelButtonStyle: {backgroundColor: 'danger.main',"&:hover": {backgroundColor: 'danger.colorCrimson'}, color: '#fff'},
        saveButtonClass: "",
        cancelButtonClass: ""
    },
      headerText: '',
      modalBodyContent: 'Are you sure you want to change your role from Super Admin?',  

      saveButtonAction: () =>  handelChangeUserRolePermissions(), 
    }));
  }

  const getUserListData = () => {
    const companyId = userData?.company?.id;
    if(companyId){
      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
      // const apiURL = "https://enervauser.azurewebsites.net/api/getcompanyuser"+"/"+companyId;
      const apiURL = USER_MANAGEMENT.GET_AVAILABLE_USERS_FOR_PERMISSIONS+"/"+companyId;
      GET_REQUEST(apiURL)
        .then((res) => {
          console.log(res, 'res')
          const getUsers = res.data?.data;
          const getUpdatedUsersData = getUsers.map(({ User }) => 
          ({
            ...User,
            fullName: `${User.first_name} ${User.last_name}`
          })
        );
          setUsersList(getUpdatedUsersData)
          dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
        }).catch((error) => {
          console.log(error)
          dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
        });
    }
  }

  useEffect(() => {
    console.log('adadadadad', userData)
    setProfilePicture(
      userData?.user?.profile_pic ||
        "/images/landingPage/generic_profile.png"
    );
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        first_name: userData?.user?.first_name || "",
        last_name: userData?.user?.last_name || "",
        phonenumber: userData?.user?.phonenumber || "",
        email: userData?.user?.email || "",
        company_name: userData?.company?.company_name || "",
        website: userData?.company?.website || "",
        unit_number: userData?.company?.unit_number || "",
        street_number: userData?.company?.street_number || "",
        street_name: userData?.company?.street_name || "",
        city: userData?.company?.city || "",
        province: userData?.company?.state || "",
        country: userData?.company?.country || "",
        postal_code: userData?.company?.postal_code || "",
        rolename: userData?.user?.rolename || "",
        type: userData?.user?.type || "",
      };
    });
    setUserProfileData(userData);
    console.log(userData?.user?.id, "userData?.user?.id")
   
  }, [userData]);

  const getUserProfileData = () => {
    dispatch({ type: "SHOW_LOADER", payload: true });
    const company_id = localStorage.getItem("selectedCompanyId") || 0
    const apiURL = `/enerva-user/v1/user/${company_id}`;
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
    // getUserProfileData();
    
    dispatch(fetchUserDetails(localStorage.getItem('selectedCompanyId')))
      getUserListData();
    
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
      company: null
    };

    //check if role is super-admin
    if (
      isCompanyProfileViewPermission
    ) {
      body.company = {
        company_name: newValues.company_name,
        website: newValues.website,
        city: newValues.city,
        state: newValues.state,
        postal_code: newValues.postal_code,
        company_id: userProfileData?.user?.company_id,
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

  // type 2 is for customer
  const isCompanyProfileViewPermission = (userProfileData?.user?.type == 2 && userProfileData?.user.rolename == "SuperAdmin") || ((userProfileData?.permissions?.some(obj => obj["permission"] == "edit-profile")))

  console.log(userPermissions, userData,getUsersList, "check all permissions")
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
                    <Button sx={profileButtonStyle}
                    // onClick={() => navigate('/change-password')}
                    >Change Password</Button>
                    <Button
                      sx={profileButtonStyle}
                      onClick={() => setShowEditPage(true)}
                    >
                      Edit Profile
                    </Button>
                   {userProfileData?.user?.rolename == "Super-Admin" ? <Button sx={profileButtonStyle} onClick={()=> handelChangeUserRoleConfirmation()}>
                      Change Super administrator
                    </Button> : null}
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

                  {isCompanyProfileViewPermission ? <Box
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
                  </Box> : null}

                  {userProfileData?.user?.type == 2 && userProfileData?.associatedCompanies?.length && userProfileData?.associatedCompanies.filter((item) => item.id != userProfileData?.user?.company_id).length ? <Box display={"flex"} gap={"1.25rem"} flexDirection={"column"}>
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
                        {userProfileData?.associatedCompanies?.length && userProfileData?.associatedCompanies.filter((item) => item.id != userProfileData?.user?.company_id).map(item => (
                          <ListItemText
                            sx={{ display: "flex", gap: "2.5rem", margin: 0 }}
                            primary={item?.company_name}
                            secondary={item?.role_name}
                            primaryTypographyProps={otherInfoStyleContentStyle}
                            secondaryTypographyProps={otherInfoStyleContentStyle}
                          />
                        )) }
                      </ListItem>
                    </List>
                  </Box> : null}
                </Box>
              </Grid>
            )}
          </Grid>

          {showEditPage && (
            <EditProfileComponent
              tabStyle={tabStyle}
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              userProfileData={userProfileData}
            />
          )}
        </Container>
      ) : (
        <Loader sectionLoader={true} minHeight={"50vh"} />
      )}
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </>
  );
};

export default ProfilePage;
