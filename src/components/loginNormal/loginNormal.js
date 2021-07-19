import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import "firebase/auth";
import { useFirebaseApp } from "reactfire";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./loginNormal.css";

const LoginNormal = (props) => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    if (state.reload === true) {
      console.log("toReload");
      history.replace({ pathname: "/loginNormal", state: {} });
      window.location.reload();
    } else {
      console.log("not reload");
    }
  }, [history, location]);

  const firebase = useFirebaseApp();
  //const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className="center">
      <header>
        <img src={logo} alt="logo" className="logoNav" />
      </header>
      <div className="container">
        <div>
          <h1>
            <b>Login</b>
          </h1>
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
          <label htmlFor="password" className="block pb10">
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
      </div>
    </div>
  );
};
export default LoginNormal;
