/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable object-curly-spacing */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { nanoid } from "nanoid";
import styles from "./templates.module.scss";
import TableView from "./tableView";
import FormController from "./form_controller";
import SoapController from "../../../../shared/seguriSign/controller/soap_controller";

const Templates = () => {
  const cookie = localStorage.getItem("sign-user");

  const createInput = ({ name, isFirst }) => ({
    name,
    input: (
      <>
        <input
          className={styles.inputStyle}
          placeholder="Ingresa el nombre de el campo"
        />
        {isFirst === false && (
          <button type="button" onClick={() => eraseInput({ name })}>
            Eliminar
          </button>
        )}
      </>
    ),
  });

  const [numberInputs, setNumberInputs] = useState([
    createInput({ name: nanoid(), isFirst: true }),
  ]);

  const eraseInput = ({ name }) => {
    console.log(`to erase:${numberInputs}`);
    const erasedArray = numberInputs.filter((el) => el.name !== name);
    console.log(`name:${name}`);
    console.log(erasedArray);
    setNumberInputs(erasedArray);
  };

  const [newDoc, setDoc] = useState({
    name: "",
    label: "",
    items: [{ name: "", label: "" }],
  });

  const location = useLocation();
  const locData = location.state;
  const userEmail = locData ? locData.email : "";
  const form = new FormController();
  const soapController = new SoapController();
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);

  const upload = () => {
    console.log(newDoc);
  };

  const addInput = () => {
    const prev = [...numberInputs];
    prev.push(createInput({ name: nanoid(), isFirst: false }));
    setNumberInputs(prev);
  };

  const getDocuments = async () => {
    const res = await form.getDocumentList();
    setDocs(res);
    setLoading(false);
  };

  useEffect(() => {
    if (cookie) {
      soapController.segurisignUser = JSON.parse(cookie);
    } else {
      toast("Alerta: No estás loggeado en Sign");
    }
    getDocuments();
    setDoc((prevState) => ({ prevState, name: "" }));
  }, []);

  return (
    <div>
      <div className={`${styles.container} ${styles.mb}`}>
        <ToastContainer />
        <h4 className={styles.titleCard}>Selecciona Tipo de Documento</h4>
        <p>{userEmail}</p>
        {loading ? "Cargando..." : ""}
        <div className={styles.mt}>
          {docs.length > 0 ? (
            <TableView
              data={docs}
              docsNumber={0}
              form={form}
              soapController={soapController}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={styles.container}>
        <ToastContainer />
        <h4 className={styles.titleCard}>Subir nuevo documento</h4>
        <form>
          <p>Ingresa nombre del Documento</p>
          <input className={styles.inputStyle} placeholder="" />
          <p>Ingresa nombre de los campos requeridos</p>
          {numberInputs.map((item) => (
            <div key={nanoid()}>
              <label>Nombre</label>
              {item.input}
            </div>
          ))}
          <button type="button" className={styles.addBt} onClick={addInput}>
            + Agregar Campo
          </button>
          <button type="submit" className={styles.submitBt} onSubmit={upload}>
            Subir Documento
          </button>
        </form>
      </div>
    </div>
  );
};

export default Templates;
