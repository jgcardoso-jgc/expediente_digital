/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-console */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import { useFirebaseApp } from 'reactfire';
import { AiFillDelete } from 'react-icons/ai';
import styles from './templates.module.scss';
import TableViewDocs from './tables/tableViewDocs';
import PopupInputs from './PopupInputs';
import TableViewPagare from './tables/tableViewPagare';
import TableViewUsers from './tables/tableViewUsers';
import FormController from './form_controller';
import SoapController from '../../../../shared/seguriSign/controller/soap_controller';

const Templates = () => {
  function getLocationData() {
    if (localStorage.getItem('locationData')) {
      return JSON.parse(localStorage.getItem('locationData'));
    }
    return '';
  }

  const [numberInputs, setNumberInputs] = useState([]);
  const userData = getLocationData();
  const form = new FormController();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const soapController = new SoapController();
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [docName, setDocName] = useState('');
  const [errors, setErrors] = useState([]);
  const [userSelected, setUserSelected] = useState({
    curp: '',
    email: '',
    deudor: 'Por favor selecciona un CURP'
  });
  const [selectedFile, setSelectedFile] = useState({
    selectedFile: null,
    hasSelected: false
  });
  const [pagare, setPagare] = useState([]);
  const [endoso, setEndoso] = useState([]);
  const [userPagares, setUserPagares] = useState([]);

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
    const ignoredLabels = ['PAGARE', 'ENDOSO', 'PAGO PARCIAL', 'CANCELACION'];
    const res = await form.getDocumentList();
    const filterDocs = res.filter((doc) => !ignoredLabels.includes(doc.label));
    const pagareDoc = res.filter((doc) => doc.label === 'PAGARE');
    const endosoDoc = res.filter((doc) => doc.label === 'ENDOSO');
    setPagare(pagareDoc);
    setEndoso(endosoDoc);
    setDocs(filterDocs);
    setLoading(false);
  };

  const inheritPagare = (inheritArray) => {
    const pagareArray = inheritArray.filter(
      (inherit) => inherit.document === pagare[0].uuid
    );
    return pagareArray;
  };

  const getUserPagares = async () => {
    if (endoso.length > 0) {
      const query = db
        .collection('sign-docs')
        .where('curpAcreedor', '==', userData.curp);
      query.get().then((querySnapshot) => {
        const getPagares = [];
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            const docData = doc.data();
            const pagareData = {
              acreedor: docData.acreedor,
              deudor: docData.deudor,
              curpAcreedor: docData.curpAcreedor,
              curpDeudor: docData.curpDeudor,
              folio: docData.folio,
              fecha: docData.fecha
            };
            pagareData.items = endoso[0].items;
            pagareData.inherit = inheritPagare(endoso[0].inherit);
            getPagares.push(pagareData);
          });
        }
        setUserPagares(getPagares);
      });
    }
  };

  const removeWhitespace = (str) => str.split(/\s/).join('');

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const checkErrors = () => {
    setErrors([]);
    const thisErrors = [];
    if (docName.length < 4) {
      thisErrors.push(
        'El nombre de el documento debe tener 4 car??cteres como m??nimo'
      );
    }
    if (selectedFile.selectedFile == null) {
      thisErrors.push('No has elegido archivo.');
    }

    let errorFlag1 = false;
    let errorFlag2 = false;

    const prevInputs = [...numberInputs];
    prevInputs.forEach((nu) => {
      if (nu.value.length < 4) {
        if (!errorFlag1) {
          thisErrors.push('Los campos deben tener 4 car??cteres como m??nimo');
          errorFlag1 = true;
        }
      }
      if (nu.value.length === 0) {
        if (!errorFlag2) {
          thisErrors.push('No puede haber campos vac??os');
          errorFlag2 = true;
        }
      }
    });

    if (thisErrors.length > 0) {
      setErrors(thisErrors);
      return true;
    }
    return false;
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!checkErrors()) {
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
    }
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
    const cookie = localStorage.getItem('sign-user');
    if (cookie) {
      soapController.segurisignUser = JSON.parse(cookie);
    } else {
      toast('No est??s loggeado en Sign');
    }
    getDocuments();
    setNumberInputs([createInput({ name: nanoid(), isFirst: true })]);
  }, []);

  useEffect(() => {
    getUserPagares();
  }, [endoso]);

  useEffect(() => {}, [numberInputs]);

  return (
    <div>
      <div className={`${styles.container} ${styles.mb}`}>
        <ToastContainer />
        <h4 className={styles.titleCard}>
          <b>Selecciona Tipo de Documento</b>
        </h4>
        <p className={styles.nameTxt}>
          <b>Nombre</b>
        </p>
        <p>{userData.fullname}</p>
        <p className={styles.nameTxt}>
          <b>Email</b>
        </p>
        <p>{userData.email}</p>
        <p className={styles.nameTxt}>
          <b>Curp de el Usuario</b>
        </p>
        <p>{userData.curp ? userData.curp : 'Pendiente'}</p>
        {loading ? 'Cargando...' : ''}
        <div className={styles.mt}>
          {docs.length > 0 ? (
            <TableViewDocs
              data={docs}
              docsNumber={0}
              name={userData.fullname}
              userEmail={userData.email}
              form={form}
              soapController={soapController}
            />
          ) : (
            ''
          )}
        </div>
      </div>
      <div className={`${styles.container} ${styles.mb}`}>
        <ToastContainer />
        <h4 className={styles.titleCard}>
          <b>Pagar??s</b>
        </h4>
        <h5 className={styles.titleCard}>
          <b>Agregar Pagar??</b>
        </h5>
        <p>
          El Pagar?? se asociara a el CURP de el usuario. <br /> Favor de
          verificar la informaci??n.
        </p>
        <p>Curp de el acreedor:</p>
        <p>
          <b>{userData.curp ? userData.curp : 'Pendiente'}</b>
        </p>
        <p className={styles.mbSubtitle}>Selecciona curp del deudor</p>
        <TableViewUsers setSelected={setUserSelected} docsNumber={0} />
        <p>Informaci??n del deudor:</p>
        <p>
          <b>
            {userSelected.deudor}
            <br />
            {userSelected.email}
            <br />
            {userSelected.curp}
          </b>
        </p>
        {pagare.length > 0 && userSelected.curp !== '' && userData.curp ? (
          <PopupInputs
            label="Agregar Pagar??"
            docType={pagare[0].name}
            items={pagare[0].items}
            form={form}
            soapController={soapController}
            userEmail={userData}
            uuid={pagare[0].uuid}
            curp={userData.curp}
            deudorEmail={userSelected.email}
            deudorName={userSelected.deudor}
            deudorCurp={userSelected.curp}
            isAddButton
          />
        ) : (
          <button type="button" className={styles.btDisabled}>
            Agregar Pagar??
          </button>
        )}
        {loading ? 'Cargando...' : ''}
        <h5 className={styles.listTitle}>
          <b>Lista de Pagar??s de el Usuario</b>
        </h5>
        <p>
          Da click en Generar en el documento que quieras crear a partir del
          Pagar?? seleccionado
        </p>
        <div className={styles.mt}>
          {userPagares.length > 0 ? (
            <TableViewPagare
              data={userPagares}
              uuid={endoso[0].uuid}
              docsNumber={0}
              idInherit={pagare[0].uuid}
              userEmail={userData.email}
              form={form}
              soapController={soapController}
            />
          ) : (
            'El usuario no tiene pagar??s'
          )}
        </div>
      </div>
      <div className={styles.container}>
        <ToastContainer />
        <h4 className={styles.titleCard}>
          <b>Subir nuevo documento</b>
        </h4>
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
                    {index > 0 && (
                      <button
                        type="button"
                        className={styles.delButton}
                        onClick={() => eraseInput({ name: item.name })}
                      >
                        <AiFillDelete />
                      </button>
                    )}
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
          {errors.length > 0 ? (
            <div className={styles.errorsDiv}>
              {errors.map((er) => (
                <p className={styles.errorMsg}>{er}</p>
              ))}
            </div>
          ) : (
            ''
          )}
        </form>
      </div>
    </div>
  );
};

export default Templates;
