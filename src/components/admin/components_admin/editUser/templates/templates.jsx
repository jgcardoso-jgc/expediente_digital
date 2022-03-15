/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import styles from './templates.module.scss';
import TableView from './tableView';
import FormController from './form_controller';
import SoapController from '../../../../shared/seguriSign/controller/soap_controller';

const Templates = () => {
  const cookie = localStorage.getItem('sign-user');

  const createInput = ({ name }) => ({
    name,
    input: (
      <input
        className={styles.inputStyle}
        placeholder="Ingresa el nombre de el campo"
      />
    )
  });
  const [numberInputs, setNumberInputs] = useState([]);

  const eraseInput = ({ name }) => {
    const prev = [...numberInputs];
    const erasedArray = prev.filter((el) => el.name !== name);
    setNumberInputs(erasedArray);
  };

  const [newDoc, setDoc] = useState({
    name: '',
    label: '',
    items: [{ name: '', label: '' }]
  });

  const location = useLocation();
  const locData = location.state;
  const userEmail = locData ? locData.email : '';
  const form = new FormController();
  const soapController = new SoapController();
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);

  const upload = () => {
    console.log(newDoc);
  };

  const addInput = () => {
    setNumberInputs((prevState) =>
      prevState.push(createInput({ name: nanoid(), isFirst: false }))
    );
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
      toast('No estás loggeado en Sign');
    }
    getDocuments();
    setDoc((prevState) => ({ prevState, name: '' }));
    setNumberInputs([createInput({ name: nanoid(), isFirst: true })]);
  }, []);

  useEffect(() => {}, [numberInputs]);

  return (
    <div>
      <div className={`${styles.container} ${styles.mb}`}>
        <ToastContainer />
        <h4 className={styles.titleCard}>Selecciona Tipo de Documento</h4>
        <p>{userEmail}</p>
        {loading ? 'Cargando...' : ''}
        <div className={styles.mt}>
          {docs.length > 0 ? (
            <TableView
              data={docs}
              docsNumber={0}
              form={form}
              soapController={soapController}
            />
          ) : (
            ''
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
          {numberInputs.length > 0
            ? numberInputs.map((item) => (
                <div key={nanoid()}>
                  <p>Nombre</p>
                  {item.input}
                  <button
                    type="button"
                    onClick={() => eraseInput({ name: item.name })}
                  >
                    Eliminar
                  </button>
                </div>
              ))
            : ''}
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
