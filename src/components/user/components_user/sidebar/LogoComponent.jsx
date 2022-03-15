/* eslint-disable quotes */
import React from "react";
import { Row } from "simple-flexbox";
import { Link } from "react-router-dom";
import { createUseStyles, useTheme } from "react-jss";
import logo from "../../assets/logo.png";

const useStyles = createUseStyles(() => ({
  container: {
    marginLeft: 32,
    marginRight: 32
  },
  title: {
    color: "#A4A6B3",
    opacity: 0.7,
    marginLeft: 12,
    fontSize: 18
  },
  logo: {
    width: "20px"
  }
}));

function LogoComponent() {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <Link to="/dashboard">
      <Row className={classes.container} horizontal="center" vertical="center">
        <img alt="logo" className={classes.logo} src={logo} />
        <span className={classes.title}>
          <b>ONE</b>
          Seguridata
        </span>
      </Row>
    </Link>
  );
}

export default LogoComponent;
