/* eslint-disable quotes */
import React from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useHistory } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import convertSlugToUrl from "../../resources/utilities";
import SLUGS from "../../resources/slugs";
import {
  IconContacts,
  IconLogout,
  IconSettings,
  IconSubscription,
} from "../../assets/icons";
import LogoComponent from "./LogoComponent";
import Menu from "./MenuComponent";
import MenuItem from "./MenuItemComponent";

const useStyles = createUseStyles({
  separator: {
    borderTop: () => `1px solid black`,
    marginTop: 16,
    marginBottom: 16,
    opacity: 0.06,
  },
});

function SidebarComponent() {
  const { push } = useHistory();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const isMobile = window.innerWidth <= 1080;

  async function logout() {
    push(SLUGS.login);
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
        id={SLUGS.contacts}
        title="Usuarios"
        icon={IconContacts}
        onClick={() => onClick(SLUGS.contacts)}
      />
      <MenuItem
        id={SLUGS.alertas}
        title="Alertas"
        icon={FaBell}
        onClick={() => onClick(SLUGS.alertas)}
      />
      <div className={classes.separator} />
      <MenuItem
        id={SLUGS.settings}
        title="Ajustes"
        icon={IconSettings}
        onClick={() => onClick(SLUGS.settings)}
      />

      <MenuItem id="logout" title="Salir" icon={IconLogout} onClick={logout} />
    </Menu>
  );
}

export default SidebarComponent;
