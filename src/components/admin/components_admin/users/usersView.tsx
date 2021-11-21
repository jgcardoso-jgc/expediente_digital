/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState, useEffect, useRef } from "react";
import { useFirebaseApp } from "reactfire";
import Row from "react-bootstrap/Row";
import { useLocation, useHistory } from "react-router-dom";
import Col from "react-bootstrap/Col";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { fetchCargos, sendWelcomeEmail } from "./usersController";
import TableView from "../table/tableView";
import { docs, cargosLista } from "./usersModel";
import {
  rfcValido, submit, loginUser, uploadData,
} from "./registerController";
import useStyles from "./usersStyles";

const UserView = () => {
  const history = useHistory();
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

  function navigate(jsonRegister) {
    localStorage.setItem("user", JSON.stringify(jsonRegister));
    history.push("/dashboard");
  }

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

  const upload = (res) => {
    uploadData(res, email, name, rfc, password, db).then((json) => {
      sendWelcomeEmail(email).then(() => {
        toast("Usuario registrado");
        navigate(json);
      })
        .catch((e) => {
          setDisabled(false);
          toast(e);
        });
    });
  };

  const login = () => {
    loginUser(email, password, auth).then((res) => {
      upload(res);
    }).catch((e) => {
      toast(e);
    });
  };

  const submitUser = () => {
    if (email !== "") {
      setDisabled(true);
      setLoading(true);
      // submit to SOAP
      submit(email, password, name, rfc).then(() => {
        // submit firebase
        login();
      }).catch((e) => {
        toast(e);
        setLoading(false);
        setDisabled(false);
      });
    }
  };

  const handleChange = (selected) => {
    setSelected(selected);
  };

  useEffect(() => {
    fetchCargos(db).then((res) => {
      const lista : cargosLista[] = res;
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
                onClick={submitUser}
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
