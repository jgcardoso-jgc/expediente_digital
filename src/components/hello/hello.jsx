/* eslint-disable no-console */
/* eslint-disable quotes */
import "./hello.css";
import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import loading from "../../assets/loading.gif";
import logo from "../../assets/logo.png";

const apiURL = "https://demo-api.incodesmile.com/";
const apiKey = "570c70d1693636fdc200713415ebc3973afbdf19";

/*
    <script
      src="https://sdk-js.s3.amazonaws.com/sdk/hello-1.1.0.js"
      type="text/javascript"
    ></script>
*/

function HelloInit() {
  const containerRef = useRef();
  const helloRef = useRef();
  const history = useHistory();

  function toLoginNormal() {
    history.push({ pathname: "/loginNormal", state: { reload: true } });
  }
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk-js.s3.amazonaws.com/sdk/hello-1.1.0.js";
    document.body.appendChild(script);
    script.onload = () => {
      console.log("loaded");
      const { Hello } = window;
      helloRef.current = Hello.create({
        apiKey,
        apiURL,
        language: "es",
      });
      const instance = helloRef.current;
      instance.renderLogin(containerRef.current, {
        onSuccess: (r) => {
          console.log("onSuccess", r);
          const saved = JSON.parse(localStorage.getItem("user"));
          saved.token = r.token;
          localStorage.setItem("user", JSON.stringify(saved));
          history.push("/documents");
        },
        onError: (r) => {
          console.log("on error", r);
          history.push({ pathname: "/toOnboarding", state: { reload: true } });
        },
      });
    };
  });
  return (
    <div className="App">
      <div className="flex header">
        <img src={logo} alt="logo" className="logoFace" />
        <p className="segText">Seguridata</p>
      </div>
      <h2 className="faceTitle">Facematch</h2>
      <div ref={containerRef}>
        <img src={loading} className="loadgif" alt="loading..." />
      </div>
      <button
        type="button"
        onClick={() => toLoginNormal()}
        className="problemas logBt"
      >
        ¿Tienes problemas?
      </button>
    </div>
  );
}

export default HelloInit;
