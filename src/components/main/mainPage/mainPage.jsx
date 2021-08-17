/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import React from "react";
import Div100vh from "react-div-100vh";
import { Link } from "react-router-dom";
import { createUseStyles } from "react-jss";
import Row from "react-bootstrap/Row";
import NavBarMainPage from "../navBarMainPage/navBarMainPage";
import Waves from "../waves/waves";

const useStyles = createUseStyles(() => ({
  navmain: { top: "0px", position: "absolute !important", width: "100%" },
  AppLogo: { height: "40vmin", pointerEvents: "none" },
  "@media (min-width: 768px)": {
    row: { display: "flex" },
    logo: { marginTop: "7% !important" },
  },
  logo: { marginTop: "10%", width: "100px" },
  first: { marginBottom: "24px" },
  second: { marginBottom: "20px" },
  mainDiv: { textAlign: "center" },
  dBlock: { display: "block" },
  logBt: {
    border: "1px solid black",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    minWidth: "140px",
    paddingTop: "3px",
    paddingBottom: "3px",
    fontSize: "15px",
    borderRadius: "10px",
  },
  bgWhite: {
    backgroundColor: "#ffffff",
    color: "black",
  },
  bgBlack: {
    backgroundColor: "rgb(0, 0, 0)",
    color: "white",
  },
  rowMax400: {
    maxWidth: "440px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },

  segTitle: { paddingTop: "100px", marginBottom: "14px", textAlign: "center" },
  title: {
    textAlign: "left",
    paddingLeft: "20px",
    paddingRight: "20px",
    marginBottom: "10px",
  },
  text: {
    textAlign: "left",
    paddingLeft: "20px",
    paddingRight: "20px",
    marginTop: "10px",
    lineHeight: "22px",
  },
  AppLink: { color: "#61dafb" },
  "@media only screen and (max-width: 330px)": {
    logo: { width: "50px" },
    title: { marginTop: "10px" },
    segTitle: { marginBottom: "10px" },
  },
  "@media (min-width: 678px)": { segTitle: { paddingTop: "120px" } },
}));

function Login() {
  const classes = useStyles();

  return (
    <Div100vh>
      <NavBarMainPage className={classes.navmain} />
      <div>
        <h1 className={classes.segTitle}>
          <b>Seguridata</b> | Expediente
        </h1>
        <Row className={classes.rowMax400}>
          <div className={classes.first}>
            <h4 className={classes.title}>Regístrate</h4>
            <p className={classes.text}>
              Se te solicitará un medio de identificación y se almacenará tu
              rostro.
            </p>
            <Link to="registerNormal" type="button" className={classes.dBlock}>
              <button
                type="button"
                className={`${classes.logBt} ${classes.bgWhite}`}
              >
                Registrarse
              </button>
            </Link>
          </div>
        </Row>
        <Row className={classes.rowMax400}>
          <div className={classes.second}>
            <h4 className={classes.title}>Accede ahora</h4>
            <p className={classes.text}>
              Si ya te has registrado previamente, puedes acceder con tus
              credenciales.
            </p>
            <Link to="/loginNormal" type="button" className={classes.dBlock}>
              <button
                type="button"
                className={`${classes.logBt} ${classes.bgBlack}`}
              >
                Acceder
              </button>
            </Link>
          </div>
        </Row>
        <Waves />
      </div>
    </Div100vh>
  );
}
export default Login;
