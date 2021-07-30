/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState } from "react";
import "firebase/auth";
import "firebase/firestore";
import { useFirebaseApp } from "reactfire";
import { useHistory, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import logo from "../../assets/logo.png";

import "./registerNormal.css";
import Waves from "../waves/waves";

const RegisterNormal = () => {
  const firebase = useFirebaseApp();
  const history = useHistory();
  const db = firebase.firestore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rfc, setRfc] = useState("");
  const submit = async () => {
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          const id = res.user.uid;
          console.log(id);
          try {
            db.collection("users")
              .add({
                uid: id,
                fullname: name,
                email,
                rfc,
                token: "",
                onboarding: false,
                documents: [],
              })
              .then(() => {
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    fullName: name,
                    email,
                    rfc,
                    token: "",
                    onboarding: false,
                    documents: [],
                  })
                );
                history.push("/dashboard");
              });
          } catch (e) {
            toast(e);
          }
        });
    } catch (e) {
      toast(e);
    }
  };
  return (
    <div className="center">
      <header>
        <Link to="./login">
          <img src={logo} alt="logo" className="logoNav" />
        </Link>
      </header>
      <ToastContainer />
      <div className="container max400 pt40 pt0-sm">
        <div>
          <h2 className="regText">
            <b>Regístrate</b>
          </h2>
          <p className="expText">Ingresa tus datos</p>
        </div>
        <div className="formGroup">
          <label htmlFor="email" className="block pb4">
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            className="inputStyle"
            onChange={(event) => setName(event.target.value)}
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
        <button type="button" className="initBt" onClick={submit}>
          Registrarse
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
