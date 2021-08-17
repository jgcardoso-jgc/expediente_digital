/* eslint-disable quotes */
import React from "react";
import { Row } from "simple-flexbox";
import { createUseStyles, useTheme } from "react-jss";
import logo from "../../assets/logo.png";

const useStyles = createUseStyles(() => ({
  container: {
    marginLeft: 32,
    marginRight: 32,
  },
  title: {
    color: "#A4A6B3",
    opacity: 0.7,
    marginLeft: 12,
    fontSize: 17,
  },
  logo: {
    width: "20px",
  },
}));

function LogoComponent() {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <Row className={classes.container} horizontal="center" vertical="center">
      <img alt="logo" className={classes.logo} src={logo} />
      <span className={classes.title}>Expediente</span>
    </Row>
  );
}

export default LogoComponent;
