/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable quotes */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import { useLocation } from "react-router-dom";
import { RadioGroup, Radio } from "react-radio-group";
import { ToastContainer, toast } from "react-toastify";
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
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("apple");

  const createFormValues = (items) => {
    const temp = [];
    items.forEach((item) => {
      temp.push({ name: item.name, label: item.label, value: "" });
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
      soapController.segurisignUser = JSON.parse(cookie);
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

  useEffect(() => {
    if (cookie) {
      soapController.segurisignUser = JSON.parse(cookie);
      console.log(soapController.segurisignUser);
    } else {
      toast("Alerta: No estás loggeado en Sign");
    }
    getDocuments();
  }, []);

  useEffect(() => {}, [docs, inputs]);
  return (
    <div className={styles.container}>
      <ToastContainer />
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
                  <p className={styles.title}>{input.label}</p>
                  <input style={{ display: "none" }} value={input.label} />
                  <input
                    className={styles.inputStyle}
                    placeholder=""
                    type={input.type}
                    id={input.name}
                    onChange={(e) => handleFormValueChange(input.name, e)}
                  />
                </div>
              ))
            : ""}
          <button
            className={loading ? styles.btDisabled : styles.bt}
            type="submit"
            disabled={loading}
          >
            Enviar
          </button>
          <p>{loading ? "Subiendo documento..." : ""}</p>
        </div>
      </form>
    </div>
  );
};

export default Templates;
