import "./App.css";
import React, { useRef, useEffect } from "react";

var apiURL = "https://demo-api.incodesmile.com/";
const apiKey = "570c70d1693636fdc200713415ebc3973afbdf19";

function Hello() {
  const containerRef = useRef();
  const helloRef = useRef();
  useEffect(() => {
    const { Hello } = window;
    const instance = (helloRef.current = Hello.create({
      apiKey,
      apiURL,
    }));
    instance.renderLogin(containerRef.current, {
      onSuccess: (r) => {
        console.log("onSuccess", r);
      },
      onError: (r) => {
        console.log("on error", r);
      },
    });
  }, []);
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
