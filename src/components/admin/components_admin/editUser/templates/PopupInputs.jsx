/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable quotes */
/* eslint-disable no-param-reassign */
import Popup from 'reactjs-popup';
import Card from 'react-bootstrap/Card';
import { Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useFirebaseApp } from 'reactfire';
import styles from './PopupInputs.module.scss';
import UserController from '../../../../shared/seguriSign/controller/user_controller';

const PopupInputs = ({
  label,
  items,
  soapController,
  userEmail,
  form,
  uuid,
  curp,
  isAddButton
}) => {
  const cookie = localStorage.getItem('sign-user');
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState([]);

  const createFormValues = (itemsForm) => {
    setFormValues([]);
    const temp = [];
    itemsForm.forEach((item) => {
      temp.push({ name: item.name, label: item.label, value: '' });
    });
    setFormValues(temp);
  };

  const getDocByID = async (id) => {
    // console.log(`id:${id}`);
    const docRef = db.collection('generatedDocs').doc(id);
    const doc = await docRef.get();
    if (doc.exists) {
      return doc.data();
    }
    return false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cookie) {
      toast('No estás loggeado');
      return;
    }
    setLoading(true);
    const docID = await form.submit(formValues, uuid);
    // console.log(`docID:${docID}`);
    const doc = await getDocByID(docID);
    const requiresFM = false;
    if (doc) {
      // soapController.segurisignUser = JSON.parse(cookie);
      // console.log(userEmail, doc);
      const response = await soapController.addDocument(userEmail, doc);
      // console.log(response);
      if (response[0]) {
        const userController = new UserController(
          soapController.segurisignUser.email
        );
        response[1].docType = uuid;
        // console.log(response[1]);
        // console.log(Object.keys(response[1]));
        await userController.addNewDocToFirebase(
          [userEmail],
          response[1],
          requiresFM
        );
        setLoading(false);
        toast('Éxito');
      } else {
        setLoading(false);
        toast('Error al subir documento');
      }
    } else {
      setLoading(false);
      toast('Error al generar documento');
    }
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

  const curpInput = (input) => {
    if (input.name === 'acreedor') {
      return (
        <input
          placeholder={userEmail.fullname}
          type={input.type}
          id={input.name}
          className={styles.inputField}
          onChange={(e) => handleFormValueChange(input.name, e)}
        />
      );
    }
    if (input.name === 'curpAcreedor') {
      return (
        <input
          placeholder=""
          type={input.type}
          id={input.name}
          value={curp}
          className={styles.inputField}
          readOnly
          onChange={(e) => handleFormValueChange(input.name, e)}
        />
      );
    }
    return (
      <input
        placeholder=""
        type={input.type}
        id={input.name}
        className={styles.inputField}
        onChange={(e) => handleFormValueChange(input.name, e)}
      />
    );
  };

  useEffect(() => {
    if (cookie) {
      soapController.segurisignUser = JSON.parse(cookie);
    } else {
      toast('No estás loggeado en Sign');
    }
    createFormValues(items);
  }, []);

  return (
    <div>
      <ToastContainer />
      <Popup
        modal
        trigger={
          <button
            type="button"
            className={isAddButton ? styles.bt : styles.btTable}
          >
            {label}
          </button>
        }
      >
        {(close) => (
          <div align="center">
            <Card>
              <Card.Body className={styles.popup}>
                <Card.Title>
                  <b>{label}</b>
                </Card.Title>
                <form onSubmit={handleSubmit}>
                  {items.map((input, index) => (
                    <div key={`i${index}`} className={styles.divInputs}>
                      <p className={styles.label}>{input.label}</p>
                      <input
                        style={{ display: 'none' }}
                        value={input.label}
                        readOnly
                      />
                      {curpInput(input)}
                    </div>
                  ))}
                  <button
                    className={loading ? styles.btDisabled : styles.bt}
                    type="submit"
                    disabled={loading}
                  >
                    Enviar
                  </button>
                  <p>{loading ? 'Subiendo documento...' : ''}</p>
                </form>
                <Col>
                  <Button variant="outline-dark" onClick={close}>
                    Cerrar
                  </Button>
                </Col>
              </Card.Body>
            </Card>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupInputs;
