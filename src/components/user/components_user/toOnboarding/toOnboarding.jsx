/* eslint-disable quotes */
import React, { useEffect } from 'react';
import { useLocation, Link, useHistory } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import './toOnboarding.css';

const useStyles = createUseStyles({
  mrAuto: {
    marginRight: 'auto'
  },
  title: {
    marginBottom: 20
  },
  button: {
    color: 'white',
    border: '1px solid black',
    fontSize: 15,
    minWidth: 150,
    marginTop: 0,
    marginLeft: 'auto',
    paddingTop: 10,
    borderRadius: 10,
    paddingBottom: 10,
    backgroundColor: 'rgb(75, 75, 75)',
    marginBottom: 20
  }
});

const ToOnBoarding = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const { state } = location;
    if (state.reload === true) {
      history.replace({ pathname: '/toOnboarding', state: {} });
      window.location.reload();
    }
  }, [history, location]);

  return (
    <div className="center">
      <h1 className={classes.title}>No estás registrado</h1>
      <p className="wtext">
        Tu rostro aun
        <b> no se encuentra </b>
        en la base de datos, o tu fotografía
        <b> es muy borrosa.</b>
      </p>
      <Link to="/onboard">
        <button
          style={{ display: 'inline-block' }}
          className={classes.button}
          type="button"
        >
          Iniciar registro
        </button>
      </Link>
      <p>también puedes intentarlo de nuevo</p>
      <button
        onClick={() => history.goBack()}
        style={{ display: 'inline-block' }}
        className={classes.button}
        type="button"
      >
        Intentar de nuevo
      </button>
    </div>
  );
};

export default ToOnBoarding;
