/* eslint-disable no-console */
/* eslint-disable quotes */
import "./hello.css";
import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

const apiURL = "https://demo-api.incodesmile.com/";
const apiKey = "570c70d1693636fdc200713415ebc3973afbdf19";

function HelloInitSign() {
  const containerRef = useRef();
  const helloRef = useRef();
  const history = useHistory();

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
          history.push("/documentos");
        },
        onError: (r) => {
          console.log("on error", r);
        },
      });
    };
  });
  return (
    <div className="App">
      <h2 className="faceTitle">Facematch</h2>
      <div ref={containerRef} />
    </div>
  );
}

export default HelloInitSign;
