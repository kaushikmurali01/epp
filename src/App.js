import logo from "./logo.svg";
import { createTheme, colors, ThemeProvider } from "@mui/material";
import "./App.css";
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header />
      </div>
    </ThemeProvider>
  );
}

export default App;
