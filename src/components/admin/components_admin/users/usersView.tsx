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
import { fetchCargos, sendWelcomeEmail, sendWelcomeEmailSign } from "./usersController";
import TableView from "../table/tableView";
import { docs, cargosLista } from "./usersModel";
import {
  rfcValido, createUserExpediente,
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
        console.log('createUserExpediente: \n', json);
        if (json) {
          if (json.registradoSign) {
            sendWelcomeEmailSign(email).then(() => {
              toast("Usuario registrado");
              localStorage.setItem("user", JSON.stringify(json));
              // history.push("/dashboard");
            });
          } else {
            sendWelcomeEmail(email).then(() => {
              toast("Usuario registrado");
              localStorage.setItem("user", JSON.stringify(json));
              // history.push("/dashboard");
            });
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
          <p>
            <b>Agregar Usuario</b>
          </p>
          <Row>
            <Col>
              <div className="formGroup">
                <label htmlFor="email" className="block pb10">
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
            <Col>
              {" "}
              <div className="formGroup">
                <label className="block pb10">Nombre Completo</label>
                <input
                  type="text"
                  id="name"
                  className={classes.inputStyle}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </Col>
          </Row>
          <label className={`${classes.mt20} ${classes.pb10}`}>Cargo</label>
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={cargos}
          />
          <div className={`${classes.left} ${classes.pt10}`}>
            <label htmlFor="email" className="block pb4">
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

/* const response = await fetch('http//localhost:5000/express_backend');
    const body = await response;

    if (response.status !== 200) {
      console.log("error");
    } else {
      console.log(`ok:${body}`);
    } */
