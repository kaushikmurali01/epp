import React, {Suspense} from "react";
import { Provider } from "react-redux";
import ActionComponent from "./pages/SimplePage";
import "./App.css";
import "./assets/styles/styles.scss";
import configureStore from "./redux/store";
import { ThemeProvider } from "@mui/material";
import theme from "./styles/theme";
import Header from "./components/CommonHeader/Header";
import Footer from "./components/CommonFooter/Footer";
import Login from "./pages/Onboarding/Login";
import Signup from "./pages/Onboarding/Signup";
import LandingPage from "./pages/LandingPage";
import RoutesComp from './routes';

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, MsalProvider } from "@azure/msal-react";

const store = configureStore();

const App = (props) => {

  const activeAccount = props.instance.getActiveAccount();

  console.log("active account", activeAccount)
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Suspense fallback="Loading...">
          <MsalProvider instance={props.instance}>
            <UnauthenticatedTemplate>
              <Header />
                <LandingPage />
              <Footer/>

            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
              {activeAccount ? 
              <>
                  <RoutesComp />
              </>
                : null
              }
            </AuthenticatedTemplate>
          </MsalProvider>
        </Suspense>
        
        {/* <ActionComponent /> */}
        {/* <Login /> */}
        {/* <Signup /> */}
        {/* <LandingPage /> */}
        {/* <Footer /> */}
      </ThemeProvider>
    </Provider>
  );
};

export default App;
