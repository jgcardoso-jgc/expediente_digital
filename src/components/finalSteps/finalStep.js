import React from "react";
import "./finalStep.css";
import { Link } from "react-router-dom";

function FinalStep() {
  return (
    <div className="center">
      <h1>Felicidades</h1>
      <p>Enrolamiento concluido</p>
      <Link to="/documents">
        <button className="inicioBt">Ir a mis documentos</button>
      </Link>
    </div>
  );
}
export default FinalStep;
