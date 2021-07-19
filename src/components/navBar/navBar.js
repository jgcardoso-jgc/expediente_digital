import React, { useState } from "react";
import { ReactComponent as CloseMenu } from "../../assets/x.svg";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import logo from "../../assets/logo.png";
import { useHistory } from "react-router-dom";
import { IoExit } from "react-icons/io5";
import "./navBar.css";

function NavBar() {
  const history = useHistory();
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  function exit() {
    console.log("closing...");
    localStorage.removeItem("user");
    history.push("/login");
  }

  return (
    <div className="header">
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
          <li className="option" onClick={closeMobileMenu}>
            <a href="/documents">Alertas</a>
          </li>
          <li className="sign-in" onClick={closeMobileMenu}>
            <button onClick={() => exit()} className="salirbt">
              <IoExit className="exitIcon" />
              <span>Salir</span>
            </button>
          </li>
        </ul>
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
