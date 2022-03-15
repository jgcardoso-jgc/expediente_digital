/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import { AiFillDelete } from 'react-icons/ai';
import styles from './templates.module.scss';
import TableView from './tableView';
import FormController from './form_controller';
import SoapController from '../../../../shared/seguriSign/controller/soap_controller';

const Templates = () => {
  const cookie = localStorage.getItem('sign-user');
  const [numberInputs, setNumberInputs] = useState([]);
  const location = useLocation();
  const locData = location.state;
  const userEmail = locData ? locData.email : '';
  const form = new FormController();
  const soapController = new SoapController();
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [docName, setDocName] = useState('');
  const [selectedFile, setSelectedFile] = useState({
    selectedFile: null,
    hasSelected: false
  });

  const eraseInput = ({ name }) => {
    const prev = [...numberInputs];
    const erasedArray = prev.filter((el) => el.name !== name);
    setNumberInputs(erasedArray);
  };

  const createInput = ({ name }) => ({
    name,
    value: ''
  });

  const addInput = () => {
    const prev = [...numberInputs];
    prev.push(createInput({ name: nanoid() }));
    setNumberInputs(prev);
  };

  const onFileChange = (event) => {
    setSelectedFile({ hasSelected: true, selectedFile: event.target.files[0] });
  };

  const getDocuments = async () => {
    const res = await form.getDocumentList();
    setDocs(res);
    setLoading(false);
  };

  const removeWhitespace = (str) => str.split(/\s/).join('');

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const upload = async (e) => {
    e.preventDefault();

    const prev = [...numberInputs];
    const inputs = prev.map((p) => p.value);
    const items = inputs.map((i) => ({
      name: removeWhitespace(i),
      label: i,
      type: 'text'
    }));

    const base64File = await toBase64(selectedFile.selectedFile);
    const jsonUpload = {
      name: removeWhitespace(docName),
      label: docName,
      file: base64File,
      items: [items]
    };

    console.log(jsonUpload);
  };

  const handleNameChange = (e) => {
    setDocName(e.target.value);
  };

  const handleInputChange = (e, name) => {
    const prev = [...numberInputs];
    let index = 0;
    for (let x = 0; x < prev.length; x += 1) {
      if (prev[x].name === name) {
        index = x;
      }
    }
    prev[index].value = e.target.value;
    setNumberInputs(prev);
  };

  useEffect(() => {
    if (cookie) {
      soapController.segurisignUser = JSON.parse(cookie);
    } else {
      toast('No estás loggeado en Sign');
    }
    getDocuments();
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
        <form onSubmit={upload}>
          <p className={styles.nameTxt}>Ingresa nombre del Documento</p>
          <input
            className={styles.inputStyle}
            placeholder=""
            value={docName}
            onChange={handleNameChange}
          />
          <p className={styles.ingresaTxt}>Sube tu archivo</p>
          <input type="file" accept="pdf" onChange={onFileChange} />
          <p className={styles.ingresaTxt}>
            Ingresa nombre de los campos requeridos
          </p>
          {numberInputs.length > 0
            ? numberInputs.map((item, index) => (
                <div key={item.name} className={styles.divInput}>
                  <p className={styles.nameTxt}>Nombre</p>
                  <div className={styles.divFlex}>
                    <input
                      className={styles.inputStyle}
                      value={numberInputs[index].value}
                      onChange={(e) => handleInputChange(e, item.name)}
                      placeholder="Ingresa el nombre de el campo"
                    />
                    <button
                      type="button"
                      className={styles.delButton}
                      onClick={() => eraseInput({ name: item.name })}
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              ))
            : ''}
          <button type="button" className={styles.addBt} onClick={addInput}>
            + Agregar Campo
          </button>
          <button type="submit" className={styles.submitBt}>
            Subir Documento
          </button>
        </form>
      </div>
    </div>
  );
};

export default Templates;
