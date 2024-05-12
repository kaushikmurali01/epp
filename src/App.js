import React, { Suspense } from "react";
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

const store = configureStore();

const App = (props) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<Loader />}>
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
      </ThemeProvider>
      <Loader />
    </Provider>
  );
};

export default App;
