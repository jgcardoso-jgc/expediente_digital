/* eslint-disable import/order */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import { createUseStyles } from "react-jss";
import { ToastContainer, toast } from "react-toastify";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import styles from "../../../../resources/theme";
import "bootstrap/dist/css/bootstrap.css";
import ModalEdit from "../modal/modal";
import docFunctions from "./getDocuments";
import { v4 as uuidv4 } from "uuid";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  container: {
    backgroundColor: "#f5f5f5",
    border: `1px solid #f5f5f5`,
    borderRadius: 4,
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
    padding: "24px 32px 0px 32px",
    height: "100%",
  },
  center: {
    textAlign: "center",
  },
  checkbox: {
    display: "block",
  },
  rowDocs: {
    marginTop: "20px",
  },
  pointer: {
    cursor: "pointer",
  },
  mt20: { marginTop: "20px" },
  mb20: {
    marginBottom: "20px",
  },
  col: {},
  "@media screen and (max-width:768px)": {
    col: {
      marginTop: "20px",
      marginBottom: "20px",
    },
  },
}));

const EditUser = () => {
  const classes = useStyles();
  const global = globalTheme();
  const location = useLocation();
  const locData = location.state.objUser;
  const [urlDocs, setUrls] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const storage = firebase.storage();
  // const auth = firebase.auth();
  const [show, setShow] = useState(false);
  const [urlView, setUrl] = useState("");
  const [titleModal, setTitle] = useState("");
  const [cboxes, setCBoxes] = useState([]);
  const [type, setType] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [docsToUpdate, setDocs] = useState([]);
  const [imageName, setImageName] = useState("");
  const [email, setEmail] = useState("");

  function handleOnChange(e, cbox) {
    const isChecked = e.target.checked;
    let array = docsToUpdate;
    if (isChecked) {
      array.push(cbox);
      setDocs(array);
    } else {
      array = array.filter((element) => element !== cbox);
      setDocs(array);
    }
    const checkedBoxes = document.querySelectorAll(
      "input[type=checkbox]:checked"
    );
    const length = checkedBoxes.length;
    if (length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }

  function handleShow(url, typeModal) {
    setUrl(url.url);
    setTitle(url.title);
    setImageName(url.imageName);
    setType(typeModal);
    setEmail(url.email);
    setShow(true);
  }

  function updatePendientes() {
    docFunctions.setPendientes(db, docsToUpdate, locData).then((res) => {
      toast(res);
    });
  }

  function getDocs() {
    docFunctions.getState(db, locData).then((docArray) => {
      docFunctions
        .getDownloadURLS(storage, docArray, locData)
        .then((arrayUrls) => {
          setUrls(arrayUrls[0]);
          setPendientes(arrayUrls[1]);
          docFunctions.setCheckboxes(db, arrayUrls).then((chboxes) => {
            setCBoxes(chboxes);
          });
        });
    });
  }

  useEffect(() => {
    getDocs();
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="container max500">
        <div className="cardDashboard pt10">
          <div className="row" />
          <b>Nombre</b>
          <p>{locData.fullname}</p>
          <b>RFC</b>
          <p>{locData.rfc}</p>
          <b>Email</b>
          <p>{locData.email}</p>
          <b>Onboarding</b>
          {locData.onboarding ? <div>Listo</div> : <div>Pendiente</div>}
          <p />
          <p>
            <b>Documentos Completados</b>
          </p>
          {urlDocs.length && (
            <div>
              <Row className={classes.rowDocs}>
                {urlDocs.map((url) => (
                  <Col className={classes.col} key={uuidv4()}>
                    <div
                      className={`${classes.container} ${classes.pointer}`}
                      onKeyPress={() => handleShow(url, "completados")}
                      key={uuidv4()}
                      onClick={() => handleShow(url, "completados")}
                    >
                      <p className={classes.center}>{url.title}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
          <p className={classes.mt20}>
            <b>Documentos Pendientes</b>
          </p>
          {pendientes.length > 0 ? (
            <div>
              <Row className={`${classes.rowDocs} ${classes.mb20}`}>
                {pendientes.map((url) => (
                  <Col className={classes.col} key={uuidv4()}>
                    <div
                      className={`${classes.container} ${classes.pointer}`}
                      onKeyPress={() => handleShow(url, "pendientes")}
                      key={uuidv4()}
                      onClick={() => handleShow(url, "pendientes")}
                    >
                      <p className={classes.center}>{url.title}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <div className={classes.mb20}>No hay documentos pendientes</div>
          )}
          <p>
            <b>Agregar Documentos</b>
          </p>
          <p>Selecciona los documentos requeridos para el usuario</p>
          {cboxes.length > 0 ? (
            <div>
              {cboxes.map((cbox) => (
                <label className={classes.checkbox}>
                  <input
                    type="checkbox"
                    onChange={(e) => handleOnChange(e, cbox)}
                  />
                  {cbox.nombre}
                </label>
              ))}
            </div>
          ) : (
            <div>Ya se solicitaron todos los documentos disponibles</div>
          )}
          <ModalEdit
            state={show}
            url={urlView}
            title={titleModal}
            type={type}
            imageName={imageName}
            email={email}
            onClose={() => setShow(false)}
          />
          <button
            type="button"
            onClick={() => updatePendientes()}
            className={global.initBt}
            disabled={disabled}
          >
            Agregar Documentos
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
