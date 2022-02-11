/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { FaEdit } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import { useFirebaseApp } from "reactfire";
import styles from "../../../../resources/theme";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  cardDashboard: {
    background: "#f1f1f1",
    borderRadius: "10px",
    padding: "16px",
  },
  min80: {
    minWidth: "80%",
  },
  cambiarBt: {
    border: "1px solid black",
    background: "black",
    color: "white",
    borderRadius: 4,
    marginLeft: 20,
  },
  container: {
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  mb0: {
    marginBottom: 0,
  },
  ayudaText: {
    textAlign: "center",
    marginTop: 30,
  },
  linkMail: {
    textAlign: "center",
  },
  editBt: {
    border: "1px solid whitesmoke",
    background: "whitesmoke",
  },
  mr: { marginRight: "auto" },
}));

const AjustesUser = () => {
  const global = globalTheme();
  const classes = useStyles();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const user = JSON.parse(localStorage.getItem("user"));
  const [newCurp, setCurp] = useState("");
  const [hidden, setHidden] = useState(true);
  const [reload, setReload] = useState(false);
  const { uid } = firebase.auth().currentUser;
  const { rfc } = user;
  const { cargo } = user;
  const { curp } = user;
  const { email } = user;

  function showInputCURP() {
    setHidden((prev) => !prev);
  }
  function updateCURP() {
    const collection = db.collection("users");
    const query = collection.where("uid", "==", uid);
    query.get().then((querySnapshot) => {
      let id = "";
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          id = doc.id;
        });
        collection
          .doc(id)
          .update({ curp: newCurp })
          .then(() => {
            user.curp = newCurp;
            localStorage.setItem("user", JSON.stringify(user));
            setCurp("");
            setHidden((prev) => !prev);
            setReload((prev) => !prev);
          })
          .catch((e) => {
            console.log(e.message);
          });
      }
    });
  }

  useEffect(() => {}, [reload]);

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.container}>
          <div className={`${classes.cardDashboard} ${classes.mt20}`}>
            <p>
              <b>Información</b>
            </p>
            <p className={classes.mb0}>
              <b>UID</b>
            </p>
            <p>{uid}</p>
            <p className={classes.mb0}>
              <b>RFC</b>
            </p>
            <p>{rfc}</p>
            <p className={classes.mb0}>
              <b>Email</b>
            </p>
            <p>{email}</p>
            <p className={classes.mb0}>
              <b>Cargo</b>
            </p>
            <p>{cargo}</p>
            <Row>
              <Col className={classes.min80}>
                <p className={classes.mb0}>
                  <b>CURP</b>
                </p>
                <p>{curp != null ? curp : "Pendiente"}</p>
              </Col>
              <Col>
                <button
                  type="button"
                  className={classes.editBt}
                  onClick={() => showInputCURP()}
                >
                  <FaEdit />
                </button>
              </Col>
            </Row>
            <div>
              <input
                placeholder="Ingresa el nuevo CURP"
                type="text"
                hidden={hidden}
                onChange={(e) => setCurp(e.target.value)}
              />
              <button
                type="button"
                hidden={hidden}
                className={classes.cambiarBt}
                onClick={() => updateCURP()}
              >
                Cambiar
              </button>
            </div>
          </div>
        </div>
        <div>
          <button type="button" className={`${global.initBt} ${classes.mr}`}>
            Cambiar contraseña
          </button>
        </div>
        <div className={classes.ayudaText}>¿Necesitas ayuda?</div>
        <div className={classes.linkMail}>
          Envía un correo a{" "}
          <a href="admin@hotmail.com">
            <b>admin@hotmail.com</b>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AjustesUser;
