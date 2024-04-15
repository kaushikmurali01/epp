import logo from "./logo.svg";
import { createTheme, colors, ThemeProvider } from "@mui/material";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
      primary: "#2e813e",
      secondary: "#757575",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header />
        <h1>isahskajk</h1>
        <h1>isahskajk</h1>

        <h1>isahskajk</h1>

        <h1>isahskajk</h1>

        <h1>isahskajk</h1>

        <h1>isahskajk</h1>

        <h1>isahskajk</h1>
        <h1>isahskajk</h1>
        <h1>isahskajk</h1>
        <h1>isahskajk</h1>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
