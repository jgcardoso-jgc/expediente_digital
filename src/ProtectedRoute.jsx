/* eslint-disable quotes */
import React from "react";
import { Redirect } from "react-router-dom";

const ProtectedRoute = (props) => {
  const Component = props;
  const isAuthenticated = true;
  return isAuthenticated ? (
    <Component />
  ) : (
    <Redirect to={{ pathname: "/login" }} />
  );
};

export default ProtectedRoute;
