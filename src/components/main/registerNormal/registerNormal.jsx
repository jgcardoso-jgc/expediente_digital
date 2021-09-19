/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState, useRef } from "react";
import "firebase/auth";
import "firebase/firestore";
import { useFirebaseApp } from "reactfire";
import { useHistory, Link } from "react-router-dom";
import { createUseStyles, useTheme } from "react-jss";
import { ToastContainer, toast } from "react-toastify";
import Div100vh from "react-div-100vh";
import NavBarMainPage from "../navBarMainPage/navBarMainPage";
import "react-toastify/dist/ReactToastify.css";
import Waves from "../waves/waves";

const useStyles = createUseStyles(() => ({
  block: { display: "block" },
  navmain: { top: "0px", position: "absolute !important", width: "100%" },
  logoNav: { width: "45px", height: "45px", paddingTop: "10px" },
  container: {
    maxWidth: 400,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: 50,
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
  },
  rfcText: {
    marginBottom: 0,
  },
  left: {
    textAlign: "left",
  },
  right: {
    textAlign: "right",
  },
  regBt: {
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
  const db = firebase.firestore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rfc, setRfc] = useState("");
  const rfcText = useRef();
  const passText = useRef();

  function rfcValido(rfcPassed) {
    const rfcpm =
      "^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";
    // patron del RFC, persona fisica
    const rfcpf =
      "^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";

    if (rfcPassed.match(rfcpm) || rfcPassed.match(rfcpf)) {
      rfcText.current.innerHTML = "Válido";
      rfcText.current.style.color = "green";
      setRfc(rfcPassed);
      return true;
    }
    rfcText.current.innerHTML = "No válido";
    rfcText.current.style.color = "red";
    setRfc("");
    return false;
  }

  function checkForm() {
    if (rfc !== "" && password !== "") {
      return true;
    }
    return false;
  }

  function passwordValida(pass) {
    const regexPass = new RegExp(
      "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
    );
    if (regexPass.test(pass)) {
      passText.current.innerHTML = "Contraseña válida";
      passText.current.style.color = "green";
      setPassword(pass);
      return true;
    }
    passText.current.innerHTML =
      "Contraseña no válida. Al menos una mayúscula, un número y 8 carácteres.";
    passText.current.style.color = "red";
    setPassword("");
    return false;
  }

  function navigate(jsonRegister) {
    localStorage.setItem("user", JSON.stringify(jsonRegister));
    history.push("/dashboard");
  }

  function uploadData(res) {
    if (checkForm()) {
      const id = res.user.uid;
      const jsonRegister = {
        uid: id,
        fullname: name,
        email,
        rfc,
        token: "",
        onboarding: false,
        cargo: "",
        docsAdmin: [],
        documents: [],
      };
      try {
        db.collection("users")
          .add(jsonRegister)
          .then(() => navigate(jsonRegister));
      } catch (error) {
        toast(error.message);
      }
    }
  }

  const submit = async () => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => uploadData(res))
      .catch((error) => {
        toast(error.message);
      });
  };
  return (
    <Div100vh>
      <NavBarMainPage className={classes.navmain} />
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
            onChange={(event) => rfcValido(event.target.value)}
          />
          <p className={classes.rfcText} ref={rfcText} />
        </div>
        <div className={`${classes.left} ${classes.pt10}`}>
          <label htmlFor="password" className="block pb10 pt4">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className={classes.inputStyle}
            onChange={(event) => passwordValida(event.target.value)}
          />
          <p className={classes.rfcText} ref={passText} />
        </div>
        <button type="button" className={classes.regBt} onClick={submit}>
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
    </Div100vh>
  );
};
export default RegisterNormal;
