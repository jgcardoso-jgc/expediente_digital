/* eslint-disable quotes */
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import PrivateSection from "./PrivateSection";

function Routes() {
  const { pathname } = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [width, height] = useWindowSize();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // const isUserLoggedIn = true;
  // return isUserLoggedIn ? <PrivateSection /> : <PublicRoutes />;
  return <PrivateSection />;
}

export default Routes;
