/* eslint-disable quotes */
import React from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useHistory } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import convertSlugToUrl from "../../resources/utilities";
import SLUGS from "../../resources/slugs";
import {
  IconContacts,
  IconLogout,
  IconSettings,
  IconSubscription,
  IconTickets,
} from "../../assets/icons";
import LogoComponent from "./LogoComponent";
import Menu from "./MenuComponent";
import MenuItem from "./MenuItemComponent";

const useStyles = createUseStyles({
  separator: {
    borderTop: ({ theme }) => `1px solid ${theme.color.lightGrayishBlue}`,
    marginTop: 16,
    marginBottom: 16,
    opacity: 0.06,
  },
});

function SidebarComponent() {
  const firebase = useFirebaseApp();
  const { push } = useHistory();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const isMobile = window.innerWidth <= 1080;

  function logOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("admin");
        localStorage.removeItem("user");
      });
  }

  function onClick(slug, parameters = {}) {
    push(convertSlugToUrl(slug, parameters));
  }

  return (
    <Menu isMobile={isMobile}>
      <div style={{ paddingTop: 30, paddingBottom: 30 }}>
        <LogoComponent />
      </div>
      <MenuItem
        id={SLUGS.dashboard}
        title="Dashboard"
        icon={IconSubscription}
        onClick={() => onClick(SLUGS.dashboard)}
      />
      <MenuItem
        id={SLUGS.perfil}
        title="Perfil"
        icon={IconTickets}
        onClick={() => onClick(SLUGS.perfil)}
      />
      <MenuItem
        id={SLUGS.documentos}
        title="Documentos"
        icon={IconContacts}
        onClick={() => onClick(SLUGS.documentos)}
      />
      <div className={classes.separator} />
      <MenuItem
        id={SLUGS.settings}
        title="Ajustes"
        icon={IconSettings}
        onClick={() => onClick(SLUGS.settings)}
      />

      <MenuItem
        id="logout"
        title="Logout"
        icon={IconLogout}
        onClick={() => logOut()}
      />
    </Menu>
  );
}

export default SidebarComponent;
