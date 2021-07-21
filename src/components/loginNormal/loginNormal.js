import React, { useState } from "react";
import logo from "../../assets/logo.png";
import "firebase/auth";
import { Link } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import { useHistory } from "react-router-dom";
import "./loginNormal.css";
import Waves from "../waves/waves";

const LoginNormal = (props) => {
  const history = useHistory();

  const firebase = useFirebaseApp();
  //const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = async () => {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          history.push("/dashboard");
        });
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className="center">
      <header>
        <Link to="./login">
          <img src={logo} alt="logo" className="logoNav" />
        </Link>
      </header>
      <div className="container">
        <div>
          <h1 className="mb4">
            <b>Login</b>
          </h1>
          <p className="expText">Accede a tu expediente</p>
        </div>
        <div className="formGroup">
          <label htmlFor="email" className="block pb10">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            className="inputStyle"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password" className="block pb10 pt20">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="inputStyle"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button className="initBt" onClick={submit}>
          Iniciar Sesión
        </button>
        <Link className="right d-block pt10" to="./registerNormal">
          ¿Aun no tienes una cuenta?
        </Link>
      </div>
      <Waves />
    </div>
  );
};
export default LoginNormal;
