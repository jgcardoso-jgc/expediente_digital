/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { ToastContainer, toast } from "react-toastify";
import { useFirebaseApp } from "reactfire";
import styles from "../../../../resources/theme";

function SubirDocumentos() {
  const location = useLocation();
  const globalTheme = createUseStyles(styles);
  const user = JSON.parse(localStorage.getItem("user"));
  const [file, setFile] = useState("");
  const firebase = useFirebaseApp();
  const db = firebase.storage();
  const locData = location.state.doc;
  const global = globalTheme();

  function setImage(fileSelected) {
    setFile(fileSelected);
  }

  function uploadFile() {
    db.ref("users")
      .child(`/${user.email}/test`)
      .put(file)
      .then(() => {
        console.log("uploaded");
      })
      .catch((e) => {
        toast(`Ocurrió un error.${e}`);
      });
  }

  return (
    <div>
      <ToastContainer />
      <h3>{locData}</h3>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />
      <button
        type="button"
        className={global.initBt}
        onClick={() => uploadFile()}
      >
        Subir archivo
      </button>
    </div>
  );
}

export default SubirDocumentos;
