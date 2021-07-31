/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable quotes */
import "./dashboard.css";
import React, { useEffect, useState } from "react";
import "firebase/auth";
import { useFirebaseApp } from "reactfire";
import { Link } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import NavBar from "../navBar/navBar";

function Dashboard() {
  const firebase = useFirebaseApp();
  const userAuth = firebase.auth().currentUser;
  const firestore = firebase.firestore();
  const storage = firebase.storage();
  const [user, setData] = useState("");
  const [loading, setLoading] = useState(true);

  function getData() {
    return new Promise((resolve) => {
      let userGet = "";
      const { uid } = userAuth;
      const query = firestore.collection("users").where("uid", "==", uid);
      query.get().then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          const data = documentSnapshot.data();
          userGet = {
            fullName: data.fullname,
            rfc: data.rfc,
            email: data.email,
            token: data.token,
            onboarding: data.onboarding,
            documents: data.documents,
          };
        });
        localStorage.setItem("user", JSON.stringify(userGet));
        resolve(userGet);
      });
    });
  }

  function exists(response) {
    setLoading(false);
    const frontId = new Image();
    frontId.src = response;
    frontId.style.width = "100%";
    frontId.style.borderRadius = "14px";
    document.getElementById("picProfile").appendChild(frontId);
  }

  async function getState() {
    const userSaved = localStorage.getItem("user");
    if (userSaved === null) {
      await getData().then((res) => {
        setData(res);
      });
    } else {
      setData(JSON.parse(userSaved));
    }
    console.log(user.token);
    const route = `users/${user.email}/croppedFace`;
    storage
      .ref(route)
      .getDownloadURL()
      .then((response) => {
        console.log("founded");
        exists(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getState();
  }, []);

  return (
    <div className="center">
      <NavBar />
      <h1 className="welcomeTitle pt40 mb20">Expediente Digital</h1>
      <div className="container max500">
        <Link to="/perfil">
          <div className="cardDashboard pt10">
            <div className="row">
              <div className="col pl30 max40">
                {loading ? (
                  <IoPersonCircle className="iconPerson d-block mx-auto" />
                ) : (
                  <div id="picProfile" />
                )}
              </div>
              <div className="col min50">
                <p className="mb0">
                  <b>{user.name}</b>
                </p>
                <p className="mt4 mb0">Frontend Developer</p>
                <p className="mt4 mb0">{user.email}</p>
                <p className="mt4">{user.rfc}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="container max500 mt14">
        <div className="row">
          <div className="col-md-6 mb10">
            <div className="cardDashboard p10">
              <Link to="/documents" style={{ display: "block" }}>
                <h2>2</h2>
                <h5>Documentos</h5>
              </Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="cardDashboard p10">
              <Link to="/alertas" style={{ display: "block" }}>
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
