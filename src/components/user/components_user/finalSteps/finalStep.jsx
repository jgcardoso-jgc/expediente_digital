/* eslint-disable quotes */
import React from "react";
import "./finalStep.css";

function FinalStep() {
  return (
    <div className="center">
      <h1>Felicidades</h1>
      <p>Enrolamiento concluido</p>
      <button
        type="button"
        onClick={() => window.location.reload(true)}
        className="inicioBt"
      >
        Ir a mis documentos
      </button>
    </div>
  );
}
export default FinalStep;
