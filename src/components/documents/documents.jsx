/* eslint-disable no-use-before-define */
/* eslint-disable operator-linebreak */
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
  const db = firebase.storage();
  const [onBoarding, setOnboarding] = useState(false);
  const [grantAccess, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const [image, setImage] = useState("");
  const metadata = {
    contentType: "image/jpeg",
  };

  function exists(response) {
    if (response.includes("404", 0)) {
      notExists();
    } else {
      response.forEach((url) => {
        const frontId = new Image();
        frontId.src = url;
        frontId.style.width = "100%";
        frontId.style.borderTopLeftRadius = "14px";
        frontId.style.borderTopRightRadius = "14px";
        setLoading(false);
        document.getElementById("ineFront").appendChild(frontId);
      });
    }
  }

  function notExists() {
    const script = document.createElement("script");
    script.src = "https://sdk-js.s3.amazonaws.com/sdk/onBoarding-1.30.1.js";
    document.body.appendChild(script);
    script.onload = () => {
      start();
      incode
        .createSession("ALL", null, {
          configurationId: "60f0969272a9270015196d70",
        })
        .then(async () => {
          try {
            const imgs = await incode.getImages({
              token: user.token,
              body: { images: ["croppedFrontID", "croppedBackID"] },
            });
            const keys = Object.keys(imgs);
            const promises = [];
            keys.forEach((key) => {
              const frontId = new Image();
              frontId.src = `data:image/png;base64,${imgs[key]}`;
              frontId.style.width = "100%";
              frontId.style.borderTopLeftRadius = "14px";
              frontId.style.borderTopRightRadius = "14px";
              promises.push(
                db
                  .ref("users")
                  .child("/" + user.email + "/" + key)
                  .putString(imgs[key], "base64", metadata)
                  .then((res) => {
                    console.log("uploaded");
                    setLoading(false);
                    document.getElementById("ineFront").appendChild(frontId);
                  })
              );
            });
            await Promise.all(promises).then(console.log("all done"));
          } catch (e) {
            toast("Ocurrió un error." + e);
          }
        });
    };
  }

  function getState() {
    console.log(user.token);
    const docsIncode = ["croppedFrontID", "croppedBackID"];
    if (user.onboarding) {
      if (user.token !== "") {
        setAccess(true);
        const urls = [];
        const promises = [];
        docsIncode.forEach((doc) => {
          const route = "users/" + user.email + "/" + doc;
          promises.push(
            db
              .ref(route)
              .getDownloadURL()
              .then((response) => {
                urls.push(response);
                console.log("founded");
              })
              .catch((err) => {
                urls.push("404");
              })
          );
        });
        Promise.all(promises).then(() => {
          console.log("all resolved");
          console.log(urls);
          exists(urls);
        });
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
          <div className="container pb40 pt20">
            {loading ? (
              <div className="center pb10"> Cargando tus documentos...</div>
            ) : (
              <div>
                <div className="row">
                  <div className="col">
                    <div className="cardFit">
                      <div id="ineFront" className="idFront" />
                      <h2 className="cardTitle">INE</h2>
                      <p className="cardText">Frontal</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
