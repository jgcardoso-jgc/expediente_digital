/* eslint-disable quotes */
import React from "react";
import { useHistory } from "react-router-dom";
import { createUseStyles } from "react-jss";
import qr from "../../../../assets/qr-code.png";

const useStyles = createUseStyles(() => ({
  title: { textAlign: "center" },
  text: { textAlign: "center" },
  titleScan: { textAlign: "center", marginBottom: "20px" },
  textContainer: {
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  inicioBt: {
    border: "1px solid black",
    backgroundColor: "black",
    color: "white",
    minWidth: "150px",
    borderRadius: "10px",
    paddingTop: "5px",
    paddingBottom: "5px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "30px",
  },
  card: {
    maxWidth: "550px",
    WebkitBoxShadow: "0px 8px 22px 9px #c7c7c7",
    boxShadow: "0px 8px 22px 9px #c7c7c7",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "20px",
  },
  qrStyle: { width: "100%", borderRadius: "40px" },
}));

function ContinuePhone() {
  const classes = useStyles();
  const history = useHistory();
  function goBack() {
    history.goBack();
  }
  return (
    <div>
      <h2 className={classes.title}>Continua en tu teléfono</h2>
      <div className={classes.textContainer}>
        <p className={classes.text}>
          El proceso de enrolamiento solo es válido mediante un dispositivo
          móvil y en posición vertical.
        </p>
      </div>
      <h3 className={classes.titleScan}>Escanea el código QR</h3>
      <div className={classes.card}>
        <img className={classes.qrStyle} src={qr} alt="qr" />
      </div>
      <button type="button" onClick={() => goBack()} className="inicioBt">
        Regresar al Inicio
      </button>
    </div>
  );
}

export default ContinuePhone;
