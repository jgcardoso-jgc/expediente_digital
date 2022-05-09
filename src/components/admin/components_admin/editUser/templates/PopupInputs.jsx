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
  deudor,
  curpDeudor,
  isAddButton,
  inherit,
  data
}) => {
  const cookie = localStorage.getItem('sign-user');
  const signerUser = JSON.parse(localStorage.getItem('locationData'));
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState([]);

  const createFormValues = (itemsForm) => {
    setFormValues([]);
    const temp = [];
    const valuesToInherit = [];
    if (inherit) {
      const itemsInherit = inherit[0].items;
      itemsInherit.forEach((obj) => {
        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          valuesToInherit.push(value);
        });
      });
    }
    itemsForm.forEach((item) => {
      if (valuesToInherit.includes(item.name)) {
        temp.push({
          name: item.name,
          label: item.label,
          value: data[item.name]
        });
        return;
      }
      if (item.name === 'curpAcreedor') {
        temp.push({ name: item.name, label: item.label, value: curp });
        return;
      }
      if (item.name === 'curpDeudor') {
        temp.push({ name: item.name, label: item.label, value: curpDeudor });
        return;
      }
      temp.push({ name: item.name, label: item.label, value: '' });
    });
    setFormValues(temp);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cookie) {
      toast('No estás loggeado');
      return;
    }
    setLoading(true);

    const createdDocRespone = await form.submit(formValues, uuid);
    if (createdDocRespone) {
      const docID = createdDocRespone[0];
      const requiresFM = false;
      const layoutDocument = createdDocRespone[1];
      const response = await soapController.addDocument(signerUser, {
        layoutDocument,
        typeDocument: `${docID}.pdf`
      });
      if (response[0]) {
        const userController = new UserController(
          soapController.segurisignUser.email
        );
        response[1].docType = uuid;
        await userController.addNewCreatedDocToFirebase(
          [signerUser.curp],
          response[1],
          requiresFM,
          formValues
        );
        setLoading(false);
        toast('Documento enviado correctamente');
      } else {
        setLoading(false);
        toast('Error al subir documento');
      }
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
    const valuesToInherit = [];
    if (inherit) {
      const itemsInherit = inherit[0].items;
      itemsInherit.forEach((obj) => {
        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          valuesToInherit.push(value);
        });
      });
    }
    if (valuesToInherit.includes(input.name)) {
      return (
        <input
          placeholder={userEmail.fullname}
          type={input.type}
          id={input.name}
          value={data[input.name]}
          className={styles.inputField}
          onChange={(e) => handleFormValueChange(input.name, e)}
        />
      );
    }
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
    if (input.name === 'deudor') {
      return (
        <input
          placeholder={deudor}
          type={input.type}
          id={input.name}
          className={styles.inputField}
          onChange={(e) => handleFormValueChange(input.name, e)}
        />
      );
    }
    if (input.name === 'curpDeudor') {
      return (
        <input
          placeholder=""
          type={input.type}
          id={input.name}
          value={curpDeudor}
          className={styles.inputField}
          readOnly
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
