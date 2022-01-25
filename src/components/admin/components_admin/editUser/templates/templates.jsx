/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { RadioGroup, Radio } from "react-radio-group";
import styles from "./templates.module.scss";
import FormController from "./form_controller";

const Templates = () => {
  const form = new FormController();
  const [docs, setDocs] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [selectedValue, setSelectedValue] = useState("apple");

  const updateInputs = (e) => {
    setInputs([]);
    docs.forEach((doc) => {
      if (doc.name === e) {
        console.log(e);
        setInputs(doc.items);
      }
    });
  };

  const handleChange = (value) => {
    setSelectedValue(value);
    updateInputs(value);
  };

  const getDocuments = async () => {
    const res = await form.getDocumentList();
    console.log(res);
    setDocs(res.documents);
  };

  useEffect(() => {
    getDocuments();
  }, []);

  useEffect(() => {}, [docs, inputs]);
  return (
    <div className={styles.container}>
      <h2>Selecciona Tipo de Documento</h2>
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
                />
                {input.label}
              </div>
            ))
          : ""}
        <button className={styles.bt} type="button">
          Enviar
        </button>
      </div>
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
