/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import { createUseStyles } from "react-jss";
import { Row, Col, Table } from "react-bootstrap";
import styles from "../../../../resources/theme";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles({
  text: {
    padding: 0,
  },
  card: {
    background: "#f5f5f5",
    padding: "10px",
    borderRadius: "10px",
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
  },
  mt20: {
    marginTop: 20,
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
    background: "transparent",
  },
});

const AjustesAdmin = () => {
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [data, setData] = useState([]);
  const global = globalTheme();
  const [disable, setDisable] = useState(false);
  const [name, setName] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const classes = useStyles();

  async function getData() {
    const query = db.collection("documentos");
    await query.get().then((querySnapshot) => {
      let dataGet = [];
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          dataGet = doc.data().lista;
        });
        setData(dataGet);
      }
    });
  }

  function submit() {
    setDisable(true);
    const query = db.collection("documentos");
    query.get().then((querySnapshot) => {
      let dataGet = [];
      let id = "";
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          dataGet = doc.data().lista;
          id = doc.id;
        });
        dataGet.push({ nombre: name, descripcion, nombreImagen: "test" });
        db.collection("documentos")
          .doc(id)
          .update({ lista: dataGet })
          .then(() => {
            window.location.reload();
          })
          .catch((e) => {
            console.log(e.message);
          });
      }
    });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="container">
        <div className="cardDashboard pt10">
          <div className="row" />
          <div className={classes.card}>
            {data.length > 0 ? (
              <div>
                <p>
                  <b>Lista de Documentos</b>
                </p>
                <Table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Nombre en BD</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((doc) => (
                      <tr>
                        <td>
                          <p className={classes.text} key={doc.nombreImagen}>
                            {doc.nombre}
                          </p>
                        </td>
                        <td>
                          <p
                            className={classes.text}
                            key={`${doc.nombreImagen}i`}
                          >
                            {doc.nombreImagen}
                          </p>
                        </td>
                        <td>
                          <p
                            className={classes.text}
                            key={`${doc.nombreImagen}i`}
                          >
                            {doc.descripcion}
                          </p>
                        </td>
                        <td>0</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
          <div className={`${classes.card} ${classes.mt20}`}>
            <p>
              <b>Agregar Documento</b>
            </p>
            <Row>
              <Col>
                <div>
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
            <button
              type="button"
              className={global.initBt}
              disabled={disable}
              onClick={() => submit()}
            >
              Agregar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjustesAdmin;
