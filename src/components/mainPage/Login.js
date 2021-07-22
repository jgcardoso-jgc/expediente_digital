import React from "react";
import { useHistory } from "react-router-dom";
import Div100vh from "react-div-100vh";
import NavBarMainPage from "../navBarMainPage/navBarMainPage";
import "./login.css";
import Waves from "../waves/waves";

function Login() {
  const history = useHistory();

  function toFaceMatch() {
    const user = localStorage.getItem("user");
    if (user) {
      history.push("/dashboard");
    } else {
      history.push("/loginNormal");
    }
  }

  function toOnboarding() {
    const user = localStorage.getItem("user");
    if (user) {
      history.push("/dashboard");
    } else {
      history.push("/registerNormal");
    }
  }
  return (
    <Div100vh>
      <NavBarMainPage className="navmain" />
      <div className="mainDiv">
        <h1 className="segTitle">
          <b>Seguridata</b> | Expediente
        </h1>
        <div className="row">
          <div className="col w50">
            <div className="first">
              <h3 className="title">Regístrate</h3>
              <p className="text">
                Se te solicitará un medio de identificación y se almacenará tu
                rostro.
              </p>
              <button
                onClick={() => toOnboarding()}
                className="logBt"
                type="button"
              >
                Registrarse
              </button>
            </div>
          </div>
          <div className="col w50">
            <div className="second">
              <h3 className="title">Accede ahora</h3>
              <p className="text">
                Si ya te has registrado previamente, puedes acceder con tu
                rostro.
              </p>
              <button
                onClick={() => toFaceMatch()}
                className="logBt"
                type="button"
              >
                Acceder
              </button>
            </div>
          </div>
        </div>
        <Waves />
      </div>
    </Div100vh>
  );
}
export default Login;
