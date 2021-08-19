/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable comma-dangle */
/* eslint-disable react/require-default-props */
/* eslint-disable quotes */
import React, { useState, useEffect, useRef } from "react";
import { useFirebaseApp } from "reactfire";
import { useHistory } from "react-router-dom";
import { number, shape } from "prop-types";
import { Column } from "simple-flexbox";
import uuid from "react-uuid";
import { createUseStyles, useTheme } from "react-jss";
import { FaFileAlt } from "react-icons/fa";

const useStyles = createUseStyles(() => ({
  arrowContainer: {
    position: "absolute",
    top: -19,
    right: 15,
  },
  dropdownButton: {
    alignItems: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    padding: 0,
    outline: "none",
  },
  dropdownContainer: {
    position: "relative",
  },
  flex: {
    display: "flex",
    padding: "10px 10px",
  },
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
    top: ({ position }) => position.top,
    right: ({ position }) => position.right,
    bottom: ({ position }) => position.bottom,
    left: ({ position }) => position.left,
    "& button:first-of-type:hover div > svg > path": {
      fill: "#DDE2FF",
    },
  },
  verTodas: {
    minWidth: "100%",
    color: "blue",
    textAlign: "center",
    background: "transparent",
    border: 0,
    fontSize: "14px",
  },
  alertTitle: {
    background: "#4e73df",
    minWidth: "100%",
    color: "white",
    padding: "10px 0px 4px 10px",
    borderTopLeftRadius: "7px",
    borderTopRightRadius: "7px",
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
  dropdownItem: {
    cursor: "pointer",
    background: "transparent",
    border: "none",
    fontSize: 14,
    outline: "none",
    textAlign: "left",
    "&:hover": {
      background: "#DDE2FF",
    },
    "&:after": {
      content: '" "',
      display: "block",
      position: "relative",
      bottom: -10,
      width: "100%",
      height: 1,
      background: "#DDE2FF",
    },
    "&:last-child:after": {
      content: "",
      display: "none",
    },
  },
}));

function AlertComponent({ position, label }) {
  const history = useHistory();
  const ref = useRef();
  const firebase = useFirebaseApp();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const theme = useTheme();
  const classes = useStyles({ theme, position });
  const db = firebase.firestore();
  const [alerts, setAlerts] = useState([]);

  function onDropdownClick() {
    setUserMenuOpen((prev) => !prev);
  }

  async function appendAlerts() {
    const al = [];
    if (firebase.auth().currentUser.emailVerified) {
      console.log("verified");
    } else {
      console.log("not verified");
      al.push({ message: "No has confirmado tu correo", doc: "" });
    }
    const query = db.collection("users").where("name", "!=", "");
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

  const handleClick = (e) => {
    if (ref.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setUserMenuOpen(false);
  };

  function verTodas() {
    history.push("/alertas");
    setUserMenuOpen(false);
  }

  function onItemClick(doc) {
    history.push({
      pathname: "/subir",
      state: { doc },
    });
    setUserMenuOpen(false);
  }

  useEffect(() => {
    appendAlerts();
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    console.log("reload");
  }, [alerts]);

  return (
    <div ref={ref}>
      <Column className={classes.dropdownContainer}>
        <button
          type="button"
          className={classes.dropdownButton}
          onClick={() => onDropdownClick()}
        >
          {label} <span>{alerts.length}</span>
        </button>
        {userMenuOpen && (
          <div style={{ listStyleType: "none" }}>
            <div>
              {alerts.length && (
                <Column className={classes.dropdownItemsContainer}>
                  <div className={classes.alertTitle}>Notificaciones</div>
                  {alerts.map((projName) => (
                    <div className={classes.flex}>
                      <div className={classes.circle}>
                        <FaFileAlt />
                      </div>
                      <button
                        type="button"
                        key={uuid}
                        className={classes.dropdownItem}
                        onClick={() => onItemClick(projName.doc)}
                      >
                        {projName.message}
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => verTodas()}
                    className={`${classes.verTodas}`}
                  >
                    Ver todas
                  </button>
                </Column>
              )}
            </div>
            <li className="sign-in" />
          </div>
        )}
      </Column>
    </div>
  );
}

AlertComponent.propTypes = {
  position: shape({
    top: number,
    right: number,
    bottom: number,
    left: number,
  }),
};

AlertComponent.defaultProps = {
  position: {
    top: 52,
    right: -6,
  },
};

export default AlertComponent;
