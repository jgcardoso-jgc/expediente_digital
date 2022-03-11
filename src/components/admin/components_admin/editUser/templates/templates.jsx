/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import styles from "./templates.module.scss";
import TableView from "./tableView";
import FormController from "./form_controller";
import SoapController from "../../../../shared/seguriSign/controller/soap_controller";

const Templates = () => {
  const cookie = localStorage.getItem("sign-user");
  const location = useLocation();
  const locData = location.state;
  const userEmail = locData ? locData.email : "";
  const form = new FormController();
  const soapController = new SoapController();
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);

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
      </div>
    </div>
  );
};

export default Templates;
