/* eslint-disable quotes */
import React from "react";
import { Switch } from "react-router-dom";
import { ThemeProvider } from "react-jss";
import Theme from "../../resources/theme";
import Routes from "./routes_user";
import "./index.css";

const UserInit = () => (
  <ThemeProvider theme={Theme}>
    <Switch>
      <Routes />
    </Switch>
  </ThemeProvider>
);

export default UserInit;
