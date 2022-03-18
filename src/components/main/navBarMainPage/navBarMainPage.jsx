/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable quotes */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { ReactComponent as CloseMenu } from '../../../assets/x.svg';
import { ReactComponent as MenuIcon } from '../../../assets/menu.svg';
import logo from '../../../assets/logo.png';
// import { useHistory } from "react-router-dom";

const useStyles = createUseStyles(() => ({
  headerMain: {
    display: 'flex',
    position: 'fixed',
    background: 'white',
    top: '0%',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoNavMain: {
    paddingLeft: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '5px'
  },
  logo: { width: '40px', height: '40px' },
  navOptionsMain: {
    paddingLeft: '25px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, auto)',
    gridGap: '50px',
    listStyleType: 'none'
  },
  mobileOption: { display: 'none' },
  salirbt: {
    border: '1px solid #e9e9e9',
    background: 'transparent',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center'
  },
  exitIcon: { fontSize: '20px', marginRight: '4px' },
  a: { textDecoration: 'none' },
  signinUp: {
    display: 'flex',
    padding: '0px 5px',
    listStyleType: 'none',
    marginLeft: 'auto'
  },
  signIn: { alignSelf: 'center' },
  signupBtn: {
    padding: '10px 10px',
    height: '2.4rem',
    borderRadius: '3px',
    background: 'rgb(233, 233, 233)',
    color: 'white',
    cursor: 'pointer',
    alignItems: 'center'
  },
  mobileMenu: { display: 'block' },
  '@media (max-width: 648px)': {
    header: { padding: '0px 10px' },
    logo: { width: '45px', height: '45px' },
    navOptionsMain: {
      display: 'flex',
      minWidth: '100%',
      height: '100vh',
      position: 'absolute',
      top: '40px',
      left: '-100%',
      paddingLeft: '0',
      opacity: 1,
      transition: 'all 0.7s ease-in-out',
      flexDirection: 'column',
      listStyleType: 'none',
      gridGap: '0px',
      background: 'rgb(233, 233, 233)',
      '&:active': {
        background: 'rgb(233, 233, 233)',
        bottom: '0',
        height: '100vh',
        top: '40px',
        left: '0',
        opacity: 1,
        transition: 'all 0.7s ease-in-out',
        zIndex: 0,
        alignContent: 'center',
        paddingLeft: '0px'
      }
    },
    menuIcon: { width: '45px', height: '45px' },
    option: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '10vw',
      padding: '30px 0px'
    },
    signUp: {
      background: 'rgb(222, 9, 241)',
      borderRadius: ['3px', '3px'],
      color: 'white',
      padding: '20px 0px',
      width: '80%',
      alignSelf: 'center'
    },
    signinUp: { display: 'none' }
  },
  '@media (min-width: 768px)': { logoNavMain: { minWidth: '100%' } }
}));

function NavBarMainPage() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const classes = useStyles();

  return (
    <div className={classes.headerMain}>
      <div className={classes.logoNavMain}>
        <div className={classes.logoContainer}>
          <a href="/">
            <img className={classes.logo} alt="logo" src={logo} />
          </a>
        </div>
        <ul
          className={click ? 'nav-optionsMain active' : classes.navOptionsMain}
        >
          <li
            className={classes.option}
            onKeyDown={closeMobileMenu}
            onClick={closeMobileMenu}
          >
            <Link to="/terminos">Terminos y Condiciones</Link>
          </li>
          <li
            className={classes.option}
            onKeyDown={closeMobileMenu}
            onClick={closeMobileMenu}
          >
            <Link to="/privacidad">Aviso de Privacidad</Link>
          </li>
        </ul>
      </div>
      <div
        aria-hidden="true"
        className="mobile-menu"
        onKeyDown={handleClick}
        onClick={handleClick}
      >
        {click ? (
          <CloseMenu className="menu-icon" />
        ) : (
          <MenuIcon className="menu-icon" />
        )}
      </div>
    </div>
  );
}

export default NavBarMainPage;
