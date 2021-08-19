/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState } from "react";
import { useFirebaseApp } from "reactfire";
import { createUseStyles } from "react-jss";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer, toast } from "react-toastify";
import TableView from "../table/tableView";
import styles from "../../../../resources/theme";

const globalTheme = createUseStyles(styles);
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
});

const UserView = () => {
  const classes = useStyles();
  const global = globalTheme();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(false);
  const [name, setName] = useState("");

  async function submit() {
    try {
      if (email !== "") {
        setDisable(true);
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, "seguridata11")
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
              documents: [],
            };
            try {
              db.collection("users")
                .add(jsonRegister)
                .then(() => {
                  window.location.reload();
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
                <label htmlFor="email" className="block pb10">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  className={classes.inputStyle}
                  onChange={(event) => setName(event.target.value)}
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
  );
};

export default UserView;
