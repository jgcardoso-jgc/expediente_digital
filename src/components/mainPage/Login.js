import React, { Component } from "react";
import logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";
import "./login.css";

class Login extends Component {
  render() {
    return (
      <div className="mainDiv">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="segTitle">Seguridata</h1>
        <div className="first">
          <h2 className="title">Regístrate</h2>
          <p className="text">
            Si ya te has registrado previamente, puedes acceder con tu rostro.
          </p>
          <Link to="/hello">
            {" "}
            <button className="logBt" type="button">
              Registrarse
            </button>
          </Link>
        </div>
        <div className="second">
          <h2 className="title">Accede ahora</h2>
          <p className="text">
            Se te solicitará un medio de identificación y se almacenará tu
            rostro.
          </p>
          <Link to="/hello">
            {" "}
            <button className="logBt" type="button">
              Acceder
            </button>
          </Link>
        </div>
      </div>
    );
  }
}
export default Login;
