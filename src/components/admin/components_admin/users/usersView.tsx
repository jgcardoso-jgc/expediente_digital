/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
/* eslint-disable object-curly-newline */
import React, { useState, useEffect, useRef } from "react";
import { useFirebaseApp } from "reactfire";
import Row from "react-bootstrap/Row";
import { useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { fetchCargos } from "./usersController";
import TableView from "./table/tableView";
import { docs, cargosLista } from "./usersModel";
import {
  rfcValido, createUserExpediente
} from "./registerController";
import useStyles from "./usersStyles";

const UserView = () => {
  const classes = useStyles();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const auth = firebase.auth();
  const location = useLocation();
  const [rfc, setRfc] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const rfcText = useRef<HTMLElement>();
  let docsNumber = 0;
  if (location.state != null) {
    const state = location.state as docs;
    docsNumber = state.docs;
  }
  const password = "OneSeguridata2021!";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reload, setReload] = useState(false);
  const [selectedOption, setSelected] = useState("");
  const [cargos, setCargos] = useState({});

  function testRFC(value) {
    if (rfcText.current) {
      if (rfcValido(value)) {
        rfcText.current.innerHTML = 'Válido';
        rfcText.current.style.color = 'green';
        setRfc(value);
      } else {
        rfcText.current.innerHTML = 'No válido';
        rfcText.current.style.color = 'red';
        setRfc('');
      }
    }
  }

  const createNewUser = async () => {
    try {
      if (email !== "") {
        setDisabled(true);
        setLoading(true);
        const json: any = await createUserExpediente({ db, auth }, { email, name, rfc, password });
        if (json === 0) {
          toast('Usuario ya registrado');
          return;
        }
        if (json) {
          if (json.registradoSign) {
            toast("Usuario registrado");
            localStorage.setItem("user", JSON.stringify(json));
            // history.push("/dashboard");
          } else {
            toast("Usuario registrado");
            localStorage.setItem("user", JSON.stringify(json));
            // history.push("/dashboard");
          }
        }
        setLoading(false);
        setDisabled(false);
      }
    } catch (e) {
      toast((e as Error).message);
      setDisabled(false);
    }
  };

  const handleChange = (selected) => {
    setSelected(selected);
  };

  useEffect(() => {
    fetchCargos(db).then((res) => {
      const lista: cargosLista[] = res;
      setCargos(lista);
      setReload((prev) => !prev);
    });
  }, []);

  return (
    <div>
      {reload ? <TableView docsNumber={docsNumber} /> : ""}
      <ToastContainer />
      <div className={classes.userDiv}>
        <div className={classes.card}>
          <h5>
            <b>Agregar Usuario</b>
          </h5>
          <Row>
            <Col md={6}>
              <div className="formGroup">
                <label htmlFor="email" className={classes.pb10}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  className={classes.inputStyle}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </Col>
            <Col md={6}>
              {" "}
              <div className="formGroup">
                <label className={classes.pb10}>Nombre Completo</label>
                <input
                  type="text"
                  id="name"
                  className={classes.inputStyle}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </Col>
            <Col md={6}>
              <label className={`${classes.mt10} ${classes.pb10}`}>Cargo</label>
              <Select
                value={selectedOption}
                onChange={handleChange}
                options={cargos}
              />
            </Col>
            <Col>
              <div className={`${classes.left} ${classes.pt10}`}>
                <label htmlFor="email" className={classes.pb10}>
                  RFC
                </label>
                <input
                  type="text"
                  id="rfc"
                  className={classes.inputStyle}
                  onChange={(event) => testRFC(event.target.value)}
                />
                <p className={classes.rfcText} ref={rfcText as React.RefObject<HTMLDivElement>} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className={classes.textDefecto}>Contraseña por defecto: OneSeguridata2021!</p>
            </Col>
            <Col>
              <button
                type="button"
                className={classes.addBt}
                disabled={disabled}
                onClick={createNewUser}
              >
                Agregar Usuario
              </button>
            </Col>
            <p>{loading ? "Cargando..." : ""}</p>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default UserView;
