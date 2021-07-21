import "./dashboard.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../navBar/navBar";
import firebase from "firebase";
import { IoPersonCircle } from "react-icons/io5";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user.fullName;

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

  const [image, setImage] = useState("");
  const upload = () => {
    if (image == null) return;
    firebase
      .storage()
      .ref(`users/${image.name}`)
      .put(image)
      .on(
        "state_changed",
        (snapshot) => {
          // Se lanza durante el progreso de subida
          console.log("uploading...");
        },
        (error) => {
          // Si ha ocurrido un error aquí lo tratamos
          console.log("error:" + error);
        },
        () => {
          // Una vez se haya subido el archivo,
          // se invoca ésta función
          console.log("done");
        }
      );
  };

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
      <input
        type="file"
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />
      <button onClick={() => upload()}>Upload</button>
      <button onClick={() => logOut()}>Exit</button>
    </div>
  );
}

export default Dashboard;
