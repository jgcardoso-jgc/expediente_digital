import "./App.css";
import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

var apiURL = "https://demo-api.incodesmile.com/";
const apiKey = "570c70d1693636fdc200713415ebc3973afbdf19";

/* 
    <script
      src="https://sdk-js.s3.amazonaws.com/sdk/hello-1.1.0.js"
      type="text/javascript"
    ></script>
*/

function Hello() {
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
      const instance = (helloRef.current = Hello.create({
        apiKey,
        apiURL,
      }));
      instance.renderLogin(containerRef.current, {
        onSuccess: (r) => {
          console.log("onSuccess", r);
          document.getElementById(
            "root"
          ).innerHTML = `Welcome Back, your token is ${r.token}`;
        },
        onError: (r) => {
          console.log("on error", r);
          history.push("/onboard");
        },
      });
    };
  });
  return (
    <div className="App">
      <div ref={containerRef}></div>
    </div>
  );
}

export default Hello;

/*
function App() {
  const containerRef = useRef();
  const helloRef = useRef();
  useEffect(() => {
    const { Hello } = window;
    const instance = (helloRef.current = Hello.create({
      apiKey,
      apiURL
    }));
    instance.renderLogin(containerRef.current, {
      onSuccess: (r) => {
        console.log(“onSuccess”, r);
      },
      onError: (r) => {
        console.log(“on error”, r);
      }
    });
  }, []);
  return (
    <div className=“App”>
      <div ref={containerRef}></div>
    </div>
  );
}

*/
