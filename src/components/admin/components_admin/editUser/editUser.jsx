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
  console.log(location);
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
  const [show, setShow] = useState(false);
  const [urlView, setUrl] = useState("");

  function handleShow(url) {
    console.log("clicked");
    setUrl(url.url);
    setShow(true);
    console.log(show);
  }

  async function getState() {
    const docs = ["croppedFrontID", "croppedBackID"];
    const urls = [];
    const promises = [];
    const email = locData.email;
    docs.forEach((doc) => {
      const route = `users/${email}/${doc}`;
      promises.push(
        db
          .ref(route)
          .getDownloadURL()
          .then((response) => {
            urls.push({ url: response, title: doc });
            console.log("founded");
          })
          .catch((err) => {
            console.log(`not founded${err}`);
            urls.push({ url: "404", title: "No se encontró" });
          })
      );
    });
    await Promise.all(promises).then(() => {
      console.log("all resolved");
      console.log(urls);
      setUrls(urls);
    });
  }

  useEffect(() => {
    getState();
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
            <b>Documentos</b>
          </p>
          {documentos.map((doc) => (
            <label className={classes.checkbox}>
              <input type="checkbox" checked={doc.state ? "checked" : ""} />
              {doc.name}
            </label>
          ))}
          {urlDocs.length && (
            <div>
              <Row className={classes.rowDocs}>
                {urlDocs.map((url) => (
                  <Col className={classes.col}>
                    <div
                      className={`${classes.container} ${classes.pointer}`}
                      key={url}
                      onKeyPress={() => handleShow(url)}
                      onClick={() => handleShow(url)}
                    >
                      <p className={classes.center}>{url.title}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
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
