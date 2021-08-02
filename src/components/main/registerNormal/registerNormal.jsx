/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState } from "react";
import "firebase/auth";
import "firebase/firestore";
import { useFirebaseApp } from "reactfire";
import { useHistory, Link } from "react-router-dom";
import { createUseStyles, useTheme } from "react-jss";
import { ToastContainer, toast } from "react-toastify";
import NavBarMainPage from "../navBarMainPage/navBarMainPage";
import styles from "../../../resources/theme";
import "react-toastify/dist/ReactToastify.css";
import Waves from "../waves/waves";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  ".block": { display: "block" },
  ".logoNav": { width: "45px", height: "45px", paddingTop: "10px" },
  ".container": {
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
  },
  ".regText": { marginBottom: "4px" },
  ".expText": { marginTop: "4px" },
  ".pb4": { paddingBottom: "4px" },
  ".pt20": { paddingTop: "20px" },
  ".pb10": { paddingBottom: "10px" },
  ".initBt": {
    backgroundColor: "rgb(0, 0, 0)",
    color: "white",
    border: "1px solid black",
    display: "block",
    marginLeft: "auto",
    minWidth: "150px",
    paddingTop: "10px",
    marginTop: "20px",
    paddingBottom: "10px",
    fontSize: "15px",
    borderRadius: "10px",
  },
}));

const RegisterNormal = () => {
  const firebase = useFirebaseApp();
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const global = globalTheme({ theme });
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
      <NavBarMainPage />
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
            className={classes.inputStyle}
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
            className={classes.inputStyle}
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
            className={classes.inputStyle}
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
            className={classes.inputStyle}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="button" className={global.initBt} onClick={submit}>
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
