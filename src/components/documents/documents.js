import React from "react";
import { useEffect } from "react";
import "./documents.css";

const apiURL = "https://demo-api.incodesmile.com/";
const apiKey = "570c70d1693636fdc200713415ebc3973afbdf19";
var incode = null;

function start() {
  incode = window.OnBoarding.create({
    apiKey: apiKey,
    apiURL: apiURL,
    lang: "es",
    theme: {
      main: "red",
      mainButton: {
        borderRadius: "20px",
        color: "white",
        border: "2px solid black",
      },
    },
    translations: {
      tutorial: {
        front1: "Seguridata Onboarding",
        front2: "Scan ID",
        back1: "Now scan the ",
        back2: "back side ",
        back3: "of your ID",
        selfie1: "Let's take a selfie",
        selfie2: "Keep a neutral expression, find balanced",
        selfie3: "light and remove any glasses and hats",
        passport1: "Align your passport to the frame and take a photo",
        passport2: "Position just the page with the photo",
      },
    },
  });
}

function Documents() {
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
