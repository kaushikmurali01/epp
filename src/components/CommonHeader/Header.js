import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import logo from "../../assets/images/logo.svg";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import { logoStyle } from "../../styles/commonStyles";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, MsalProvider } from "@azure/msal-react";
import { loginRequest } from "authConfig";
import { FormControl, FormGroup, FormLabel, Grid, Link, Modal, Select } from "@mui/material";
import { GET_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import { useEffect, useState } from "react";
import { USER_MANAGEMENT } from "constants/apiEndPoints";
import NotificationsToast from "utils/notification/NotificationsToast";
import { fetchUserDetails } from "../../redux/superAdmin/actions/facilityActions";
import { useDispatch, useSelector } from "react-redux";

const settings = ["Profile", "Logout"];

export const InvitationList = ({invitationData, acceptRejectInvite}) => {
  return (
    <Grid
      sx={{
        padding: "0.5rem",
        borderRadius: "0.5rem",
        border: "1px solid #cccccc50",
        background: "#fff",
        transition: "box-shadow 0.3s",
        ":hover": {
          boxShadow: "0 0 11px rgba(33,33,33,.2)",
        }
      }}
    >
      <Grid display="flex" justifyContent="space-between" alignItems={"center"}>
        <Box>
          <Typography variant="h6" color="rgba(84, 88, 90, 1)" fontWeight={400}>
            From company: <b>{invitationData?.company_name}</b>
          </Typography>
          <Typography variant="h6" color="rgba(84, 88, 90, 1)" fontWeight={400}>
            For role: <b>{invitationData?.role}</b>
          </Typography>
          <Typography variant="h6" color="rgba(84, 88, 90, 1)" fontWeight={400}>
            Invitation date: <b>{invitationData?.createdAt}</b>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button onClick={() => acceptRejectInvite(invitationData?.user_id, invitationData?.role_id, invitationData?.company_id, invitationData.email, "accept")}>Accept</Button>
          <Button sx={{ color: "danger.main" }} onClick={() => acceptRejectInvite(invitationData?.user_id, invitationData?.role_id, invitationData?.company_id, invitationData.email, "reject")}>Reject</Button>
        </Box>
      </Grid>
    </Grid>
  );
};

function Header(props) {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  
  const [open, setOpen] = React.useState(false);
  const { instance } = useMsal();
  const [showInvitationPopup, setInvitationPopUp] = useState(false);
  
  const onClose = () => {
    setInvitationPopUp(false);
  };

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userData= useSelector(
    (state) => state?.facilityReducer?.userDetails || {}
  );

  const userDetails = userData?.user || {};
  const userPermissions = userData?.permissions || {};

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleRedirect=()=>{
    console.log('redirecting',)
    instance.loginRedirect({
      ...loginRequest,
      // prompt: 'create'
    }).catch((error)=> console.log("error in login redirect", error))
  }

  const scrollToSection = (event, sectionId) => {
    event.preventDefault()
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };


  const clickSetting =(setting) => {
    if(setting == 'Logout'){
      //logout from the application with msal instance
      localStorage.clear()
      instance.logoutRedirect()
    }
    else if(setting == 'Profile'){
      navigate("/profile")
    }
  }

  const [companyList, setCompanyList] = useState([]);
  const [selectCompany, setSelectCompany] = useState("");

  const getCompanyListData = () => {
    const apiURL = USER_MANAGEMENT.GET_LIST_OF_COMPANIES_BY_USER;
    GET_REQUEST(apiURL)
      .then((res) => {
        setCompanyList(res?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  useEffect(() => {
    if(props.page == "authenticated" && localStorage.getItem("accessToken")){
      getCompanyListData();
    }
  }, [props.page, localStorage.getItem("accessToken"), userDetails?.company_id]);

  const handleSelectChange = (event) => {
    const selectedCompanyId = event.target.value;
    setSelectCompany(selectedCompanyId);

    // Store the selected company ID
    localStorage.setItem("selectedCompanyId", selectedCompanyId);
    dispatch(fetchUserDetails(selectedCompanyId))
    window.location.reload();
  };

  // const userData = localStorage.getItem("userDetails") && JSON.parse(localStorage.getItem("userDetails"));

  // Get the selected company ID
  const newlySelectedCompany = localStorage.getItem("selectedCompanyId");

  useEffect(() => {
    if (newlySelectedCompany) {
      setSelectCompany(newlySelectedCompany);
    } else {
      setSelectCompany(userDetails?.company_id);
    };
  }, [userDetails]);

  const acceptRejectInvite = (user_id, role_id, company_id, email, type) =>{
    const apiURL = USER_MANAGEMENT.ACCEPT_REJECT_INVITE;
    const body = {
      user_id: user_id,
      role_id: role_id,
      company_id: company_id,
      type: type,
      email: email
    }
    POST_REQUEST(apiURL, body)
      .then((res) => {
        if(type == 'accept' && res.status == 200) {
          NotificationsToast({ message: "You have successfully accepted the invite!", type: "success" });
          getCompanyListData();
        } else if(type == 'reject' && res.statusCode == 200){
          NotificationsToast({ message: "You have rejected the invitation!", type: "warning" });
        }
        dispatch(fetchUserDetails(selectCompany));
        setInvitationPopUp(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        boxShadow: "0 0 8px #f1f1f1",
        bgcolor: "white",
        backgroundImage: "none",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            backdropFilter: "blur(24px)",
            maxHeight: 40,
            borderColor: "divider",
            px: { xs: "0" },
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              // ml: "-18px",
              px: 0,
            }}
          >
            <img src={logo} style={logoStyle} alt="logo" />
            {!(props.page == "authenticated") && (
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  flexGrow: 1,

                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MenuItem
                  onClick={(event) => scrollToSection(event, "howItWorksSection")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography
                    variant="body2"
                    component="a"
                    href="#"
                    sx={{ textDecoration: "none" }}
                    color="dark.light"
                  >
                    How it works
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={(event) => scrollToSection(event, "userStorySection")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography
                    variant="body2"
                    component="a"
                    href="#"
                    sx={{ textDecoration: "none" }}
                    color="dark.light"
                  >
                    Success stories
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={(event) => scrollToSection(event, "whatsNewSection")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography
                    variant="body2"
                    component="a"
                    href="#"
                    sx={{ textDecoration: "none" }}
                    color="dark.light"
                  >
                    What's new
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={(event) => scrollToSection(event, "contactUsFormSection")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography
                    variant="body2"
                    component="a"
                    href="#"
                    sx={{ textDecoration: "none" }}
                    color="dark.light"
                  >
                    Contact us
                  </Typography>
                </MenuItem>
              </Box>
            )}
          </Box>
          {props.page == "authenticated" ? (
            <Box
              sx={{
                flexGrow: 0,
                display: { xs: "none", md: "flex" },
                gap: "1.5rem",
                alignItems: "flex-end",
              }}
            >
              <Grid item sx={{ webkitTransform: 'translateY(-50%)', msTransform: 'translateY(-50%)', transform: 'translateY(-50%)'}}>
                <Typography variant='small' sx={{ color: 'blue.main', cursor: 'pointer' }} >
                  Request to join other company
                </Typography>
              </Grid>
              <Button
                onClick={() => setInvitationPopUp(true)}
                sx={{ minWidth: "auto !important", padding: "0 !important" }}
              >
                <img
                  src="/images/icons/invitation.svg"
                  alt="invitation"
                  style={{ maxWidth: "70%" }}
                />
              </Button>
              {(companyList?.length > 0 && companyList[0] != null && (userData?.user?.type != 3 || userData?.user?.type != 1 || userData?.user?.type != 5) ) && (
              <FormGroup className="theme-form-group">
                <FormLabel
                  sx={{
                    marginBottom: "0.25rem",
                    fontSize: "0.75rem !important",
                    lineHeight: "1 !important",
                    fontWeight: "400",
                  }}
                >
                  Choose company
                </FormLabel>
                <FormControl sx={{ minWidth: "10rem" }}>
                  <Select
                    value={selectCompany}
                    onChange={(e) => handleSelectChange(e)}
                    displayEmpty={true}
                    sx={{
                      padding: 0,
                      fontWeight: 600,
                      background: "#F3FFF6",
                      maxHeight: "2.25rem",
                    }}
                  >
                    {companyList.map((item) => {
                      return (
                        <MenuItem key={item?.id} value={item?.id}>
                          {item?.company_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </FormGroup>
              )}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={userDetails?.first_name + " " + userDetails?.last_name}
                    src={userDetails?.profile_pic || "static/"}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => clickSetting(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : null}
          {!(props.page == "authenticated") && (
            <>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: "1.5rem",
                  alignItems: "center",
                }}
              >
                {/* <Button
                  color="primary"
                  variant="outlined"
                  component="a"
                  onClick={handleRedirect}
                >
                  Login
                </Button> */}
                <Button
                  color="primary"
                  variant="contained"
                  component="a"
                  onClick={handleRedirect}
                >
                  Login/Sign up
                </Button>
              </Box>
              <Box sx={{ display: { sm: "", md: "none" } }}>
                <Button
                  variant="text"
                  color="primary"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{
                    minWidth: { xs: "fit-content", md: "30px" },
                    p: "4px",
                    justifyContent: "flex-end",
                  }}
                >
                  <MenuIcon
                    sx={{
                      color: "#fff",
                      bgcolor: "primary.main",
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "0.875rem",
                      padding: "0.25rem",
                    }}
                  />
                </Button>
                <Drawer
                  anchor="right"
                  open={open}
                  onClose={toggleDrawer(false)}
                >
                  <Box
                    sx={{
                      minWidth: "60dvw",
                      p: 2,
                      backgroundColor: "background.paper",
                      flexGrow: 1,
                    }}
                  >
                    <MenuItem
                      onClick={(event) => scrollToSection(event, "howItWorksSection")}
                    >
                      How it works
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => scrollToSection(event, "userStorySection")}
                    >
                      Success stories
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => scrollToSection(event, "whatsNewSection")}
                    >
                      What's new
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => scrollToSection(event, "contactUsFormSection")}
                    >
                      Contact us
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="outlined"
                        component="a"
                        onClick={handleRedirect}
                        sx={{ width: "100%" }}
                      >
                        Login/Sign up
                      </Button>
                    </MenuItem>
                    {/* <MenuItem>
                      <Button
                        color="primary"
                        variant="contained"
                        component="a"
                        sx={{ width: "100%" }}
                        onClick={handleRedirect}
                      >
                        Sign up
                      </Button>
                    </MenuItem> */}
                  </Box>
                </Drawer>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
      <Modal
        open={showInvitationPopup}
        onClose={onClose}
        aria-labelledby="invitation-modal"
        aria-describedby="invitation-modal"
        disableAutoFocus
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "500px", md: "45rem" },
            borderRadius: "2rem",
            bgcolor: "#fff",
            p: 4,
            maxHeight: "70svh",
            overflow: "auto",
            display: "grid",
            gap: "1.5rem",
            "::-webkit-scrollbar": {
              width: "5px",
            },
            "::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: "#348D3D60",
              borderRadius: "1.375rem",
              "&:hover": {
                backgroundColor: "#348D3D",
              },
            },
            "&:hover ::-webkit-scrollbar": {
              display: "block",
            },
          }}
          className={"modal-size"}
        >
          {/* Loop over the following list to show the list */}
          {userData?.invitations?.length ? userData.invitations.map((item) => (
            <InvitationList
              invitationData={item}
              acceptRejectInvite={acceptRejectInvite}
          />
          )) : 
          <Typography>
            No invitations found!
          </Typography>
          }
        </Box>
      </Modal>
    </AppBar>
  );
}

export default Header;
