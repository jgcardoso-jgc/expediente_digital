/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import { createUseStyles } from "react-jss";
import { Table } from "react-bootstrap";

const useStyles = createUseStyles({
  text: {
    padding: 0,
  },
});

const AjustesAdmin = () => {
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [data, setData] = useState([]);
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="container max500">
        <div className="cardDashboard pt10">
          <div className="row" />
          <div>
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
        </div>
      </div>
    </div>
  );
};

export default AjustesAdmin;
