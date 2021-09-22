/* eslint-disable quotes */
import React from "react";
import { createUseStyles, useTheme } from "react-jss";
import { Column, Row } from "simple-flexbox";
import { SidebarComponent, SidebarContext } from "../components_user/sidebar";
import HeaderComponent from "../components_user/header/HeaderComponent";
import PrivateRoutes from "./PrivateRoutes";

const useStyles = createUseStyles({
  container: {
    height: "100%",
  },
  mainBlock: {
    marginLeft: 255,
    padding: 30,
    "@media (max-width: 768px)": {
      marginLeft: 0,
    },
  },
  contentBlock: {
    marginTop: 54,
  },
  footer: {
    position: "relative",
    paddingTop: 20,
    bottom: 0,
    textAlign: "right",
  },
});

function PrivateSection() {
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <SidebarContext>
      <Row className={classes.container}>
        <SidebarComponent />
        <Column flexGrow={1} className={classes.mainBlock}>
          <HeaderComponent />
          <div className={classes.contentBlock}>
            <PrivateRoutes />
          </div>
          <div className={classes.footer}>
            <p>Seguridata 2021</p>
          </div>
        </Column>
      </Row>
    </SidebarContext>
  );
}

export default PrivateSection;
