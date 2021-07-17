import "./dashboard.css";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useHistory } from "react-router-dom";
import NavBar from "../navBar/navBar";
import { IoPersonCircle } from "react-icons/io5";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  var name = user.fullName;
  if (name === "RODRIGO SALVADOR LOZADA TENORIO") {
    name = "Sofia Lozada Tenorio";
  }
  const history = useHistory();

  function exit() {
    console.log("closing...");
    localStorage.removeItem("user");
    history.push("/login");
  }

  return (
    <div className="center">
      <NavBar />
      <h1 className="welcomeTitle">Bienvenido nuevamente</h1>
      <IoPersonCircle className="iconPerson" />
      <p>
        <b>{name}</b>
      </p>
      <p className="text">Tu rostro ya está en sistema</p>
      <Link to="/documents">
        <button className="logBt mb" type="button">
          Ver mis documentos
        </button>
      </Link>
      <button onClick={() => exit()} className="logBt" type="button">
        Salir
      </button>
    </div>
  );
}

export default Dashboard;
