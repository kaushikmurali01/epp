import React from "react";
import { Provider } from "react-redux";
import ActionComponent from "./pages/SimplePage";
import "./App.css";
import configureStore from "./redux/store";
import { createTheme, ThemeProvider } from "@mui/material";
import Header from "./components/Header";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e813e",
      contrastText: "#fff",
    },
    primary_2: {
      main: "#54585a",
    },
    secondary: {
      main: "#f26d04",
    },
    text: {
      primary: "#333333",
      secondary: "#757575",
    },
  },
});

const store = configureStore();

const App = (props) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Header />
        {/* <ActionComponent /> */}
      </ThemeProvider>
    </Provider>
  );
};

export default App;
