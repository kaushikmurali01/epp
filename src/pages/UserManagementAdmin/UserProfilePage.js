import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  FormGroup,
  Checkbox,
  FormLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MicroStyledListItemComponent from "components/ProfilePageComponents/MicroStyledComponent";
import { DELETE_REQUEST, GET_REQUEST, PUT_REQUEST } from "utils/HTTPRequests";

import { ENERVA_USER_MANAGEMENT, USER_MANAGEMENT, fileUploadEndPoints } from "constants/apiEndPoints";
import { POST_REQUEST } from "utils/HTTPRequests";
import EditProfileComponent from "components/ProfilePageComponents/EditProfileComponent";
import { useDispatch } from "react-redux";
import Loader from "../Loader";
import NotificationsToast from "utils/notification/NotificationsToast";
import UserManagePermissions from "./UserManagePermissions";
import EvModal from "utils/modal/EvModal";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const getUseLocation = useLocation();
  const { companyId, userId } = useParams();
  const dispatch = useDispatch();
  const [profilePicture, setProfilePicture] = useState("");
  const [userProfileData, setUserProfileData] = useState();
  const [isVisibleInvitePage, setVisibleInvitePage] = useState(false);
const [getCompanyList, setCompanyList] = useState([]);
  const [getUserRole, setUserRole] = useState([]);
  const [invitePageInfo, setInvitePageInfo] = useState({});
  const [selectTableRow, setSelectTableRow] = useState({});
  const [inviteAPIURL, setInviteAPIURL] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: true,
      modalClass: "",
      headerTextStyle: { color: 'rgba(84, 88, 90, 1)' },
      headerSubTextStyle: { marginTop: '1rem', color: 'rgba(36, 36, 36, 1)', fontSize: { md: '0.875rem' }, },
      fotterActionStyle: {justifyContent: "center", gap: '1rem'},
      modalBodyContentStyle: ''
    },
    buttonsUI: {
      saveButton: true,
      cancelButton: true,
      saveButtonClass: "",
      cancelButtonClass: "",
      successButtonStyle: {backgroundColor: 'danger.scarlet',"&:hover": {backgroundColor: 'danger.colorCrimson'}, color: '#fff'},
      cancelButtonStyle: {backgroundColor: 'primary.main',"&:hover": {backgroundColor: 'primary.mainDarkShade'}, color: '#fff'},
      saveButtonName: "Delete",
      cancelButtonName: "Cancel",  

    },
    headerText: "",
    headerSubText: "",
    modalBodyContent: "",
  });

  const profileButtonStyle = {
    color: "primary.main",
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

  const handelManagePermissions = () => {
    const apiURL = ENERVA_USER_MANAGEMENT.EDIT_EV_INVITATION_BY_ADMIN;
    const profileData = {
      company_id:companyId,
      id: userId,
      user_type_id: userProfileData?.user.type,
      ...userProfileData?.user
    }
    // setInviteAPIURL(apiURL)
    // setVisibleInvitePage(true);
    // setSelectTableRow(profileData)
    // setInvitePageInfo({title:'Manage Customer User and permissions', type: "2" })
    

    // navigate('/user-management/manage-access')
    // Set a value in session storage
    const data = {
      pageInfo: { title: 'Manage Customer User and permissions' },
      isEdited: true,
      selectTableRow: profileData,
      returnPageURL: getUseLocation.pathname
    }
    // set state on session storage
    // sessionStorage.setItem('enervaAdminManageAccess', data);
    navigate('/user-management/manage-access',{state: data})

  }

  const DeleteModelContent = () => {
    return (
        <Grid container alignItems='center' flexDirection="column" textAlign='center' >
            <Grid item sx={{textAlign:'center'}}>
                <figure>
                    <img src="/images/icons/deleteIcon.svg" alt="" />
                </figure>
            </Grid>
            <Grid item>
                <Typography variant="h4">
                    Are you sure you would like to delete the user?
                </Typography>
            </Grid>
            <Grid item>
                <FormGroup sx={{display: 'block',}}>
                 <Checkbox id="receiveCopy" onChange={(e)=> setIsChecked(e.target.checked) } />
                <FormLabel htmlFor="receiveCopy">Check if you want to receive a copy of the delete confirmation email</FormLabel>
                </FormGroup>
            </Grid>
        </Grid>
    )
}

const handelDeleteModalOpen = () => {
    setModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        buttonsUI: {
            ...prevState.buttonsUI,
            saveButton: true,
            cancelButton: true,
        },
        modalBodyContent: <DeleteModelContent />,
        saveButtonAction: () =>  handelDelete(),
    }));
   
}


  const backToUserManagement = () => {
    navigate('/user-management')
  };
  const handelDelete = () => {
    const apiURL = ENERVA_USER_MANAGEMENT.DELETE_ENERVA_USER_REQUEST + '/' + userProfileData?.user.id + '/' + userProfileData?.user.entry_type + '/' + userProfileData?.companyDetail?.id;
      // const apiURL = ENERVA_USER_MANAGEMENT.DELETE_ENERVA_USER_REQUEST + '/' + item.id + '/' + item.entry_type + '/' + item.company_id;
      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
      // console.log(apiURL, "apiURL")
      // return;
      DELETE_REQUEST(apiURL)
      .then((response) => {
        if(response.data.status === 409) {
          NotificationsToast({ message: response.data.body, type: "error" });
          setModalConfig((prevState) => ({
              ...prevState,
              modalVisible: false,
          }));
        } else {
          NotificationsToast({ message: "The user has been deleted successfully.", type: "success" });
          backToUserManagement();

            setModalConfig((prevState) => ({
              ...prevState,
              modalVisible: false,
          }));
        }

        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
       
      })
      .catch((error) => {
        console.log(error, 'error')
        NotificationsToast({ message: error?.message ? error.message : 'Something went wrong!', type: "error" });
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      })
  }

  const getUserRoleData = () => {
    const apiURL = USER_MANAGEMENT.GET_USER_ROLE+"/2"
    GET_REQUEST(apiURL)
      .then((res) => {
        setUserRole(res.data?.body)
      }).catch((error) => {
        console.log(error)
      });
  }

  const getComapanyListData = () => {
    const apiURL = USER_MANAGEMENT.GET_COMPANY_LIST + "/" + "0/100";
    GET_REQUEST(apiURL)
      .then((res) => {
        setCompanyList(res.data?.data?.rows);
      }).catch((error) => {
        console.log(error)
      });
  }

  const getUserProfileData = () => {
    dispatch({ type: "SHOW_LOADER", payload: true });
    const apiURL = `${ENERVA_USER_MANAGEMENT.VIEW_USER_PROFILE}/${companyId}/${userId} `;
    GET_REQUEST(apiURL)
      .then((res) => {
        setUserProfileData(res?.data);
        setProfilePicture(
          res?.data?.user?.profile_pic || "/images/landingPage/generic_profile.png"
        );

        dispatch({ type: "SHOW_LOADER", payload: false });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserProfileData();
    getUserRoleData();
    getComapanyListData()
  }, []);


  return (
    <>
      {userProfileData ? (
        <React.Fragment>
          {isVisibleInvitePage ?
            <UserManagePermissions
              getUserRole={getUserRole}
              setVisibleInvitePage={setVisibleInvitePage}
              isVisibleInvitePage={isVisibleInvitePage}
              invitePageInfo={invitePageInfo}
              selectTableRow={selectTableRow}
              inviteAPIURL={inviteAPIURL}
              getCompanyList={getCompanyList}
            />
            :
            <Container sx={{ position: "relative" }}>
              <Grid container sx={{ marginBottom: '1rem' }}>
                <Grid item xs={12}>
                  <IconButton
                    onClick={() => backToUserManagement()}
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
                  Back to User Management

                </Grid>
              </Grid>

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
                {userProfileData?.user &&
                  <Grid
                    container
                    item
                    sx={{
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

                  </Grid>
                }


                <Grid container item sx={{ flex: "1", gap: "1.5rem" }}>
                  {userProfileData?.user &&
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
                        <Button sx={{ ...profileButtonStyle, color: 'danger.main' }} onClick={() => handelDeleteModalOpen()}>Delete</Button>
                        <Button
                          sx={profileButtonStyle}
                          onClick={()=> handelManagePermissions()}
                        >
                          Manage Permission
                        </Button>

                      </Grid>
                    </Grid>
                  }
                  <Box display={"flex"} flexDirection={"column"} gap={"3.25rem"}>
                    {userProfileData?.user &&
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
                          {userProfileData?.companyDetail?.company_name && (
                            <MicroStyledListItemComponent
                              primary="Company Name"
                              secondary={
                                userProfileData?.companyDetail?.company_name || ""
                              }
                            />
                          )}
                        </List>
                      </Box>
                    }
                    {userProfileData?.companyDetail &&
                      <Box
                        display={"flex"}
                        gap={"1.25rem"}
                        flexDirection={"column"}
                      >
                        <Typography variant="h6" sx={tabStyle}>
                          Company details
                        </Typography>
                        <Box>
                          {userProfileData?.companyDetail?.company_name && (
                            <Typography
                              variant="h5"
                              sx={{
                                color: "#242424)",
                                fontSize: "1.125rem !important",
                                fontWeight: 600,
                                lineHeight: "normal",
                              }}
                            >
                              {userProfileData?.companyDetail?.company_name || ""}
                            </Typography>
                          )}
                          {userProfileData?.companyDetail?.website && (
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#242424)",
                                fontSize: "0.875rem !important",
                                fontWeight: 400,
                                lineHeight: "normal",
                              }}
                            >
                              {userProfileData?.companyDetail?.website || ""}
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
                          {userProfileData?.companyDetail?.unit_number && (
                            <MicroStyledListItemComponent
                              primary="Unit number"
                              secondary={userProfileData?.companyDetail?.unit_number}
                            />
                          )}
                          {userProfileData?.companyDetail?.street_number && (
                            <MicroStyledListItemComponent
                              primary="Street number"
                              secondary={userProfileData?.companyDetail?.street_number}
                            />
                          )}
                          {userProfileData?.companyDetail?.street_name && (
                            <MicroStyledListItemComponent
                              primary="Street name"
                              secondary={userProfileData?.companyDetail?.street_name}
                            />
                          )}
                          {userProfileData?.companyDetail?.city && (
                            <MicroStyledListItemComponent
                              primary="City"
                              secondary={userProfileData?.companyDetail?.city}
                            />
                          )}
                          {userProfileData?.companyDetail?.state && (
                            <MicroStyledListItemComponent
                              primary="Province/State"
                              secondary={userProfileData?.companyDetail?.state}
                            />
                          )}
                          {userProfileData?.companyDetail?.country && (
                            <MicroStyledListItemComponent
                              primary="Country"
                              secondary={userProfileData?.companyDetail?.country}
                            />
                          )}
                          {userProfileData?.companyDetail?.postal_code && (
                            <MicroStyledListItemComponent
                              primary="Zip code/Postal code"
                              secondary={userProfileData?.companyDetail?.postal_code}
                            />
                          )}
                        </List>
                      </Box>
                    }
                    {userProfileData?.associatedCompanies &&
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
                            {userProfileData?.associatedCompanies.map((item) => {
                              return (
                                <ListItemText
                                  sx={{ display: "flex", gap: "2.5rem", margin: 0 }}
                                  primary={item?.company_name}
                                  secondary={item?.role_name}
                                  primaryTypographyProps={otherInfoStyleContentStyle}
                                  secondaryTypographyProps={roleInfoStyleContentStyle}
                                  key={item?.id}
                                />
                              )
                            })

                            }

                          </ListItem>
                        </List>
                      </Box>
                    }
                  </Box>

                  {((userProfileData?.user === undefined || userProfileData?.user === null) && (userProfileData?.companyDetail === undefined || userProfileData?.companyDetail === null) && (userProfileData?.associatedCompanies === undefined || userProfileData?.associatedCompanies === null)) &&
                    <Grid container justifyContent='center' sx={{ width: '100%' }}>
                      <Grid item>
                        <p>No user information available.</p>
                      </Grid>
                    </Grid>
                  }

                </Grid>

              </Grid>

            </Container>
          }
        </React.Fragment>

      ) : (
        <Loader sectionLoader={true} minHeight={"50vh"} />
      )}
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </>
  );
};

export default UserProfilePage;
