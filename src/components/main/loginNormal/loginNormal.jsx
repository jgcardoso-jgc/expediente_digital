/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
/* eslint-disable quotes */
import React, { useState } from "react";
import "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../assets/logo.png";

import "./loginNormal.css";
import Waves from "../waves/waves";

const LoginNormal = () => {
  const history = useHistory();

  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  // const user = useUser();
  const [disable, setDisable] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = async () => {
    try {
      setDisable(true);
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          console.log(`uid:${user.user.uid}`);
          const { uid } = user.user;
          const query = db.collection("users").where("uid", "==", uid);
          query.get().then((querySnapshot) => {
            querySnapshot.forEach((documentSnapshot) => {
              const data = documentSnapshot.data();
              if (data.admin) {
                localStorage.setItem("admin", true);
                history.push("/admin");
              } else {
                history.push("/dashboard");
              }
            });
          });
        });
    } catch (e) {
      toast(e.message);
      setDisable(false);
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
      <div className="container max400 pt60">
        <div>
          <h2 className="mb4">
            <b>Login</b>
          </h2>
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
        <button
          type="button"
          className="initBt"
          disabled={disable}
          onClick={submit}
        >
          Iniciar Sesión
        </button>
        <Link className="right d-block mt14" to="./registerNormal">
          <p className="qa">¿Aun no tienes una cuenta?</p>
        </Link>
        <Link className="right d-block " to="./recoverPassword">
          <p className="qa">¿Olvidaste tu contraseña?</p>
        </Link>
      </div>
      <Waves />
    </div>
  );
};
export default LoginNormal;
