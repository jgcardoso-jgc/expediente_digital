/* eslint-disable quotes */
import React from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useHistory, Link } from "react-router-dom";
import { FaBell, FaSignature } from "react-icons/fa";
import convertSlugToUrl from "../../resources/utilities";
import SLUGS from "../../resources/slugs";
import {
  IconContacts,
  IconSettings,
  IconSubscription,
} from "../../assets/icons";
import LogoComponent from "./LogoComponent";
import Menu from "./MenuComponent";

import MenuItem from "./MenuItemComponent";

const useStyles = createUseStyles({
  separator: {
    borderTop: () => `1px solid white`,
    marginTop: 16,
    marginBottom: 16,
    opacity: 0.06,
  },
});

function SidebarComponent() {
  const { push } = useHistory();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const isMobile = window.innerWidth <= 768;

  function onClick(slug, parameters = {}) {
    push(convertSlugToUrl(slug, parameters));
  }

  return (
    <Menu isMobile={isMobile}>
      <Link to="/dashboard">
        <div style={{ paddingTop: 30, paddingBottom: 30 }}>
          <LogoComponent />
        </div>
      </Link>
      <MenuItem
        id={SLUGS.dashboard}
        title="Dashboard"
        icon={IconSubscription}
        onClick={() => onClick(SLUGS.dashboard)}
      />
      <MenuItem
        id={SLUGS.usuarios}
        title="Usuarios"
        icon={IconContacts}
        onClick={() => onClick(SLUGS.usuarios)}
      />
      <MenuItem
        id={SLUGS.alertas}
        title="Alertas"
        icon={FaBell}
        onClick={() => onClick(SLUGS.alertas)}
      />
      <MenuItem
        id={SLUGS.sign}
        title="SeguriSign"
        icon={FaSignature}
        onClick={() => onClick(SLUGS.sign)}
      />
      <div className={classes.separator} />
      <MenuItem
        id={SLUGS.settings}
        title="Ajustes"
        icon={IconSettings}
        onClick={() => onClick(SLUGS.settings)}
      />
    </Menu>
  );
}

export default SidebarComponent;
