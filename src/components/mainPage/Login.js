import React, { useEffect } from "react";
import logo from "../../assets/logo.png";
import { useHistory } from "react-router-dom";
import Div100vh from "react-div-100vh";
import "./login.css";

function Login() {
  const history = useHistory();

  function toFaceMatch() {
    const user = localStorage.getItem("user");
    if (user) {
      history.push("/dashboard");
    } else {
      history.push("/hello");
    }
  }

  function toOnboarding() {
    const user = localStorage.getItem("user");
    if (user) {
      history.push("/dashboard");
    } else {
      history.push("/onboard");
    }
  }

  useEffect(() => {});
  return (
    <Div100vh>
      <div className="mainDiv">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="segTitle">Seguridata</h1>
        <div className="row">
          <div className="col w50">
            <div className="first">
              <h2 className="title">Regístrate</h2>
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
              <h2 className="title">Accede ahora</h2>
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
        <section>
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
          <div className="wave wave4"></div>
        </section>
      </div>
    </Div100vh>
  );
}
export default Login;
