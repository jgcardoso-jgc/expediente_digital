/* eslint-disable quotes */
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useWindowSize from "../../shared/hooks/useWindowSize";
import PrivateSection from "./PrivateSection";

function Routes() {
  const { pathname } = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [width, height] = useWindowSize();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <PrivateSection />;
}

export default Routes;
