import React from "react";
import { useEffect, useState } from "react";
//import { useFirebaseApp } from "reactfire";
import toOnboarding from "../../assets/toOnboarding.png";
import facematch from "../../assets/facematch.png";
import "./documents.css";
import onBoardingConfig from "./onBoardingConfig";
import NavBar from "../navBar/navBar";
import { Link } from "react-router-dom";

var incode = null;

function start() {
  incode = window.OnBoarding.create(onBoardingConfig);
}

function Documents() {
  //const firebase = useFirebaseApp();
  const [onBoarding, setOnboarding] = useState(false);
  const [grantAccess, setAccess] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  async function getState() {
    console.log(user.token);
    if (user.onboarding) {
      setOnboarding(true);
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
                var image = new Image();
                image.src = "data:image/png;base64," + imgs.fullFrameFrontID;
                image.style.width = "100%";
                document.getElementById("ineFront").appendChild(image);
              } catch (e) {
                alert("Por favor, realizar tu proceso de OnBoarding de nuevo.");
              }
            });
        };
      } else {
        setOnboarding(true);
      }
    } else {
      setOnboarding(false);
    }
  }

  /*const [image, setImage] = useState("");
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
  };*/

  useEffect(() => {
    console.log("incode...");
    getState();
  });

  return (
    <div>
      <NavBar />
      <h1 className="center pt40 mb20">Mis documentos</h1>
      {onBoarding ? (
        <div>
          <div id="ineFront" className="idFront"></div>
          <div>
            {grantAccess ? (
              <div>
                {" "}
                <div className="container">
                  <div className="center pb10">
                    {" "}
                    Se mostrarán tus documentos
                  </div>
                </div>
                <div className="container">
                  <img alt="" className="scan" src={facematch} />
                </div>
              </div>
            ) : (
              <div>
                {" "}
                <div className="container">
                  <div className="center pb10">
                    {" "}
                    Deberás hacer Facematch para comprobar tu identidad
                  </div>
                  <Link to="/hello">
                    <button className="logBt">Ir al Facematch</button>
                  </Link>
                </div>
                <div className="container">
                  <img alt="" className="scan" src={facematch} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="center pb10">
            No has registrado tu Identificación Oficial
          </div>
          <Link to="/onboard">
            <button className="logBt">Ir al OnBoarding</button>
          </Link>
          <div className="container">
            <img alt="" className="scan" src={toOnboarding} />
          </div>
        </div>
      )}
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
