/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useContext, useEffect, useState } from "react";
import { string } from "prop-types";
import { useHistory } from "react-router-dom";
import { Row } from "simple-flexbox";
import { createUseStyles } from "react-jss";
import { useFirebaseApp } from "reactfire";
import SLUGS from "../../resources/slugs";
import { SidebarContext } from "../../hooks/useSidebar";
import DropdownComponent from "../../../shared/dropdown/DropdownComponent";
import { IconBell } from "../../assets/icons";
import AlertComponent from "../alerts/AlertComponent";

const useStyles = createUseStyles(() => ({
  avatar: {
    height: 35,
    width: 35,
    minWidth: 35,
    borderRadius: 50,
    marginLeft: 14,
    border: "1px solid #DFE0EB",
    "@media (max-width: 768px)": {
      marginLeft: 14,
    },
  },
  container: {
    height: 40,
  },
  name: {
    textAlign: "right",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  separator: {
    borderLeft: "1px solid #DFE0EB",
    marginLeft: 32,
    marginRight: 32,
    height: 32,
    width: 2,
    "@media (max-width: 768px)": {
      marginLeft: 14,
      marginRight: 0,
    },
  },
  title: {
    "@media (max-width: 1080px)": {
      marginLeft: 50,
    },
    "@media (max-width: 468px)": {
      fontSize: 20,
    },
  },
  iconStyles: {
    cursor: "pointer",
    marginLeft: 25,
    "@media (max-width: 768px)": {
      marginLeft: 12,
    },
  },
}));

function HeaderComponent() {
  const firebase = useFirebaseApp();
  const db = firebase.storage();
  const [urlProfile, setUrlProfile] = useState(
    "https://cdn.iconscout.com/icon/free/png-256/user-1648810-1401302.png"
  );
  function logOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("admin");
        localStorage.removeItem("user");
        localStorage.removeItem("profilepic");
        localStorage.removeItem("sign-user");
        localStorage.removeItem("reload");
      });
  }
  const { push } = useHistory();
  const { currentItem } = useContext(SidebarContext);
  const [user, setUser] = useState("");
  const classes = useStyles();

  let title;
  switch (true) {
    case currentItem === SLUGS.dashboard:
      title = "Dashboard";
      break;
    case currentItem === SLUGS.perfil:
      title = "Perfil";
      break;
    case currentItem === SLUGS.documentos:
      title = "Expediente";
      break;
    case currentItem === SLUGS.settings:
      title = "Ajustes";
      break;
    case currentItem === SLUGS.alerts:
      title = "Alertas";
      break;
    case currentItem === SLUGS.sign:
      title = "SeguriSign";
      break;
    case currentItem === SLUGS.subirDocumentos:
      title = "Subir Documento";
      break;
    case currentItem === SLUGS.verificar:
      title = "Verificar Correo";
      break;
    case currentItem === SLUGS.registerSign:
      title = "Regístrate en Segurisign";
      break;
    default:
      title = "";
  }

  function onSettingsClick() {
    push(SLUGS.settings);
  }

  function exists(response) {
    setUrlProfile(response);
    localStorage.setItem("profilepic", response);
  }

  function notExists() {
    console.log("not exists");
  }

  function getState() {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (localStorage.getItem("profilepic") === null) {
      const route = `users/${userInfo.email}/croppedFace`;
      db.ref(route)
        .getDownloadURL()
        .then((response) => {
          exists(response);
        })
        .catch(() => {
          notExists();
        });
    } else {
      const url = localStorage.getItem("profilepic");
      exists(url);
    }
  }

  useEffect(() => {
    const userGet = localStorage.getItem("user");
    setUser(JSON.parse(userGet));
    getState();
  }, []);

  return (
    <Row
      className={classes.container}
      vertical="center"
      horizontal="space-between"
    >
      <span className={classes.title}>
        {" "}
        <h4>
          <b>{title}</b>
        </h4>
      </span>
      <Row vertical="center">
        <div className={classes.iconStyles}>
          <AlertComponent
            label={<IconBell />}
            position={{
              top: 42,
              right: -14,
            }}
          />
        </div>
        <div className={classes.separator} />
        <DropdownComponent
          label={
            <>
              <span className={classes.name}>{user.fullName}</span>
              <img src={urlProfile} alt="avatar" className={classes.avatar} />
            </>
          }
          options={[
            {
              label: "Ajustes",
              onClick: onSettingsClick,
            },
            {
              label: "Salir",
              onClick: () => logOut(),
            },
          ]}
          position={{
            top: 52,
            right: -6,
          }}
        />
      </Row>
    </Row>
  );
}

HeaderComponent.propTypes = {
  title: string,
};

export default HeaderComponent;
