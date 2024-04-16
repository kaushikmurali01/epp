import React from "react";
import { Provider } from "react-redux";
import ActionComponent from "./pages/SimplePage";
import "./App.css";
import configureStore from "./redux/store";
import { ThemeProvider } from "@mui/material";
import theme from "./styles/theme";
import Header from "./components/CommonHeader/Header";
import Footer from "./components/CommonFooter/Footer";

const store = configureStore();
  
const App = (props) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Header />
        <Footer />
        {/* <ActionComponent /> */}
      </ThemeProvider>
    </Provider>
  );
};

export default App;
