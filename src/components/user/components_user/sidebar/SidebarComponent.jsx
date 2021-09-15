/* eslint-disable quotes */
import React, { useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useHistory } from "react-router-dom";
import { BiUserCircle } from "react-icons/bi";
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
    borderTop: "1px solid #F7F8FC",
    marginTop: 16,
    marginBottom: 16,
    opacity: 0.06,
  },
});

function SidebarComponent() {
  const { push } = useHistory();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [open, setOpen] = useState(false);
  const isMobile = window.innerWidth <= 1080;

  function onClick(slug, parameters = {}) {
    setOpen(false);
    push(convertSlugToUrl(slug, parameters));
  }

  return (
    <Menu open={open} isMobile={isMobile}>
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
        icon={BiUserCircle}
        onClick={() => onClick(SLUGS.perfil)}
      />
      <MenuItem
        id={SLUGS.documentos}
        title="Expediente"
        icon={IconContacts}
        onClick={() => onClick(SLUGS.documentos)}
      />
      <MenuItem
        id={SLUGS.sign}
        title="SeguriSign"
        icon={FaSignature}
        onClick={() => onClick(SLUGS.sign)}
      />
      <div className={classes.separator} />
      <MenuItem
        id={SLUGS.alerts}
        title="Alertas"
        icon={FaBell}
        onClick={() => onClick(SLUGS.alerts)}
      />
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
