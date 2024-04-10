import React from "react";
import { Provider } from "react-redux";
import ActionComponent from "./pages/SimplePage";
import "./App.css";
import configureStore from "./redux/store";

const store = configureStore();

const App = (props) => {
  return (
    <Provider store={store}>
      <ActionComponent />
    </Provider>
  );
};

export default App;
