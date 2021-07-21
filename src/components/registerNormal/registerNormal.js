import React, { useState } from "react";
import logo from "../../assets/logo.png";
import "firebase/auth";
import "firebase/firestore";
import { useFirebaseApp } from "reactfire";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./registerNormal.css";
import Waves from "../waves/waves";

const RegisterNormal = (props) => {
  const firebase = useFirebaseApp();
  const history = useHistory();
  const db = firebase.firestore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rfc, setRfc] = useState("");
  const submit = async () => {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          db.settings({
            timestampsInSnapshots: true,
          });
          const userRef = db.collection("users").add({
            fullname: this.state.fullname,
            email: this.state.email,
          });
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
          <h1 className="regText">
            <b>Regístrate</b>
          </h1>
          <p className="expText">Ingresa tus datos</p>
        </div>
        <div className="formGroup">
          <label htmlFor="email" className="block pb4">
            Nombre Completo
          </label>
          <input
            type="email"
            id="email"
            className="inputStyle"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="formGroup pt10">
          <label htmlFor="email" className="block pb4">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            className="inputStyle"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="formGroup pt10">
          <label htmlFor="email" className="block pb4">
            RFC
          </label>
          <input
            type="text"
            id="rfc"
            className="inputStyle"
            onChange={(event) => setRfc(event.target.value)}
          />
        </div>
        <div className="formGroup pt10">
          <label htmlFor="password" className="block pb10 pt4">
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
        <Link className="right d-block pt10" to="./loginNormal">
          ¿Ya tienes una cuenta?
        </Link>
      </div>
      <Waves />
    </div>
  );
};
export default RegisterNormal;
