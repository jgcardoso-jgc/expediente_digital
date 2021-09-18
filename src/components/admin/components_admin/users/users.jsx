/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import { useFirebaseApp } from "reactfire";
import { createUseStyles } from "react-jss";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import TableView from "../table/tableView";

const useStyles = createUseStyles({
  editButton: {
    border: "1px solid transparent",
    background: "#d0d0d0",
    borderRadius: "4px",
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
    background: "transparent",
  },
  addBt: {
    backgroundColor: "rgb(75, 75, 75)",
    color: "white",
    border: "1px solid black",
    display: "block",
    marginLeft: "auto",
    minWidth: "150px",
    paddingTop: "10px",
    marginTop: "20px",
    paddingBottom: "10px",
    fontSize: "15px",
    borderRadius: "10px",
  },
  card: {
    background: "#f5f5f5",
    padding: "10px",
    borderRadius: "10px",
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
  },
  userDiv: {
    marginTop: "40px",
  },
  mt20: {
    marginTop: 20,
  },
  pb10: {
    paddingBottom: 10,
  },
});

const UserView = () => {
  const classes = useStyles();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(false);
  const [name, setName] = useState("");
  const [reload, setReload] = useState(false);
  const [selectedOption, setSelected] = useState("");
  const [cargos, setCargos] = useState([]);

  function fetchCargos() {
    const query = db.collection("cargos");
    query.get().then((querySnapshot) => {
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
        setReload((prev) => !prev);
      });
    });
  }

  async function submit() {
    try {
      if (email !== "") {
        setDisable(true);
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, "test123")
          .then((res) => {
            const id = res.user.uid;
            const jsonRegister = {
              uid: id,
              fullname: name,
              email,
              rfc: "",
              token: "",
              onboarding: false,
              cargo: "",
              docsAdmin: [],
              documents: [],
            };
            try {
              db.collection("users")
                .add(jsonRegister)
                .then(() => {
                  setReload((prev) => !prev);
                });
            } catch (error) {
              toast(error.message);
            }
          })
          .catch((error) => {
            toast(error.message);
          });
      }
    } catch (e) {
      setDisable(false);
    }
  }

  const handleChange = (selected) => {
    setSelected(selected);
  };

  useEffect(() => {
    fetchCargos();
  }, []);

  useEffect(() => {}, [reload]);

  return (
    <div>
      <TableView />
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
          <button
            type="button"
            className={classes.addBt}
            disabled={disable}
            onClick={() => submit()}
          >
            Agregar Usuario
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserView;
