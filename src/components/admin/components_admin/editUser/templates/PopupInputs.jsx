/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable quotes */
import Popup from "reactjs-popup";
import Card from "react-bootstrap/Card";
import { Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useFirebaseApp } from "reactfire";
import styles from "./templates.module.scss";
import UserController from "../../../../shared/seguriSign/controller/user_controller";

const PopupInputs = ({
  label,
  items,
  soapController,
  docType,
  userEmail,
  form,
}) => {
  const cookie = localStorage.getItem("sign-user");
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState([]);
  const getDocByID = async (id) => {
    const docRef = db.collection("generatedDocs").doc(id);
    const doc = await docRef.get();
    if (doc.exists) {
      return doc.data();
    }
    return false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cookie) {
      toast("No estás loggeado");
      return;
    }
    setLoading(true);
    // console.log(`vals:${formValues}`);
    const docID = await form.submit(formValues, docType);
    // console.log("docID ", docID);
    const doc = await getDocByID(docID);
    const requiresFM = false;
    if (doc) {
      // soapController.segurisignUser = JSON.parse(cookie);
      const response = await soapController.addDocument(userEmail, doc);
      // console.log(response);
      if (response[0]) {
        const userController = new UserController(
          soapController.segurisignUser.email
        );
        await userController.addNewDocToFirebase(
          [userEmail],
          response[1],
          requiresFM
        );
        setLoading(false);
        toast("Éxito");
      } else {
        setLoading(false);
        toast("Error al subir documento");
      }
    } else {
      setLoading(false);
      toast("Error al generar documento");
    }
  };

  const handleFormValueChange = (name, evt) => {
    const { value } = evt.target;
    const formValuesTemp = [...formValues];
    const foundIndex = formValuesTemp.findIndex(
      (formValue) => formValue.name === name
    );
    const updatedValue = { ...formValuesTemp[foundIndex] };
    updatedValue.value = value;
    formValuesTemp[foundIndex] = updatedValue;
    setFormValues(formValuesTemp);
  };

  return (
    <div>
      <Popup
        modal
        trigger={
          <Button style={{ background: "#cccccc", color: "black", border: 0 }}>
            {label}
          </Button>
        }
      >
        {(close) => (
          <div align="center">
            <Card style={{}}>
              <Card.Body>
                <Card.Title>Cancelar documento</Card.Title>
                <form onSubmit={handleSubmit}>
                  {items.map((input, index) => (
                    <div key={`i${index}`}>
                      <p>{input.label}</p>
                      <input style={{ display: "none" }} value={input.label} />
                      <input
                        placeholder=""
                        type={input.type}
                        id={input.name}
                        onChange={(e) => handleFormValueChange(input.name, e)}
                      />
                    </div>
                  ))}
                  <button
                    className={loading ? styles.btDisabled : styles.bt}
                    type="submit"
                    disabled={loading}
                  >
                    Enviar
                  </button>
                  <p>{loading ? "Subiendo documento..." : ""}</p>
                </form>
                <Col>
                  <Button variant="outline-dark" onClick={close}>
                    Cerrar
                  </Button>
                  <button
                    type="button"
                    className="btn-seguridata-lg"
                    style={{ marginLeft: "2rem" }}
                    onClick={() => console.log("")}
                  >
                    Cancelar
                  </button>
                </Col>
              </Card.Body>
            </Card>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupInputs;
