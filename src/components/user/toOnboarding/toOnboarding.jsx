/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";

import logo from "../../assets/logo.png";
import "./toOnboarding.css";

const ToOnBoarding = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const { state } = location;
    if (state.reload === true) {
      console.log("toReload");
      history.replace({ pathname: "/toOnboarding", state: {} });
      window.location.reload();
    } else {
      console.log("not reload");
    }
  }, [history, location]);

  return (
    <div className="center">
      <img src={logo} alt="logo" className="logo" />
      <h1 className="noText">No estás registrado</h1>
      <p className="wtext">
        Tu rostro aun
        <b>no se encuentra</b>
        en la base de datos, o tu fotografía
        <b>es muy borrosa.</b>
      </p>
      <Link to="/onboard">
        <button className="logBt" type="button">
          Iniciar registro
        </button>
      </Link>
      <p>también puedes intentarlo de nuevo</p>
      <button onClick={() => history.goBack()} className="logBt" type="button">
        Intentar de nuevo
      </button>
    </div>
  );
};

export default ToOnBoarding;
