/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useContext } from "react";
import { string } from "prop-types";
import { useHistory } from "react-router-dom";
import { Row } from "simple-flexbox";
import { createUseStyles, useTheme } from "react-jss";
import firebase from "firebase";
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
  function logOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("logged out");
        localStorage.removeItem("admin");
        localStorage.removeItem("user");
      });
  }
  const { push } = useHistory();
  const { currentItem } = useContext(SidebarContext);
  const theme = useTheme();
  const classes = useStyles({ theme });

  let title;
  switch (true) {
    case currentItem === SLUGS.dashboard:
      title = "Dashboard";
      break;
    case currentItem === SLUGS.perfil:
      title = "Perfil";
      break;
    case currentItem === SLUGS.documentos:
      title = "Documentos";
      break;
    case currentItem === SLUGS.settings:
      title = "Ajustes";
      break;
    case currentItem === SLUGS.alerts:
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
              <span className={classes.name}>User</span>
              <img
                src="https://avatars.githubusercontent.com/sofseguridata"
                alt="avatar"
                className={classes.avatar}
              />
            </>
          }
          options={[
            {
              label: "Settings",
              onClick: onSettingsClick,
            },
            {
              label: "Logout",
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
