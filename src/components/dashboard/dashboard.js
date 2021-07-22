import "./dashboard.css";
import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../navBar/navBar";
import { IoPersonCircle } from "react-icons/io5";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user.fullName;
  const email = user.email;

  return (
    <div className="center">
      <NavBar />
      <h1 className="welcomeTitle pt40 mb20">Expediente Digital</h1>
      <div className="container max500">
        <div className="cardDashboard pt10">
          <div className="row">
            <div className="col max40">
              <IoPersonCircle className="iconPerson d-block mx-auto" />
            </div>
            <div className="col min50">
              <p className="mb0">
                <b>{name}</b>
              </p>
              <p className="mt4 mb0">Frontend Developer</p>
              <p className="mt4">{email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container max500 mt14">
        <div className="row">
          <div className="col-md-6 mb10">
            <div className="cardDashboard p10">
              <Link to="/documents" style={{ display: "block" }}>
                <h2>0</h2>
                <h5>Documentos</h5>
              </Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="cardDashboard p10">
              <Link to="/documents" style={{ display: "block" }}>
                <h2>0</h2>
                <h5>Alertas</h5>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
