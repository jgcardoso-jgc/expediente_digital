/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
/* eslint-disable quotes */
import React, { useState } from "react";
import "firebase/auth";
import { Link } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import { ToastContainer, toast } from "react-toastify";
import { createUseStyles, useTheme } from "react-jss";
import "react-toastify/dist/ReactToastify.css";
import Container from "react-bootstrap/Container";
import NavBarMainPage from "../navBarMainPage/navBarMainPage";
import Waves from "../waves/waves";

const useStyles = createUseStyles(() => ({
  logoNav: { width: "45px", height: "45px", paddingTop: "10px" },
  containerLogin: {
    maxWidth: "400px",
    paddingTop: "60px",
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
  },
  expText: { marginTop: "4px" },
  pt20: { paddingTop: "20px" },
  pb10: { paddingBottom: "10px" },
  mb4: { marginBottom: "4px" },
  pt14: { paddingTop: "14px" },
  qa: { marginTop: "0", marginBottom: "4px", fontSize: "15px" },
  right: { textAlign: "right" },
  pt10: { paddingTop: "10px" },
  dBlock: { display: "block" },
  center: { textAlign: "center" },
  initBt: {
    backgroundColor: "rgb(75, 75, 75)",
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
  "@media (max-width: 420px)": { w50: { minWidth: "100%" } },
  "@media (min-width: 768px)": { segTitle: { paddingTop: "30vh" } },
}));

const LoginNormal = () => {
  const firebase = useFirebaseApp();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [disable, setDisable] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = async () => {
    try {
      setDisable(true);
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      toast(e.message);
      setDisable(false);
    }
  };
  return (
    <div className={classes.center}>
      <NavBarMainPage />
      <ToastContainer />
      <Container className={classes.containerLogin}>
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
            className={classes.inputStyle}
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
            className={classes.inputStyle}
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
        <Link
          style={{ display: "block", marginTop: "14px" }}
          to="./registerNormal"
        >
          <p className={(classes.qa, classes.right)}>
            ¿Aun no tienes una cuenta?
          </p>
        </Link>
        <Link style={{ display: "block" }} to="./recoverPassword">
          <p className={(classes.qa, classes.right)}>
            ¿Olvidaste tu contraseña?
          </p>
        </Link>
      </Container>
      <Waves />
    </div>
  );
};
export default LoginNormal;
