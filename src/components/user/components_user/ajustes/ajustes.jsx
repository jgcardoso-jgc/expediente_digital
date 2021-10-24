/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import React from "react";
import { createUseStyles } from "react-jss";
import styles from "../../../../resources/theme";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  cardDashboard: {
    background: "#f5f5f5",
    borderRadius: "10px",
    padding: "10px",
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
  },
  container: {
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  mb0: {
    marginBottom: 0,
  },
  ayudaText: {
    textAlign: "center",
    marginTop: 30,
  },
  linkMail: {
    textAlign: "center",
  },
  mr: { marginRight: "auto" },
}));

const AjustesUser = () => {
  const global = globalTheme();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem("user"));
  const { rfc } = user;
  const { cargo } = user;
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.container}>
          <div className={`${classes.cardDashboard} ${classes.mt20}`}>
            <p>
              <b>Editar Información</b>
            </p>
            <p className={classes.mb0}>
              <b>RFC</b>
            </p>
            <p>{rfc}</p>
            <p className={classes.mb0}>
              <b>Cargo</b>
            </p>
            <p>{cargo}</p>
          </div>
        </div>
        <div>
          <button type="button" className={`${global.initBt} ${classes.mr}`}>
            Cambiar contraseña
          </button>
        </div>
        <div className={classes.ayudaText}>¿Necesitas ayuda?</div>
        <div className={classes.linkMail}>
          Envía un correo a{" "}
          <a href="admin@hotmail.com">
            <b>admin@hotmail.com</b>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AjustesUser;
