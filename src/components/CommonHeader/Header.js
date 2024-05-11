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
import { Link } from "@mui/material";

const settings = ["Profile", "Logout"];

function Header(props) {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const {instance} = useMsal();

  const [anchorElUser, setAnchorElUser] = React.useState(null);

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

  const scrollToSection = (sectionId) => {
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
      instance.logoutRedirect()
    }
    else if(setting == 'Profile'){
      navigate("/admin/profile")
    }
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
                  onClick={() => scrollToSection("howItWorksSection")}
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
                  onClick={() => scrollToSection("userStorySection")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography
                    variant="body2"
                    component="a"
                    href="#"
                    sx={{ textDecoration: "none" }}
                    color="dark.light"
                  >
                    Succes stories
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection("whatsNewSection")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography
                    variant="body2"
                    component="a"
                    href="#"
                    sx={{ textDecoration: "none" }}
                    color="dark.light"
                  >
                    What's New
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection("contactUsFormSection")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography
                    variant="body2"
                    component="a"
                    href="#"
                    sx={{ textDecoration: "none" }}
                    color="dark.light"
                  >
                    Contact Us
                  </Typography>
                </MenuItem>
              </Box>
            )}
          </Box>
          {(props.page == "authenticated") ? <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" }, gap: '1.5rem', alignItems: "center", }} >
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Ben Martin" src="/static/images/avatar/23.jpg" />
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
          </Box> : null}
          {!(props.page == "authenticated") && (
            <>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: '1.5rem',
                  alignItems: "center",
                }}
              >
                <Button
                  color="primary"
                  variant="outlined"
                  component="a"
                  onClick={handleRedirect}
                >
                  Login
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  component="a"
                  onClick={handleRedirect}
                >
                  Sign up
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
                    <MenuItem onClick={() => scrollToSection("howItWorksSection")}>
                      How it works
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection("userStorySection")} >
                        Succes stories
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection("whatsNewSection")}>
                       What's New
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection("contactUsFormSection")}>
                      Contact Us
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
                        Sign in
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="contained"
                        component="a"
                        sx={{ width: "100%" }}
                        onClick={handleRedirect}
                      >
                        Sign up
                      </Button>
                    </MenuItem>
                  </Box>
                </Drawer>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
