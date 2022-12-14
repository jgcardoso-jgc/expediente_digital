/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-wrap-multilines */

/* eslint-disable quotes */
import React, { useContext, useEffect, useState } from "react";
import { string } from "prop-types";
import { useHistory } from "react-router-dom";
import { Row } from "simple-flexbox";
import { useFirebaseApp } from "reactfire";
import { createUseStyles, useTheme } from "react-jss";
import SLUGS from "../resources/slugs";
import AlertComponent from "../../admin/components_admin/alerts/AlertComponent";
import { SidebarContext } from "../hooks/useSidebar";
import DropdownComponent from "../dropdown/DropdownComponent";
import { IconBell } from "../../admin/assets/icons";

const useStyles = createUseStyles(() => ({
  avatar: {
    height: 35,
    width: 35,
    minWidth: 35,
    borderRadius: 50,
    marginLeft: 14,
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
    "@media (max-width: 768px)": {
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
  const { push } = useHistory();
  const { currentItem } = useContext(SidebarContext);
  const theme = useTheme();
  const classes = useStyles({ theme });
  const firebase = useFirebaseApp();
  const auth = firebase.auth();
  const [user, setUser] = useState("Admin");

  function logOut() {
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
    localStorage.removeItem("date");
    localStorage.removeItem("position");
    localStorage.removeItem("sign-user");
    localStorage.removeItem("profilepic");
    auth.signOut();
  }

  function getUserName() {
    const isAdmin = localStorage.getItem("admin");
    if (isAdmin === null) {
      const userGet = JSON.parse(localStorage.getItem("user"));
      const userName = userGet.fullName;
      setUser(userName);
    }
  }

  useEffect(() => {
    getUserName();
  }, []);

  let title;
  switch (true) {
    case currentItem === SLUGS.dashboard:
      title = "Dashboard";
      break;
    case [SLUGS.overview, SLUGS.overviewTwo, SLUGS.overviewThree].includes(
      currentItem
    ):
      title = "Overview";
      break;
    case currentItem === SLUGS.usuarios:
      title = "Usuarios";
      break;
    case currentItem === SLUGS.perfil:
      title = "Mi Perfil";
      break;
    case currentItem === SLUGS.editUser:
      title = "Editar Usuario";
      break;
    case currentItem === SLUGS.documentos:
      title = "Expediente";
      break;
    case currentItem === SLUGS.templates:
      title = "Plantillas";
      break;
    case currentItem === SLUGS.settings:
      title = "Ajustes";
      break;
    case currentItem === SLUGS.sign:
      title = "Segurisign";
      break;
    case currentItem === SLUGS.alertas:
      title = "Alertas";
      break;
    default:
      title = "";
  }

  function onSettingsClick() {
    push(SLUGS.settings);
  }

  return (
    <Row
      className={classes.container}
      vertical="center"
      horizontal="space-between"
    >
      <span className={classes.title}>
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
              <span className={classes.name}>{user}</span>
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/user-1648810-1401302.png"
                alt="avatar"
                className={classes.avatar}
              />
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
