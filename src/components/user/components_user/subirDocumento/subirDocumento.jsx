/* eslint-disable operator-linebreak */
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
  const [uploaded, setUploaded] = useState(false);
  const firebase = useFirebaseApp();
  const storage = firebase.storage();
  const db = firebase.firestore();
  let locData = "";
  if (location.state != null) {
    console.log(location.state);
    locData = location.state.doc;
  }
  const global = globalTheme();

  function setImage(fileSelected) {
    setFile(fileSelected);
  }

  function uploadFile() {
    storage
      .ref("users")
      .child(`/${user.email}/${locData}`)
      .put(file)
      .then(() => {
        console.log("uploaded");
        const query = db.collection("users").where("email", "==", user.email);
        query.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const gotDoc = doc.data().documents;
            gotDoc.forEach((array, index) => {
              if (
                array.uploaded !== "undefined" &&
                array.imageName === locData
              ) {
                gotDoc[index].uploaded = true;
                db.collection("users")
                  .doc(doc.id)
                  .update({ documents: gotDoc });
              }
            });
          });
          setUploaded(true);
        });
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
      {uploaded ? <div>Archivo subido</div> : ""}
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
