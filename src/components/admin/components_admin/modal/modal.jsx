/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { createUseStyles } from "react-jss";
import { useFirebaseApp } from "reactfire";

const useStyles = createUseStyles({
  aprobarBt: {
    background: "green",
    border: 0
  },
  rechazarBt: {
    background: "red",
    marginLeft: "10px",
    border: 0
  }
});

const ModalEdit = ({ state, onClose, url, title, type, imageName, email }) => {
  const classes = useStyles();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const storage = firebase.storage();
  const [cancelDocBt, setDocBt] = useState(false);

  if (!state) {
    return null;
  }

  function download(urlDownload) {
    const a = document.createElement("a");
    a.href = urlDownload;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function cancelar() {
    setDocBt(true);
    const query = db.collection("users").where("email", "==", email);
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const gotDoc = doc.data().documents;
        const newArray = [];
        gotDoc.forEach((filter) => {
          if (filter.imageName !== imageName) {
            newArray.push(filter);
          }
        });
        db.collection("users")
          .doc(doc.id)
          .update({ documents: newArray })
          .then(() => {
            window.location.reload();
          });
      });
    });
  }

  function aprobar() {
    const query = db.collection("users").where("email", "==", email);
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const gotDoc = doc.data().documents;
        gotDoc.forEach((array, index) => {
          if (array.imageName === imageName) {
            gotDoc[index].state = true;
            db.collection("users")
              .doc(doc.id)
              .update({ documents: gotDoc })
              .then(() => {
                window.location.reload();
              });
          }
        });
      });
    });
  }

  function rechazar() {
    const query = db.collection("users").where("email", "==", email);
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const gotDoc = doc.data().documents;
        gotDoc.forEach((array, index) => {
          if (array.imageName === imageName) {
            gotDoc[index].uploaded = false;
            db.collection("users")
              .doc(doc.id)
              .update({ documents: gotDoc })
              .then(() => {
                // erase file
                const route = `users/${email}/${array.imageName}`;
                storage
                  .ref(route)
                  .delete()
                  .then(() => {
                    window.location.reload();
                  });
              });
          }
        });
      });
    });
  }

  return (
    <Modal show={state}>
      <Modal.Header onClick={onClose} closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {url !== "404" ? (
          <img alt="" src={url} />
        ) : (
          <div>No se ha subido la imagen</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {type === "completados" ? (
          <Button onClick={() => download(url)} variant="secondary">
            Descargar
          </Button>
        ) : (
          <div>
            {url !== "404" ? (
              <div>
                <Button onClick={() => aprobar()} className={classes.aprobarBt}>
                  Aprobar
                </Button>
                <Button
                  onClick={() => rechazar()}
                  className={classes.rechazarBt}
                >
                  Rechazar
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => cancelar()}
                disabled={cancelDocBt}
                className={classes.aprobarBt}
              >
                Cancelar documento
              </Button>
            )}
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdit;
