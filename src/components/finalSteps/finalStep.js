import React from "react";
import "./finalStep.css";
import { Link } from "react-router-dom";

function FinalStep() {
  return (
    <div className="center">
      <h1>Felicidades</h1>
      <p>Enrolamiento concluido</p>
      <Link to="/login">
        <button className="inicioBt">Regresar al Inicio</button>
      </Link>
    </div>
  );
}
export default FinalStep;
