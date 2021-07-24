/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "firebase/auth";
import "firebase/firestore";
// import { useFirebaseApp } from "reactfire";
// import { useHistory } from "react-router-dom";
import "./recoverPassword.css";
import Waves from "../waves/waves";

const RecoverPassword = () => {
  // const firebase = useFirebaseApp();
  // const history = useHistory();
  // const db = firebase.firestore();
  // const [email, setEmail] = useState("");
  const submit = async () => {
    try {
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
      <div className="container max400 pt40">
        <div>
          <h2 className="regText">
            <b>Recuperación</b>
          </h2>
          <p className="expText">Ingresa tus datos</p>
        </div>
        <div className="formGroup pt10">
          <label htmlFor="email" className="block pb4">
            Correo electrónico
          </label>
          <input type="email" id="email" className="inputStyle" />
        </div>

        <button type="button" className="initBt" onClick={submit}>
          Recuperar
        </button>
        <Link className="right d-block pt10" to="./loginNormal">
          ¿Ya tienes una cuenta?
        </Link>
      </div>
      <Waves />
    </div>
  );
};
export default RecoverPassword;
