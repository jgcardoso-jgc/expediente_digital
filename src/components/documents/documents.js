import React from "react";
import { useEffect } from "react";
//import { useFirebaseApp } from "reactfire";
import "./documents.css";
import onBoardingConfig from "./onBoardingConfig";

var incode = null;
function start() {
  incode = window.OnBoarding.create(onBoardingConfig);
}

function Documents() {
  //const firebase = useFirebaseApp();
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
      <h1 className="center">Mis documentos</h1>
      <div id="ineFront" className="idFront"></div>
    </div>
  );
}

export default Documents;
