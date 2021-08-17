/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import { createUseStyles } from "react-jss";
import uuid from "react-uuid";
import { FaFileAlt } from "react-icons/fa";
import { useHistory } from "react-router-dom";

const useStyles = createUseStyles(() => ({
  dropdownItemsContainer: {
    background: "white",
    border: "1px solid #DFE0EB",
    borderRadius: 7,
    minWidth: 250,
    padding: 0,
    WebkitBoxShadow: "0px 14px 28px 3px #CACACA",
    boxShadow: "0px 14px 28px 3px #CACACA",
    position: "absolute",
    width: "100%",
  },
  flex: {
    display: "flex",
    justifyContent: "center",
  },
  verTodas: {
    minWidth: "100%",
    color: "blue",
    textAlign: "center",
    background: "transparent",
    border: 0,
    fontSize: "14px",
  },
  circle: {
    height: "37px",
    minWidth: "37px",
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#4e73df",
    color: "white",
  },
  alertBt: {
    borderRadius: 10,
    border: "1px solid transparent",
    marginLeft: 10,
  },
}));

const AlertasPagina = () => {
  const history = useHistory();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [alerts, setAlerts] = useState([]);
  const classes = useStyles();

  function onItemClick(doc) {
    history.push({
      pathname: "/subir",
      state: { doc },
    });
  }

  async function appendAlerts() {
    const al = [];
    if (firebase.auth().currentUser.emailVerified) {
      console.log("verified");
    } else {
      console.log("not verified");
      al.push({ message: "No has confirmado tu correo", doc: "" });
    }
    const user = firebase.auth().currentUser;
    let uid = "";
    if (user) {
      uid = user.uid;
    }
    const query = db.collection("users").where("uid", "==", uid);
    await query.get().then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const docs = doc.data().documents;
          docs.forEach((states) => {
            if (!states.state && !states.uploaded) {
              al.push({
                message: `Sube el siguiente documento: ${states.name}`,
                doc: states.imageName,
              });
            }
          });
        });
      }
      setAlerts(al);
    });
  }

  useEffect(() => {
    appendAlerts();
  }, []);
  return (
    <div>
      <div className="container max500">
        {alerts.length > 0 && (
          <div>
            {alerts.map((projName) => (
              <div className={classes.flex}>
                <div className={classes.circle}>
                  <FaFileAlt />
                </div>
                <button
                  type="button"
                  key={uuid}
                  className={classes.alertBt}
                  onClick={() => onItemClick(projName.doc)}
                >
                  {projName.message}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertasPagina;
