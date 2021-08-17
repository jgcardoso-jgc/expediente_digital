/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import "firebase/auth";
import { Link } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import { ToastContainer, toast } from "react-toastify";
import { createUseStyles, useTheme } from "react-jss";
import "react-toastify/dist/ReactToastify.css";
import Container from "react-bootstrap/Container";
import NavBarMainPage from "../navBarMainPage/navBarMainPage";
import styles from "../../../resources/theme";
import Waves from "../waves/waves";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  logoNav: { width: "45px", height: "45px", paddingTop: "10px" },
  containerLogin: {
    maxWidth: "400px",
    paddingTop: "60px",
    textAlign: "left",
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
  },
  tright: {
    textAlign: "right",
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
  "@media (max-width: 420px)": { w50: { minWidth: "100%" } },
  "@media (min-width: 768px)": { segTitle: { paddingTop: "30vh" } },
}));

const LoginNormal = () => {
  const firebase = useFirebaseApp();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const global = globalTheme({ theme });
  const [disable, setDisable] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    try {
      console.log(`email:${email}`);
      if (email !== "" && password !== "") {
        setDisable(true);
        await firebase.auth().signInWithEmailAndPassword(email, password);
      }
    } catch (e) {
      toast(e.message);
      setDisable(false);
    }
  }

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        submit();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [email, password]);
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
          className={global.initBt}
          disabled={disable}
          onClick={() => submit()}
        >
          Iniciar Sesión
        </button>
        <div className={classes.tright}>
          <Link
            style={{ display: "inline-block", marginTop: "14px" }}
            to="./registerNormal"
          >
            <p className={(classes.qa, classes.right)}>
              ¿Aun no tienes una cuenta?
            </p>
          </Link>
        </div>
        <div className={classes.tright}>
          <Link style={{ display: "inline-block" }} to="./recoverPassword">
            <p className={(classes.qa, classes.right)}>
              ¿Olvidaste tu contraseña?
            </p>
          </Link>
        </div>
      </Container>
      <Waves />
    </div>
  );
};
export default LoginNormal;
