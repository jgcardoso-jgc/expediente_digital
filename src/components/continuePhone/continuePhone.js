import "./continuePhone.css";
import qr from "../../assets/qr-code.png";
import React from "react";
import { useHistory } from "react-router-dom";

function ContinuePhone() {
  const history = useHistory();
  function goBack() {
    history.goBack();
  }
  return (
    <div>
      <h2 className="title">Continua en tu teléfono</h2>
      <div className="textContainer">
        <p className="text">
          El proceso de enrolamiento solo es válido mediante un dispositivo
          móvil y en posición vertical.
        </p>
      </div>
      <h3 className="titleScan">Escanea el código QR</h3>
      <div className="card">
        <img className="qr" src={qr} alt="qr" />
      </div>
      <button onClick={() => goBack()} className="inicioBt">
        Regresar al Inicio
      </button>
    </div>
  );
}

export default ContinuePhone;
