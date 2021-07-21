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
  const db = firebase.firestore();
  //const user = useUser();
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
          console.log("uid:" + user.user.uid);
          const uid = user.user.uid;
          let query = db.collection("users").where("uid", "==", uid);

          query.get().then((querySnapshot) => {
            querySnapshot.forEach((documentSnapshot) => {
              const data = documentSnapshot.data();
              const user = {
                fullName: data.fullname,
                rfc: data.rfc,
                email: data.email,
              };
              localStorage.setItem("user", JSON.stringify(user));
              history.push("/dashboard");
            });
          });
        });
    } catch (e) {
      alert(e);
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
        <button className="initBt" disabled={disable} onClick={submit}>
          Iniciar Sesión
        </button>
        <Link className="right d-block pt14" to="./registerNormal">
          <p className="qa">¿Aun no tienes una cuenta?</p>
        </Link>
        <Link className="right d-block " to="./registerNormal">
          <p className="qa">¿Olvidaste tu contraseña?</p>
        </Link>
      </div>
      <Waves />
    </div>
  );
};
export default LoginNormal;
