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
import Select from "react-select";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  container: {
    backgroundColor: "#f5f5f5",
    border: `1px solid #f5f5f5`,
    borderRadius: 10,
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
    padding: "24px 32px 0px 32px",
    height: "100%",
    maxWidth: 600,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 20,
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
    background: "transparent",
  },
  containerPendiente: {
    backgroundColor: "#f2bd85",
    border: `1px solid #f5f5f5`,
    borderRadius: 10,
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
  btDisabled: {
    opacity: 0.5,
  },
  mt20: { marginTop: "20px" },
  mb20: {
    marginBottom: "20px",
  },
  col: {
    maxWidth: "33.3333%",
    minWidth: "33.3333%",
    padding: 10,
  },
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
  const [urlsCompleted, setCompleted] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [administrativos, setAdministrativos] = useState([]);
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const storage = firebase.storage();
  const [show, setShow] = useState(false);
  const [urlView, setUrl] = useState("");
  const [titleModal, setTitle] = useState("");
  const [cboxes, setCBoxes] = useState([]);
  const [type, setType] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [disabledAdminDoc, setDisabledAdminDoc] = useState(true);
  const [docsToUpdate, setDocs] = useState([]);
  const [imageName, setImageName] = useState("");
  const [nameDoc, setNameDoc] = useState("");
  const [descDoc, setDescripcionDoc] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState("");
  const [selectedOption, setSelected] = useState("");
  const [cargoBt, setCargoBt] = useState(true);
  const [reload, setReload] = useState(false);
  const [cargos, setCargos] = useState([]);

  function reloadFinal() {
    setReload((prev) => !prev);
  }

  function setCargosData(querySnapshot) {
    querySnapshot.forEach((doc) => {
      const dataLista = doc.data().lista;
      const cargosLista = [];
      dataLista.forEach((c) => {
        cargosLista.push({
          value: c.nombre,
          label: c.nombre,
        });
      });
      setCargos(cargosLista);
      reloadFinal();
    });
  }

  function fetchCargos() {
    const query = db.collection("cargos");
    query.get().then((querySnapshot) => setCargosData(querySnapshot));
  }

  const handleChange = (selected) => {
    setCargoBt(false);
    setSelected(selected);
  };

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

  function updateCargo(querySnapshot) {
    querySnapshot.forEach((doc) => {
      db.collection("users")
        .doc(doc.id)
        .update({ cargo: selectedOption.label })
        .then(() => {
          reloadFinal();
        });
    });
  }

  function toSearchEmail() {
    docFunctions
      .updateAdminDocs(db, locData, nameDoc, descDoc)
      .then((res) => {
        setAdministrativos(res);
        reloadFinal();
      })
      .catch((e) => {
        toast(`Ocurrió un error.${e}`);
      });
  }

  function uploadFile() {
    setDisabled(true);
    docFunctions
      .uploadFile(storage, file, locData, nameDoc)
      .then(() => {
        toSearchEmail();
      })
      .catch((e) => {
        toast(`Ocurrió un error.${e}`);
      });
  }

  function editCargo() {
    const query = db
      .collection("users")
      .where("fullname", "==", locData.fullname);
    query.get().then((querySnapshot) => updateCargo(querySnapshot));
  }

  function updatePendientes() {
    setDisabled(true);
    docFunctions.setPendientes(db, docsToUpdate, locData).then((res) => {
      if (res === "listo") {
        reloadFinal();
      } else {
        setDisabled(false);
      }
    });
  }

  function setImage(fileSelected) {
    setFile(fileSelected);
  }

  function setName(e) {
    setNameDoc(e);
    if (e !== "" && descDoc !== "") {
      setDisabledAdminDoc(false);
    } else {
      setDisabledAdminDoc(true);
    }
  }

  function setDescripcion(e) {
    setDescripcionDoc(e);
    if (e !== "" && descDoc !== "") {
      setDisabledAdminDoc(false);
    } else {
      setDisabledAdminDoc(true);
    }
  }

  function setURLS(arrayUrls) {
    setCompleted(arrayUrls[0]);
    setPendientes(arrayUrls[1]);
    setAdministrativos(arrayUrls[2]);
    docFunctions.setCheckboxes(db, arrayUrls).then((chboxes) => {
      setCBoxes(chboxes);
    });
  }

  function getURLS(docArray) {
    docFunctions
      .getDownloadURLS(storage, docArray, locData)
      .then((arrayUrls) => {
        setURLS(arrayUrls);
      });
  }

  function getDocs() {
    docFunctions.getAllDocs(db, locData).then((docArray) => {
      getURLS(docArray);
    });
  }

  useEffect(() => {
    getDocs();
    fetchCargos();
  }, []);

  useEffect(() => {}, [reload]);

  return (
    <div>
      <ToastContainer />
      <div className={classes.container}>
        <div className="cardDashboard pt10">
          <div className="row" />
          <b>Nombre</b>
          <p>{locData.fullname}</p>
          <b>RFC</b>
          <p>{locData.rfc}</p>
          <b>Email</b>
          <p>{locData.email}</p>
          <b>Cargo</b>
          <p>{locData.cargo}</p>
          <b>Onboarding</b>
          {locData.onboarding ? <div>Listo</div> : <div>Pendiente</div>}
          <p />
          <p>
            <b>Documentos Completados</b>
          </p>
          {urlsCompleted.length && (
            <div>
              <Row className={classes.rowDocs}>
                {urlsCompleted.map((url) => (
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
                      className={
                        url.url !== "404"
                          ? `${classes.containerPendiente} ${classes.pointer}`
                          : `${classes.container} ${classes.pointer}`
                      }
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
            <b>Solicitar Documentos</b>
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
            className={disabled ? global.initBtDisabled : global.initBt}
            disabled={disabled}
          >
            Solicitar Documentos
          </button>
          <p className={classes.mt20}>
            <b>Documentos Administrativos</b>
          </p>
          <div>
            <Row className={classes.rowDocs}>
              {administrativos.map((url) => (
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
          <Row>
            <Col>
              <div className="formGroup">
                <label htmlFor="email" className="block pb10">
                  Nombre del Documento
                </label>
                <input
                  type="email"
                  id="email"
                  className={classes.inputStyle}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </Col>
            <Col>
              {" "}
              <div className="formGroup">
                <label htmlFor="email" className="block pb10">
                  Descripción
                </label>
                <input
                  type="text"
                  id="name"
                  className={classes.inputStyle}
                  onChange={(event) => setDescripcion(event.target.value)}
                />
              </div>
            </Col>
          </Row>
          <input
            type="file"
            accept="image/png, image/jpeg, application/pdf"
            className={classes.mt20}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
          <button
            type="button"
            onClick={() => uploadFile()}
            className={disabledAdminDoc ? global.initBtDisabled : global.initBt}
            disabled={disabledAdminDoc}
          >
            Agregar Documento
          </button>
          <p className={classes.mt20}>
            <b>Editar cargo</b>
          </p>
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={cargos}
          />
          <button
            type="button"
            onClick={() => editCargo()}
            className={cargoBt ? global.initBtDisabled : global.initBt}
            disabled={cargoBt}
          >
            Cambiar Cargo
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
