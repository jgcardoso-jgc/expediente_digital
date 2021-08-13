/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { createUseStyles } from "react-jss";
import { useFirebaseApp } from "reactfire";

const useStyles = createUseStyles({
  aprobarBt: {
    background: "green",
    border: 0,
  },
  rechazarBt: {
    background: "red",
    marginLeft: "10px",
    border: 0,
  },
});

const ModalEdit = ({ state, onClose, url, title, type }) => {
  const classes = useStyles();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const user = JSON.parse(localStorage.getItem("user"));
  if (!state) {
    return null;
  }

  function aprobar() {
    const query = db.collection("users").where("email", "==", user.email);
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const gotDoc = doc.data().documents;
        gotDoc.forEach((array, index) => {
          if (array.uploaded !== "undefined" && array.imageName === title) {
            gotDoc[index].uploaded = true;
            db.collection("users").doc(doc.id).update({ documents: gotDoc });
          }
        });
      });
      // setUploaded(true);
    });
  }

  return (
    <Modal show={state}>
      <Modal.Header onClick={onClose} closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img alt="" src={url} />
      </Modal.Body>
      <Modal.Footer>
        {type === "completados" ? (
          <Button onClick={onClose} variant="secondary">
            Descargar
          </Button>
        ) : (
          <div>
            <Button onClick={onClose} className={classes.aprobarBt}>
              Aprobar
            </Button>
            <Button onClick={onClose} className={classes.rechazarBt}>
              Rechazar
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdit;
