import "./dashboard.css";
import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../navBar/navBar";
import { IoPersonCircle } from "react-icons/io5";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user.fullName);
  var name = user.fullName;

  return (
    <div className="center">
      <NavBar />
      <h1 className="welcomeTitle">Bienvenido nuevamente</h1>
      <IoPersonCircle className="iconPerson" />
      <p>
        <b>{name}</b>
      </p>
      <p className="text">Tu rostro ya está en sistema</p>
      <Link to="/documents" style={{ display: "inline-block" }}>
        <button className="logBt mb" type="button">
          Ver mis documentos
        </button>
      </Link>
    </div>
  );
}

export default Dashboard;
