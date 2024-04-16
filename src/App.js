import React from "react";
import { Provider } from "react-redux";
import ActionComponent from "./pages/SimplePage";
// import "./App.css";
import "./assets/styles/styles.scss";
import configureStore from "./redux/store";
import { ThemeProvider } from "@mui/material";
import theme from "./styles/theme";
import Header from "./components/Header";
import Login from "./pages/Onboarding/Login";
import Signup from "./pages/Onboarding/Signup";


const store = configureStore();

const App = (props) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Header />
        {/* <ActionComponent /> */}
        {/* <Login /> */}
        {/* <Signup /> */}
      </ThemeProvider>
    </Provider>
  );
};

export default App;
