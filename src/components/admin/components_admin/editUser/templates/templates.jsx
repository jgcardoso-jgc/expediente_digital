/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useEffect } from "react";
import styles from "./templates.module.scss";
import FormController from "./form_controller";

const Templates = () => {
  const form = new FormController();
  const getDocuments = () => {
    form.getDocumentList();
  };
  useEffect(() => {
    getDocuments();
  }, []);
  return (
    <div className={styles.container}>
      <h2>Reglamento Universitario</h2>
      <div>
        <p>Seleccionar ID</p>
        <label>
          <input type="checkbox" /> id Usuario
        </label>
        <label className={styles.checkbox}>
          <input type="checkbox" /> id Empresarial
        </label>
        <p className={styles.title}>Nombre completo</p>
        <input
          className={styles.inputStyle}
          placeholder="Nombre completo"
          type="text"
        />
        <p className={styles.title}>Nombre de la licenciatura</p>
        <input
          className={styles.inputStyle}
          placeholder="Nombre de la licenciatura"
          type="text"
        />
        <button className={styles.bt} type="button">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Templates;
