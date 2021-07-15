import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./toOnboarding.css";
import { useHistory } from "react-router-dom";

function ToOnBoarding() {
  const history = useHistory();
  function goBack() {
    history.goBack();
  }
  return (
    <div className="center">
      <img src={logo} alt="logo" className="logo" />
      <h1 className="noText">No estás registrado</h1>
      <p className="wtext">
        Tu rostro aun <b>no se encuentra</b> en la base de datos, o tu
        fotografía <b>es muy borrosa</b>.
      </p>
      <Link to="/onboard">
        <button className="logBt" type="button">
          Iniciar registro
        </button>
      </Link>
      <p>también puedes intentarlo de nuevo</p>
      <button onClick={() => goBack()} className="logBt" type="button">
        Intentar de nuevo
      </button>
    </div>
  );
}

export default ToOnBoarding;
