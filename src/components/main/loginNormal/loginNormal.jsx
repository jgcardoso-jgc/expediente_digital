/* eslint-disable react/prop-types */
/* eslint-disable comma-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import "firebase/auth";
import { Link } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import { ToastContainer, toast } from "react-toastify";
import { createUseStyles, useTheme } from "react-jss";
import Container from "react-bootstrap/Container";
import loadingGif from "../../../assets/loading.gif";
import "react-toastify/dist/ReactToastify.css";
import NavBarMainPage from "../navBarMainPage/navBarMainPage";
import SoapController from "../../shared/seguriSign/controller/soap_controller";
import waves from "../../../assets/waves.svg";
import SegurisignController from "../../shared/seguriSign/controller/segurisign_controller";
import checkUser from "./authController";

const useStyles = createUseStyles(() => ({
  logoNav: { width: "45px", height: "45px", paddingTop: "10px" },
  containerLogin: {
    maxWidth: "400px",
    paddingTop: "60px",
    textAlign: "left",
  },
  loginBt: {
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
  inputStyle: {
    width: "100%",
    border: "1px solid #f1f1f1",
    fontSize: "16px",
    background: "#f1f1f1",
    marginTop: 8,
  },
  tright: {
    textAlign: "right",
  },
  mb20: {
    marginBottom: 20,
  },
  wave: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    position: "absolute",
    bottom: 0,
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

const LoginNormal = ({ isLogged }) => {
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [disable, setDisable] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const seguriSignController = new SegurisignController();
  const soapController = new SoapController();

  function login(uid) {
    localStorage.setItem(
      "sign-user",
      JSON.stringify(seguriSignController.segurisignUser)
    );
    checkUser(uid, db)
      .then(() => isLogged(true))
      .catch((e) => {
        console.log(`error:${e}`);
        isLogged(false);
      });
  }

  async function submit() {
    try {
      setLoading(true);
      if (email !== "" && password !== "") {
        setDisable(true);
        const credential = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        const { uid } = credential.user;
        const resultado = await soapController.loginUser(email, password);
        if (resultado instanceof Error) {
          throw resultado;
        }
        seguriSignController
          .loginUser(email, password)
          .then(() => {
            const responseJSON = JSON.stringify(
              seguriSignController.segurisignUser
            );
            // console.log(responseJSON);
            if (responseJSON.token === null) {
              toast("No estás registrado en Segurisign.");
            } else {
              login(uid);
            }
          })
          .catch((error) => {
            toast(error);
          });
        console.log(resultado);
      } else {
        setLoading(false);
      }
    } catch (e) {
      toast(e.message);
      setDisable(false);
      setLoading(false);
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
      {loading ? (
        <img src={loadingGif} className="loadgif" alt="loading..." />
      ) : (
        <div>
          <NavBarMainPage />
          <ToastContainer />
          <Container className={classes.containerLogin}>
            <div>
              <h2 className="mb4">
                <b>Login</b>
              </h2>
              <p className="expText">Accede a tu cuenta</p>
            </div>
            <div className={classes.mb20}>
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                className={classes.inputStyle}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
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
              className={classes.loginBt}
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
          <img src={waves} className={classes.wave} alt="waves" />
        </div>
      )}
    </div>
  );
};
export default LoginNormal;
