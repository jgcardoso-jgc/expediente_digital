import "./dashboard.css";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { deleteSession } from "./api";
import { useHistory } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user.fullName;
  const history = useHistory();

  function exit() {
    console.log("closing...");
    const user = JSON.parse(localStorage.getItem("user"));
    const response = async () =>
      await deleteSession(user.token).then((res) => {
        return res;
      });
    if (response) {
      history.push("/login");
    } else {
      alert("Error");
    }
  }

  return (
    <div className="center">
      <img src={logo} alt="logo" className="logo" />
      <h1 className="welcomeTitle">Bienvenido nuevamente</h1>
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
