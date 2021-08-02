/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import React from "react";
import { useHistory } from "react-router-dom";
import Div100vh from "react-div-100vh";
import { createUseStyles, useTheme } from "react-jss";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavBarMainPage from "../navBarMainPage/navBarMainPage";
import Waves from "../waves/waves";

const useStyles = createUseStyles(() => ({
  navmain: { top: "0px", position: "absolute !important", width: "100%" },
  AppLogo: { height: "40vmin", pointerEvents: "none" },
  "@media (min-width: 768px)": {
    row: { display: "flex" },
    w50: { minWidth: "50%" },
    logo: { marginTop: "7% !important" },
  },
  logo: { marginTop: "10%", width: "100px" },
  first: { marginBottom: "24px" },
  second: { marginBottom: "20px" },
  mainDiv: { textAlign: "center" },
  logBt: {
    backgroundColor: "rgb(0, 0, 0)",
    color: "white",
    border: "1px solid black",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    minWidth: "180px",
    paddingTop: "10px",
    paddingBottom: "10px",
    fontSize: "15px",
    borderRadius: "10px",
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
  const theme = useTheme();
  const classes = useStyles({ theme });
  const history = useHistory();

  function toFaceMatch() {
    const user = localStorage.getItem("user");
    if (user) {
      history.push("/dashboard");
    } else {
      history.push("/loginNormal");
    }
  }

  function toOnboarding() {
    const user = localStorage.getItem("user");
    if (user) {
      history.push("/dashboard");
    } else {
      history.push("/registerNormal");
    }
  }
  return (
    <Div100vh>
      <NavBarMainPage className={classes.navmain} />
      <div>
        <h1 className={classes.segTitle}>
          <b>Seguridata</b> | Expediente
        </h1>
        <Row>
          <Col>
            <div className={classes.first}>
              <h3 className={classes.title}>Regístrate</h3>
              <p className={classes.text}>
                Se te solicitará un medio de identificación y se almacenará tu
                rostro.
              </p>
              <button
                onClick={() => toOnboarding()}
                className={classes.logBt}
                type="button"
              >
                Registrarse
              </button>
            </div>
          </Col>
          <Col>
            <div className={classes.second}>
              <h3 className={classes.title}>Accede ahora</h3>
              <p className={classes.text}>
                Si ya te has registrado previamente, puedes acceder con tu
                rostro.
              </p>
              <button
                onClick={() => toFaceMatch()}
                className={classes.logBt}
                type="button"
              >
                Acceder
              </button>
            </div>
          </Col>
        </Row>
        <Waves />
      </div>
    </Div100vh>
  );
}
export default Login;
