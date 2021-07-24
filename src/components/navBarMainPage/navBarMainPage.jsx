/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable quotes */
import React, { useState } from "react";
import { ReactComponent as CloseMenu } from "../../assets/x.svg";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import logo from "../../assets/logo.png";
// import { useHistory } from "react-router-dom";
import "./navBarMainPage.css";

function NavBarMainPage() {
  // const history = useHistory();
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  /* function exit() {
    console.log("closing...");
    localStorage.removeItem("user");
    history.push("/login");
  } */

  return (
    <div className="headerMain">
      <div className="logo-navMain">
        <div className="logo-container">
          <a href="/dashboard">
            <img className="logo" alt="logo" src={logo} />
          </a>
        </div>
        <ul className={click ? "nav-optionsMain active" : "nav-optionsMain"}>
          <li
            className="option"
            onKeyDown={closeMobileMenu}
            onClick={closeMobileMenu}
          >
            <a href="/documents">Terminos y Condiciones</a>
          </li>
          <li
            className="option"
            onKeyDown={closeMobileMenu}
            onClick={closeMobileMenu}
          >
            <a href="/documents">Aviso de Privacidad</a>
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
