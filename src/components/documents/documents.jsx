/* eslint-disable prefer-template */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toOnboarding from "../../assets/toOnboarding.png";
import facematch from "../../assets/facematch.png";
import "./documents.css";
import onBoardingConfig from "./onBoardingConfig";
import NavBar from "../navBar/navBar";

let incode = null;

function start() {
  incode = window.OnBoarding.create(onBoardingConfig);
}

function Documents() {
  const firebase = useFirebaseApp();
  const [onBoarding, setOnboarding] = useState(false);
  const [grantAccess, setAccess] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [image, setImage] = useState("");

  function getState() {
    console.log("first");
    console.log(user.token);
    if (user.onboarding) {
      if (user.token !== "") {
        setAccess(true);
        const script = document.createElement("script");
        script.src = "https://sdk-js.s3.amazonaws.com/sdk/onBoarding-1.30.1.js";
        document.body.appendChild(script);
        script.onload = () => {
          console.log("loaded...");
          start();
          incode
            .createSession("ALL", null, {
              configurationId: "60f0969272a9270015196d70",
            })
            .then(async () => {
              try {
                const imgs = await incode.getImages({
                  token: user.token,
                  body: { images: ["fullFrameFrontID"] },
                });
                console.log(imgs.fullFrameFrontID);
                const frontId = new Image();
                frontId.src = `data:image/png;base64,${imgs.fullFrameFrontID}`;
                frontId.style.width = "100%";
                document.getElementById("ineFront").appendChild(frontId);
                console.log("image:" + image);
                firebase
                  .storage()
                  .ref("users")
                  .child("frontId")
                  .putString(imgs.fullFrameFrontID, "base64")
                  .then((res) => {
                    console.log("uploaded");
                  });
              } catch (e) {
                toast("Ocurrió un error.");
              }
            });
        };
        return;
      }
      setOnboarding(true);
    }
  }

  useEffect(() => {
    getState();
  }, []);

  if (onBoarding) {
    return (
      <div>
        <NavBar />
        <ToastContainer />
        <h1 className="center pt40 mb20">Mis documentos</h1>
        <div>
          <div>
            <div>
              {" "}
              <div className="container">
                <div className="center pb10">
                  {" "}
                  Deberás hacer Facematch para comprobar tu identidad
                </div>
                <Link to="/hello">
                  <button type="button" className="logBt">
                    Ir al Facematch
                  </button>
                </Link>
              </div>
              <div className="container">
                <img alt="" className="scan" src={facematch} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (grantAccess) {
    return (
      <div>
        <NavBar />
        <ToastContainer />
        <h1 className="center pt40 mb20">Mis documentos</h1>
        <div>
          {" "}
          <div className="container">
            <div className="center pb10"> Se mostrarán tus documentos</div>
          </div>
          <div id="ineFront" className="idFront" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <ToastContainer />
      <h1 className="center pt40 mb20">Mis documentos</h1>
      <div className="center pb10">
        No has registrado tu Identificación Oficial
      </div>
      <Link to="/onboard">
        <button type="button" className="logBt">
          Ir al OnBoarding
        </button>
      </Link>
      <div className="container">
        <img alt="" className="scan" src={toOnboarding} />
      </div>
    </div>
  );
}

export default Documents;

/*
      <input
        type="file"
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />
      <button onClick={() => upload()}>Upload</button>

*/
