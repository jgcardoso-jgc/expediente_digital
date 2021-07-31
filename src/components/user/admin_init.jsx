/* eslint-disable quotes */
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "react-jss";
import Theme from "./resources/theme";
import Routes from "./routes";
import "./index.css";

const AdminInit = () => (
  <ThemeProvider theme={Theme}>
    <Router>
      <Routes />
    </Router>
  </ThemeProvider>
);

export default AdminInit;
