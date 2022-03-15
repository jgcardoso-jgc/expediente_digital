/* eslint-disable import/order */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState } from "react";
import styles from "../../../../resources/theme";
import { ToastContainer, toast } from "react-toastify";
import { createUseStyles } from "react-jss";
import { useFirebaseApp } from "reactfire";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  navmain: { top: "0px", position: "absolute !important", width: "100%" },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px"
  },
  title: {
    textAlign: "left",
    marginTop: 40
  },
  correoTxt: {
    textAlign: "left"
  },
  link: {
    textAlign: "right",
    marginTop: 10
  },
  container: {
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    paddingLeft: "20px",
    paddingRight: "20px",
    marginTop: 100
  }
}));

const RecoverPassword = () => {
  const firebase = useFirebaseApp();
  const classes = useStyles();
  const global = globalTheme();
  const auth = firebase.auth();
  const [email, setEmail] = useState("");

  function logOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("admin");
      });
  }

  function recover() {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        logOut();
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast(errorMessage);
        // ..
      });
  }
  return (
    <div>
      <ToastContainer />
      <div className="center">
        <div className={classes.container}>
          <div>
            <h2 className={classes.title}>
              <b>Cambia tu contraseña</b>
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
            Cambiar
          </button>
        </div>
      </div>
    </div>
  );
};
export default RecoverPassword;
