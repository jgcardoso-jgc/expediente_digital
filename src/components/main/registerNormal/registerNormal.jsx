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
  block: { display: "block" },
  logoNav: { width: "45px", height: "45px", paddingTop: "10px" },
  container: {
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    paddingLeft: "20px",
    paddingRight: "20px",
    marginTop: 50,
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
  },
  left: {
    textAlign: "left",
  },
  right: {
    textAlign: "right",
  },
  link: {
    display: "block",
    textAlign: "right",
    paddingTop: "10px",
    marginLeft: "auto",
  },
  pt10: {
    paddingTop: "10px",
  },
  regText: { marginBottom: "4px", paddingTop: "20px" },
  expText: { marginTop: "4px" },
  pb4: { paddingBottom: "4px" },
  pt20: { paddingTop: "20px" },
  pb10: { paddingBottom: "10px" },
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
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        const id = res.user.uid;
        console.log(id);
        const jsonRegister = {
          uid: id,
          fullname: name,
          email,
          rfc,
          token: "",
          onboarding: false,
          documents: [],
        };
        try {
          db.collection("users")
            .add(jsonRegister)
            .then(() => {
              localStorage.setItem("user", JSON.stringify(jsonRegister));
              history.push("/dashboard");
            });
        } catch (error) {
          toast(error.message);
        }
      })
      .catch((error) => {
        toast(error.message);
      });
  };
  return (
    <div className="center">
      <NavBarMainPage />
      <ToastContainer />
      <div className={classes.container}>
        <div>
          <h2 className={`${classes.regText} ${classes.left}`}>
            <b>Regístrate</b>
          </h2>
          <p className={classes.left}>
            <b>Ingresa tus datos</b>
          </p>
        </div>
        <div className={classes.left}>
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
        <div className={`${classes.left} ${classes.pt10}`}>
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
        <div className={`${classes.left} ${classes.pt10}`}>
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
        <div className={`${classes.left} ${classes.pt10}`}>
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
        <div className={classes.right}>
          <Link
            className={classes.link}
            style={{ display: "inline-block" }}
            to="./loginNormal"
          >
            ¿Ya tienes una cuenta?
          </Link>
        </div>
      </div>
      <Waves />
    </div>
  );
};
export default RegisterNormal;
