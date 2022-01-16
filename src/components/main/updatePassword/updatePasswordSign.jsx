/* eslint-disable react/prop-types */
/* eslint-disable comma-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import "firebase/auth";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { createUseStyles, useTheme } from "react-jss";
import Container from "react-bootstrap/Container";
import loadingGif from "../../../assets/loading.gif";
import "react-toastify/dist/ReactToastify.css";
import NavBarMainPage from "../navBarMainPage/navBarMainPage";
import waves from "../../../assets/waves.svg";
import UpdatePasswordController from "../../shared/updatePassword/updatePasswordController";

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

const UpdatePasswordSign = () => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [disable, setDisable] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordSign, setPasswordSign] = useState("");
  const [passwordOld, setPasswordOld] = useState("");
  const [loading, setLoading] = useState(false);
  const updateController = new UpdatePasswordController();

  async function updateUserPassword() {
    setDisable(true);
    setLoading(true);
    const user = {
      email, password: passwordOld
    };
    const success = await updateController.updatePassword(user, passwordSign);
    console.log('success', success);

    if (success) {
      toast('Cambio de contraseña exitoso');
    }
    setDisable(false);
    setLoading(false);
  }

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        updateUserPassword();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [email, passwordOld, passwordSign]);

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
                <b>Termino de registro</b>
              </h2>
              <p className="expText">Accede con tu contraseña de Sign</p>
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
              <label htmlFor="passwordOld" className="block pb10 pt20">
                Contraseña que te envíamos por correo
              </label>
              <input
                type="password"
                id="passwordOld"
                className={classes.inputStyle}
                onChange={(event) => setPasswordOld(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="passwordSign" className="block pb10 pt20">
                Contraseña de acceso a Sign
              </label>
              <input
                type="password"
                id="passwordSign"
                className={classes.inputStyle}
                onChange={(event) => setPasswordSign(event.target.value)}
              />
            </div>
            <button
              type="button"
              className={classes.loginBt}
              disabled={disable}
              onClick={() => updateUserPassword()}
            >
              Cambiar Contraseña
            </button>
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
export default UpdatePasswordSign;
