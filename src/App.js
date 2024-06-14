import React, { Suspense, useEffect, useState } from "react";
import { Provider } from "react-redux";
import ActionComponent from "./pages/SimplePage";
import "./App.css";
import configureStore from "./redux/store";
import { ThemeProvider } from "@mui/material";
import theme from "./styles/theme";
import Header from "./components/CommonHeader/Header";
import Footer from "./components/CommonFooter/Footer";
import Login from "./pages/Onboarding/Login";
import Signup from "./pages/Onboarding/Signup";
import HomepageComponent from "./pages/Homepage/Homepage";
import LandingPage from "./pages/LandingPage";
import RoutesComp from "./routes";
import Facility from "./sections/Homepage/FacilitySection";
import FacilityDetails from "sections/Homepage/FacilityDetails";
import ParticipantAgreement from "sections/Homepage/ParticipantAgreementSection";
import TabsSection from "sections/Homepage/TabsSection";
import DashboardSection from "sections/Homepage/DashboardSection";
import Loader from "pages/Loader";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  MsalProvider,
} from "@azure/msal-react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import EvLoader from "utils/loader/EvLoader";
import axiosInstance from "utils/interceptor";
import EvModal from "utils/modal/EvModal";
import { useNavigate } from "react-router-dom";
const store = configureStore();

console.log("build updated on 5th June 7:30PM");


const App = (props) => {
  const navigate = useNavigate();
  const [modalConfig, setModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: true,
      modalClass: "",
      headerTextStyle: "",
      headerSubTextStyle: "",
      fotterActionStyle: {justifyContent: "center", gap: '1rem', padding: '1rem'},
      modalBodyContentStyle: {minHeight: '120px', minWidth: {xs: '100%', sm: '450px'}, display: 'flex',flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', color: '#242424'}
    },
    buttonsUI: {
      saveButton: true,
      cancelButton: false,
      saveButtonName: "Okay",
      cancelButtonName: "",
      successButtonStyle: {backgroundColor: '#2e813e',"&:hover": {backgroundColor: '#1e6329'}, color: '#fff'},
      cancelButtonStyle: {},
      saveButtonClass: "",
      cancelButtonClass: "",

    },
    headerText: "",
    headerSubText: '',
    modalBodyContent: "You do not have permission to access this module.",
    saveButtonAction: ()=> handelPermissionCheck(),
    closeButtonRedirect: '/facility-dashboard'

  });

  const handelPermissionCheck = ()=> {
    console.log('check permission')
    navigate('/facility-dashboard')
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
  }

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => {
        if (response.data.status === 403) {
          console.log(response, 'check api response');
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: true,
          }));
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor when the component unmounts
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Suspense fallback={<Loader fallBackLoader={true} />}>
            <MsalProvider instance={props.instance}>
              <UnauthenticatedTemplate>
                <Header />
                <LandingPage />
                <Footer />
              </UnauthenticatedTemplate>
              <AuthenticatedTemplate>
                <>
                  <RoutesComp />
                </>
              </AuthenticatedTemplate>
              <HomepageComponent />
            </MsalProvider>
          </Suspense>

          {/* <ActionComponent /> */}
          {/* <Login /> */}
          {/* {/* <Signup /> */}
          {/* <HomepageComponent /> */}
          {/* <LandingPage /> */}
          {/* <Facility /> */}
          {/* <FacilityDetails /> */}
          {/* <ParticipantAgreement /> */}
          {/* <Footer /> */}
        </LocalizationProvider>
      </ThemeProvider>

      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
      <EvLoader />
      
    </Provider>
  );
};

export default App;
