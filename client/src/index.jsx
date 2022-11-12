import { ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import theme from "./config/theme";
import SessionProvider from "./providers/session/provider";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider theme={theme}>
    <Router basename='/'>
      <SessionProvider>
        <App />
      </SessionProvider>
    </Router>
  </ThemeProvider>
);
