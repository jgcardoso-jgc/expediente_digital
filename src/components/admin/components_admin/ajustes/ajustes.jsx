/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
import { useFirebaseApp } from 'reactfire';
import { createUseStyles } from 'react-jss';
import { ToastContainer, toast } from 'react-toastify';
import { Row, Col } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import Table from '../table/table';

const useStyles = createUseStyles({
  text: {
    padding: 0
  },
  card: {
    background: '#f5f5f5',
    padding: '10px',
    borderRadius: '10px',
    WebkitBoxShadow: '0px 8px 15px 3px #D1D1D1',
    boxShadow: '0px 8px 15px 3px #D1D1D1'
  },
  mt20: {
    marginTop: 20
  },
  addBt: {
    backgroundColor: 'rgb(75, 75, 75)',
    color: 'white',
    border: '1px solid black',
    display: 'block',
    marginLeft: 'auto',
    minWidth: '150px',
    paddingTop: '10px',
    marginTop: '20px',
    paddingBottom: '10px',
    fontSize: '15px',
    borderRadius: '10px'
  },
  mt30: {
    marginTop: 30
  },
  inputStyle: {
    width: '100%',
    border: '0',
    borderBottom: '1px solid rgb(194, 194, 194)',
    fontSize: '16px',
    background: 'transparent'
  },
  title: {
    marginBottom: 30,
    marginTop: 10
  },
  editButton: {
    backgroundColor: '#cccccc',
    color: 'black',
    border: '0px solid black',
    display: 'block',
    marginRight: 0,
    minWidth: 40,
    padding: 8,
    fontSize: '15px',
    borderRadius: '10px'
  }
});

const AjustesAdmin = () => {
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [data, setData] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [disable, setDisable] = useState(false);
  const [name, setName] = useState('');
  const [cargo, setCargo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const classes = useStyles();
  const [reload, setReload] = useState(false);

  function handleClickEditRow() {}

  async function getData() {
    const query = db.collection('documentos');
    await query.get().then((querySnapshot) => {
      let dataGet = [];
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          dataGet = doc.data().lista;
        });
        setData(dataGet);
      }
    });
    const cargosquery = db.collection('cargos');
    await cargosquery.get().then((querySnapshot) => {
      let cargosGet = [];
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          cargosGet = doc.data().lista;
        });
        setCargos(cargosGet);
      }
    });
  }

  function submit() {
    setDisable(true);
    const collection = db.collection('documentos');
    collection.get().then((querySnapshot) => {
      let dataGet = [];
      let id = '';
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          dataGet = doc.data().lista;
          id = doc.id;
        });
        const transformed = descripcion.toLowerCase().replace(/\s/g, '');
        dataGet.push({
          nombre: name,
          descripcion: transformed,
          nombreImagen: 'test'
        });
        collection
          .doc(id)
          .update({ lista: dataGet })
          .then(() => {
            setName('');
            setDescripcion('');
            setDisable(false);
            setReload((prev) => !prev);
          })
          .catch(() => {});
      }
    });
  }

  function addCargo() {
    setDisable(true);
    let dataGet = [];
    const query = db.collection('cargos');
    query.get().then((querySnapshot) => {
      let id = '';
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          dataGet = doc.data().lista;
          id = doc.id;
        });
        dataGet.push({ nombre: cargo });
        db.collection('cargos')
          .doc(id)
          .update({ lista: dataGet })
          .then(() => {
            setDisable(false);
            setCargo('');
            setReload((prev) => !prev);
          })
          .catch((e) => {
            toast(e.message);
          });
      }
    });
  }

  useEffect(() => {
    getData();
  }, [reload]);

  return (
    <div>
      <ToastContainer />
      <div className="container">
        <div>
          <div className="row" />
          <div>
            {data.length > 0 ? (
              <div>
                <div>
                  <p className={classes.title}>
                    <b>Lista de Documentos</b>
                  </p>
                  <Table
                    columns={[
                      {
                        Header: 'Nombre',
                        accessor: 'nombre'
                      },
                      {
                        Header: 'Nombre en BD',
                        accessor: 'nombreImagen'
                      },
                      {
                        Header: 'Descripcion',
                        accessor: 'descripcion'
                      },
                      {
                        Header: 'Editar',
                        accessor: 'fullName',
                        Cell: (cellObj) => (
                          <div>
                            <button
                              type="button"
                              className={classes.editButton}
                              onClick={() => handleClickEditRow(cellObj)}
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )
                      }
                    ]}
                    data={data}
                  />
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
          <div>
            {cargos.length > 0 ? (
              <div className={classes.mt30}>
                <p className={`${classes.title} ${classes.mt20}`}>
                  <b>Lista de Cargos</b>
                </p>
                <div>
                  <Table
                    columns={[
                      {
                        Header: 'Nombre',
                        accessor: 'nombre'
                      },
                      {
                        Header: 'Editar',
                        accessor: 'fullName',
                        Cell: (cellObj) => (
                          <div>
                            <button
                              type="button"
                              className={classes.editButton}
                              onClick={() => handleClickEditRow(cellObj)}
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )
                      }
                    ]}
                    data={cargos}
                  />
                </div>
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
                    type="text"
                    id="email"
                    value={name}
                    className={classes.inputStyle}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
              </Col>
              <Col>
                {' '}
                <div className="formGroup">
                  <label htmlFor="email" className="block pb10">
                    Descripción
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={descripcion}
                    className={classes.inputStyle}
                    onChange={(event) => setDescripcion(event.target.value)}
                  />
                </div>
              </Col>
            </Row>
            <button
              type="button"
              className={classes.addBt}
              disabled={disable}
              onClick={() => submit()}
            >
              Agregar Documento
            </button>
          </div>
          <div className={`${classes.card} ${classes.mt20}`}>
            <p>
              <b>Agregar Cargo</b>
            </p>
            <Row>
              <Col>
                <div>
                  <label className="block pb10">Nombre del Cargo</label>
                  <input
                    type="text"
                    className={classes.inputStyle}
                    onChange={(event) => setCargo(event.target.value)}
                  />
                </div>
              </Col>
            </Row>
            <button
              type="button"
              className={classes.addBt}
              disabled={disable}
              onClick={() => addCargo()}
            >
              Agregar Cargo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjustesAdmin;

/*
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

*/
