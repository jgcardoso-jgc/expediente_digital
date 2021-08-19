/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState } from "react";
import Div100vh from "react-div-100vh";
import { Link, useHistory } from "react-router-dom";
import styles from "../../../resources/theme";
import { createUseStyles } from "react-jss";
import NavBarMainPage from "../navBarMainPage/navBarMainPage";
import { useFirebaseApp } from "reactfire";
import Waves from "../waves/waves";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  navmain: { top: "0px", position: "absolute !important", width: "100%" },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
  },
  title: {
    textAlign: "left",
    marginTop: 40,
  },
  correoTxt: {
    textAlign: "left",
  },
  link: {
    textAlign: "right",
    marginTop: 10,
  },
  container: {
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    paddingLeft: "20px",
    paddingRight: "20px",
    marginTop: 100,
  },
}));

const RecoverPassword = () => {
  const firebase = useFirebaseApp();
  const classes = useStyles();
  const global = globalTheme();
  const auth = firebase.auth();
  const history = useHistory();
  const [email, setEmail] = useState("");
  // const db = firebase.firestore();
  // const [email, setEmail] = useState("");
  function recover() {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        history.push("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }
  return (
    <Div100vh>
      <NavBarMainPage className={classes.navmain} />
      <div className="center">
        <div className={classes.container}>
          <div>
            <h2 className={classes.title}>
              <b>Recupera tu contraseña</b>
            </h2>
            <p className={classes.correoTxt}>Ingresa tus datos</p>
          </div>
          <div className={classes.correoTxt}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              className={classes.inputStyle}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <button
            type="button"
            className={global.initBt}
            onClick={() => recover()}
          >
            Recuperar
          </button>
          <div className={classes.link}>
            <Link style={{ display: "inline-block" }} to="./loginNormal">
              ¿Ya tienes una cuenta?
            </Link>
          </div>
        </div>
        <Waves />
      </div>
    </Div100vh>
  );
};
export default RecoverPassword;
