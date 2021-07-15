import "./App.css";
import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import loading from "../../assets/loading.gif";

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
        language: "es",
      }));
      instance.renderLogin(containerRef.current, {
        onSuccess: (r) => {
          console.log("onSuccess", r);
          localStorage.setItem("user", JSON.stringify(r));
          history.push("/dashboard");
        },
        onError: (r) => {
          console.log("on error", r);
          history.push("/toOnboarding");
        },
      });
    };
  });
  return (
    <div className="App">
      <div ref={containerRef}>
        <img src={loading} className="loadgif" alt="loading..." />
      </div>
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
