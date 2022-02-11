/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import { createUseStyles } from "react-jss";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import SegurisignController from "./controller/segurisign_controller";
import SegurisignDocuments from "./SegurisignDocuments/SegurisignDocuments";
import CustomToasts from "../../user/components_user/Toasts/CustomToasts";
import locked from "../../../assets/locked.png";
import styles from "../../../resources/theme";
import loading from "../../../assets/loading.gif";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  sigCanvas: { backgroundColor: "white", border: "2px solid black" },
  sigNewDoc: {
    backgroundColor: "white",
    width: "fit-content",
    alignContent: "center",
  },
  centered: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  registerLink: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  btnSeguridata: {
    backgroundColor: "#83bb04",
    color: "white",
    height: "1.8rem",
    boxShadow:
      "0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    width: "50%",
    border: "none",
    borderRadius: "0.25rem",
  },
  btnSeguridataLg: {
    backgroundColor: "#83bb04",
    color: "white",
    boxShadow:
      "0 4px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    border: "none",
    padding: "0.5rem",
    borderRadius: "0.25rem",
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
    marginBottom: 16,
    background: "transparent",
  },
  card: {
    backgroundColor: "#f5f5f5",
    border: `1px solid #f5f5f5`,
    borderRadius: 10,
    height: "100%",
    padding: 20,
    marginLeft: "auto",
    marginRight: "auto",
  },
  inner: { width: "80%", margin: "0 auto", marginTop: "3rem" },
  accordionButton: {
    "&:focus": {
      borderColor: "#83bb04 !important",
      boxShadow: "none !important",
    },
    "&not(.collapsed)": {
      backgroundColor: "white !important",
      color: "#83bb04 !important",
    },
  },
  center: {
    textAlign: "center",
  },
  imgLoading: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  inputPasswordSign: {
    padding: "0.3rem",
    borderRadius: "0.2rem",
    height: "2rem",
  },
  inputEmailFirmante: {
    "&:focus": {
      borderColor: "#88be0f !important",
      borderStyle: "solid",
      borderWidth: "0.01rem",
    },
    width: "18rem",
    display: "block",
    height: "2.5rem",
    borderRadius: "0.3rem",
    borderStyle: "solid",
    boxShadow:
      "0 2px 6px 0 rgba(0, 0, 0, 0.2), 0 9px 22px 0 rgba(0, 0, 0, 0.19)",
    padding: "1rem",
  },
  reactPdfPageCanvas: {
    margin: "0 auto",
    width: "30% !important",
    height: "90% !important",
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  btnSeguridataUpload: {
    backgroundColor: "white",
    borderColor: "#88be0f",
    borderWidth: "0.09rem",
    borderRadius: "1rem",
    padding: "0.9rem",
    boxShadow:
      "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 4px 10px 0 rgba(0, 0, 0, 0.19)",
  },
  passTxt: {
    marginBottom: 16,
  },
  inputCancel: {
    width: "20rem",
    height: "15rem",
    padding: "1rem",
    margin: "2rem",
    borderRadius: "0.3rem",
  },
  btnDelSigner: {
    "&:hover": { color: "#88be0f" },
    backgroundColor: "transparent",
    border: "none",
  },
  btnDropdown: { color: "white" },
  progressBar: {
    marginLeft: "2rem",
    marginRight: "2rem",
    width: "100%",
    backgroundColor: "#80808047 !important",
  },
  lockedImg: {
    height: 90,
    width: 180,
    display: "block",
    marginRight: "auto",
    marginLeft: "auto",
    marginBottom: 30,
  },
}));

const seguriSignController = new SegurisignController();

const Segurisign = () => {
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const cookie = localStorage.getItem("sign-user");
  const toaster = new CustomToasts();
  const [logged, setLogged] = useState(false);
  const global = globalTheme();
  const [load, setLoading] = useState(true);
  const classes = useStyles();

  const signIn = (e) => {
    setLoading(true);
    e.preventDefault();
    seguriSignController
      .loginUser(emailRef.current.value, passwordRef.current.value)
      .then((value) => {
        const responseJSON = JSON.stringify(
          seguriSignController.segurisignUser
        );
        console.log(responseJSON);
        if (responseJSON.token === null) {
          toaster.errorToast("No estás registrado en Segurisign.");
          setLogged(false);
          setLoading(false);
        } else {
          setLogged(value);
          localStorage.setItem(
            "sign-user",
            JSON.stringify(seguriSignController.segurisignUser)
          );
        }
      })
      .catch((error) => {
        toaster.errorToast(error);
        setLogged(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (cookie) {
      seguriSignController.segurisignUser = JSON.parse(cookie);
      setLogged(true);
    }
    setLoading(false);
  }, []);

  return (
    <div>
      <ToastContainer />
      <div>
        {load ? (
          <div className={classes.center}>
            <img className={classes.imgLoading} alt="load" src={loading} />
          </div>
        ) : (
          ""
        )}
        {logged ? (
          <SegurisignDocuments seguriSignController={seguriSignController} />
        ) : (
          <Card className={classes.card} style={{ width: "20rem" }}>
            <img src={locked} className={classes.lockedImg} alt="locked" />
            <h5 className={classes.passTxt}>
              <b>Ingresa tus datos</b>
            </h5>
            <Card.Text>
              <div>
                <input
                  className={classes.inputStyle}
                  ref={emailRef}
                  type="email"
                  placeholder="Correo electrónico"
                />

                <input
                  className={classes.inputStyle}
                  ref={passwordRef}
                  type="password"
                  placeholder="Contraseña"
                />
              </div>
            </Card.Text>
            <button type="button" className={global.initBt} onClick={signIn}>
              Entrar
            </button>
            <Link to="/registerSign" className={classes.registerLink}>
              ¿Aun no estás registrado?
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Segurisign;
