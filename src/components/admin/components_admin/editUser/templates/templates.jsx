/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import { useLocation } from "react-router-dom";
import { RadioGroup, Radio } from "react-radio-group";
import UserController from "../../../../shared/seguriSign/controller/user_controller";
import styles from "./templates.module.scss";
import FormController from "./form_controller";
import SoapController from "../../../../shared/seguriSign/controller/soap_controller";

const Templates = () => {
  const form = new FormController();
  const soapController = new SoapController();
  const cookie = localStorage.getItem("sign-user");
  const location = useLocation();
  const locData = location.state;
  const { userEmail } = locData;
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [docs, setDocs] = useState([]);
  const [docType, setDocType] = useState("");
  const [inputs, setInputs] = useState([]);
  const [formValues, setFormValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState("apple");

  const createFormValues = (items) => {
    const temp = [];
    items.forEach((item) => {
      temp.push({ name: item.name, value: "" });
    });
    setFormValues(temp);
  };

  const updateInputs = (e) => {
    setInputs([]);
    setFormValues([]);
    docs.forEach((doc) => {
      if (doc.name === e) {
        setInputs(doc.items);
        setDocType(doc.name);
        createFormValues(doc.items);
      }
    });
  };

  const handleChange = (value) => {
    setSelectedValue(value);
    updateInputs(value);
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

  const getDocuments = async () => {
    const res = await form.getDocumentList();
    console.log(res);
    setDocs(res);
  };

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
      alert("No estás loggeado");
      return;
    }
    const docID = await form.submit(formValues, docType);
    const doc = await getDocByID(docID);
    const requiresFM = false;
    if (doc) {
      soapController.segurisignUser = JSON.parse(cookie);
      const response = await soapController.addDocument(userEmail, doc);
      console.log(response);
      if (response[0]) {
        const userController = new UserController(
          soapController.segurisignUser.email
        );
        await userController.addNewDocToFirebase(
          [userEmail],
          response[1],
          requiresFM
        );
        alert("exito");
      } else {
        alert("Error al subir doc");
      }
    } else {
      alert("Error al generar doc");
    }
  };

  useEffect(() => {
    if (cookie) {
      soapController.segurisignUser = JSON.parse(cookie);
      console.log(soapController.segurisignUser);
    } else {
      alert("Alerta: No estás loggeado en Sign");
    }
    getDocuments();
  }, []);

  useEffect(() => {}, [docs, inputs]);
  return (
    <div className={styles.container}>
      <h4>Selecciona Tipo de Documento</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <RadioGroup
            name="fruit"
            selectedValue={selectedValue}
            onChange={handleChange}
          >
            {docs.length > 0
              ? docs.map((doc, index) => (
                  <div key={`i${index}`}>
                    <Radio value={doc.name} />
                    {` ${doc.label}`}
                  </div>
                ))
              : ""}
          </RadioGroup>
          {inputs.length > 0
            ? inputs.map((input, index) => (
                <div key={`i${index}`}>
                  <p className={styles.title}>{input.value}</p>
                  <input
                    className={styles.inputStyle}
                    placeholder={`Ingresa ${input.value}`}
                    type="text"
                    id={input.name}
                    onChange={(e) => handleFormValueChange(input.name, e)}
                  />
                  {input.label}
                </div>
              ))
            : ""}
          <button className={styles.bt} type="submit">
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Templates;

/*
 "items": [{
                "name": "Area que registra",
                "value:": "areaContacto"},
            }],

*/
