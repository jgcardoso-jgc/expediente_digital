import React from "react";
import { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import "./documents.css";
import onBoardingConfig from "./onBoardingConfig";
import NavBar from "../navBar/navBar";

var incode = null;
function start() {
  incode = window.OnBoarding.create(onBoardingConfig);
}

function Documents() {
  const firebase = useFirebaseApp();
  const user = JSON.parse(localStorage.getItem("user"));

  async function getImg() {
    console.log(user.token);
    const imgs = await incode.getImages({
      token: user.token,
      body: { images: ["fullFrameFrontID"] },
    });
    console.log(imgs.fullFrameFrontID);
    var image = new Image();
    image.src = "data:image/png;base64," + imgs.fullFrameFrontID;
    image.style.width = "100%";
    document.getElementById("ineFront").appendChild(image);
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

  useEffect(() => {
    console.log("incode...");
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
          await getImg();
        });
    };
  });

  return (
    <div>
      <NavBar />
      <h1 className="center">Mis documentos</h1>
      <div id="ineFront" className="idFront"></div>
      <input
        type="file"
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />
      <button onClick={() => upload()}>Upload</button>
    </div>
  );
}

export default Documents;
