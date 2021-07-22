import React, { useState } from "react";
import { ReactComponent as CloseMenu } from "../../assets/x.svg";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import logo from "../../assets/logo.png";
//import { IoExit } from "react-icons/io5";
import firebase from "firebase";
import "./navBar.css";
import { FaRegBell } from "react-icons/fa";
import { FaBell } from "react-icons/fa";

function NavBar() {
  const [click, setClick] = useState(false);
  const [alert, openAlert] = useState(false);
  const handleClick = () => setClick(!click);
  const handleBell = () => fetchAlerts();
  const closeMobileMenu = () => setClick(false);

  function logOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("logged out");
        localStorage.removeItem("user");
      })
      .catch((error) => {
        alert(error);
      });
  }

  function fetchAlerts() {
    console.log("opening");
    openAlert(!alert);
  }

  return (
    <div className="header shadow">
      <div className="logo-nav">
        <div className="logo-container">
          <a href="/dashboard">
            <img className="logo" alt="logo" src={logo} />
          </a>
        </div>
        <ul className={click ? "nav-options active" : "nav-options"}>
          <li className="option" onClick={closeMobileMenu}>
            <a href="/documents">Mi Perfil</a>
          </li>
          <li className="option" onClick={closeMobileMenu}>
            <a href="/documents">Documentos</a>
          </li>
          <li className="sign-in" onClick={closeMobileMenu}>
            <button onClick={() => logOut()} className="salirbt">
              <span>Salir</span>
            </button>
          </li>
        </ul>
        <ul className={alert ? "nav-optionsAlert active" : "nav-optionsAlert"}>
          <h2 className="option">Notificaciones</h2>
          <li className="option" onClick={closeMobileMenu}>
            <a href="/documents">Mi Perfil</a>
          </li>
          <li className="option" onClick={closeMobileMenu}>
            <a href="/documents">Documentos</a>
          </li>
          <li className="option" onClick={closeMobileMenu}>
            <a href="/documents">Alertas</a>
          </li>
          <li className="sign-in" onClick={closeMobileMenu}>
            <button onClick={() => logOut()} className="salirbt">
              <span>Salir</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="mobile-menu bell ml-auto" onClick={handleBell}>
        {alert ? (
          <FaBell className="alert-icon" />
        ) : (
          <FaRegBell className="alert-icon" />
        )}
      </div>
      <div className="mobile-menu" onClick={handleClick}>
        {click ? (
          <CloseMenu className="menu-icon" />
        ) : (
          <MenuIcon className="menu-icon" />
        )}
      </div>
    </div>
  );
}

export default NavBar;
