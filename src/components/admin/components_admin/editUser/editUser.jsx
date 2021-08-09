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
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import styles from "../../../../resources/theme";
import "bootstrap/dist/css/bootstrap.css";
import ModalEdit from "./modal";
import getState from "./getDocuments";
import { v4 as uuidv4 } from "uuid";
// import { toast } from "react-toastify";

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
  const documentos = [
    { name: "ID Frontal", state: false },
    { name: "ID reverso", state: false },
    { name: "RFC", state: false },
    { name: "Comprobante de Domicilio", state: false },
  ];
  const locData = location.state.objUser;
  const [urlDocs, setUrls] = useState([]);
  const firebase = useFirebaseApp();
  const db = firebase.storage();
  // const auth = firebase.auth();
  const [show, setShow] = useState(false);
  const [urlView, setUrl] = useState("");

  function handleShow(url) {
    setUrl(url.url);
    setShow(true);
  }

  function getDocs() {
    getState(db, locData).then((urls) => {
      console.log(urls);
      setUrls(urls);
    });
  }

  useEffect(() => {
    getDocs();
  }, []);

  return (
    <div>
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
                      onKeyPress={() => handleShow(url)}
                      key={uuidv4()}
                      onClick={() => handleShow(url)}
                    >
                      <p className={classes.center}>{url.title}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
          <p>
            <b>Documentos Pendientes</b>
          </p>
          <p>
            <b>Agregar Documentos</b>
          </p>
          {documentos.map((doc) => (
            <label className={classes.checkbox}>
              <input
                type="checkbox"
                checked={doc.state ? "checked" : ""}
                readOnly
              />
              {doc.name}
            </label>
          ))}
          <ModalEdit
            state={show}
            url={urlView}
            onClose={() => setShow(false)}
          />
          <button type="button" className={global.initBt}>
            Agregar Documentos
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
