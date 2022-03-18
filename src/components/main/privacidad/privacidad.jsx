/* eslint-disable quotes */
import React from 'react';
import { createUseStyles } from 'react-jss';
import NavBarMainPage from '../navBarMainPage/navBarMainPage';

const useStyles = createUseStyles(() => ({
  mainDiv: {
    marginTop: 80
  },
  center: {
    textAlign: 'center'
  },
  container: {
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}));

const PrivacidadView = () => {
  const classes = useStyles();
  return (
    <div>
      <NavBarMainPage />
      <div className={classes.mainDiv}>
        <h1 className={classes.center}>Aviso de Privacidad</h1>
        <p className={classes.container}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>
  );
};
export default PrivacidadView;
