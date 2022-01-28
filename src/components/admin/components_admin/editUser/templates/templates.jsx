/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import { RadioGroup, Radio } from "react-radio-group";
import styles from "./templates.module.scss";
import FormController from "./form_controller";

const Templates = () => {
  const form = new FormController();
  const [docs, setDocs] = useState([]);
  const [docType, setDocType] = useState("");
  const [inputs, setInputs] = useState([]);
  const [formValues, setFormValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState("apple");

  const createFormValues = (items) => {
    const temp = [];
    items.forEach((item) => {
      temp.push({ name: item.name, value: '' });
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
    const foundIndex = formValuesTemp.findIndex((formValue) => formValue.name === name);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await form.submit(formValues, docType);
    console.log(result);
  };

  useEffect(() => {
    getDocuments();
  }, []);

  useEffect(() => { }, [docs, inputs]);
  return (
    <div className={styles.container}>
      <h2>Selecciona Tipo de Documento</h2>
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
