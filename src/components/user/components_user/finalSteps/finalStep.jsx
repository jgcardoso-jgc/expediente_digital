/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./finalStep.css";

function FinalStep() {
  const [visible, setVisible] = useState(false);
  function reload() {
    setTimeout(() => {
      localStorage.setItem("reload", true);
      window.location.reload(true);
    }, 500);
  }

  useEffect(() => {
    if (localStorage.getItem("reload") === null) {
      reload();
    } else {
      setVisible(true);
    }
  }, []);
  return (
    <div className="center">
      <h1>Felicidades</h1>
      <p>Enrolamiento concluido</p>
      {visible ? (
        <Link to="/documentos">
          <button type="button" className="inicioBt">
            Ir a mis documentos
          </button>
        </Link>
      ) : (
        <p>La pagina se refrescará...</p>
      )}
    </div>
  );
}
export default FinalStep;
