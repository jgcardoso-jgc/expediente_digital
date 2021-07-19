import "./dashboard.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../navBar/navBar";
import { IoPersonCircle } from "react-icons/io5";

function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  var name = user.fullName;
  if (name === "RODRIGO SALVADOR LOZADA TENORIO") {
    setUser("Sofia Lozada Tenorio");
  } else {
    name = user;
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
      <Link to="/documents" style={{ display: "inline-block" }}>
        <button className="logBt mb" type="button">
          Ver mis documentos
        </button>
      </Link>
    </div>
  );
}

export default Dashboard;
