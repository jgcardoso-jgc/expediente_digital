/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState, useRef } from "react";
import "firebase/auth";
import "firebase/firestore";
import { useHistory, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Div100vh from "react-div-100vh";
import loadingGif from "../../../../../assets/loading.gif";
import NavBarMainPage from "../../../../main/navBarMainPage/navBarMainPage";
import "react-toastify/dist/ReactToastify.css";
import Waves from "../../../../main/waves/waves";
import {
  rfcValido, passwordValida, submit, loginUser, uploadData
} from "./registerController";
import useStyles from "./registerStyles";

const RegisterNormal = () => {
  const history = useHistory();
  const classes = useStyles();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rfc, setRfc] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const rfcText = useRef<HTMLElement>();
  const passText = useRef<HTMLElement>(null);

  function navigate(jsonRegister) {
    localStorage.setItem("user", JSON.stringify(jsonRegister));
    history.push("/dashboard");
  }

  const upload = (res) => {
    uploadData(res, email, name, rfc, password).then((json) => {
      navigate(json);
    });
  };

  const login = () => {
    loginUser(email, password).then((res) => {
      upload(res);
    }).catch((e) => {
      toast(e);
    });
  };

  const submitUser = () => {
    setDisabled(true);
    setLoading(true);
    submit(email, password, name, rfc).then(() => {
      login();
    }).catch((e) => {
      toast(e);
      setLoading(false);
      setDisabled(false);
    });
  };

  function testRFC(value) {
    if (rfcText.current) {
      if (rfcValido(value)) {
        rfcText.current.innerHTML = 'Válido';
        rfcText.current.style.color = 'green';
        setRfc(value);
      } else {
        rfcText.current.innerHTML = 'No válido';
        rfcText.current.style.color = 'red';
        setRfc('');
      }
    }
  }

  function testPass(value) {
    if (passText.current) {
      if (passwordValida(value)) {
        passText.current.innerHTML = 'Contraseña válida';
        passText.current.style.color = 'green';
        setPassword(value);
      } else {
        passText.current.innerHTML = 'Contraseña no válida. Al menos una mayúscula, un número y 8 carácteres.';
        passText.current.style.color = 'red';
        setPassword('');
      }
    }
  }

  return (
    <Div100vh>
      {loading ? (
        <img src={loadingGif} className="loadgif" alt="loading..." />
      ) : (
        <div>
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
                onChange={(event) => testRFC(event.target.value)}
              />
              <p className={classes.rfcText} ref={rfcText as React.RefObject<HTMLDivElement>} />
            </div>
            <div className={`${classes.left} ${classes.pt10}`}>
              <label htmlFor="password" className="block pb10 pt4">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className={classes.inputStyle}
                onChange={(event) => testPass(event.target.value)}
              />
              <p className={classes.rfcText} ref={passText as React.RefObject<HTMLDivElement>} />
            </div>
            <button
              type="button"
              className={classes.regBt}
              disabled={disabled}
              onClick={submitUser}
            >
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
      )}
    </Div100vh>
  );
};
export default RegisterNormal;
