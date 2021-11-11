/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useRef, useEffect } from "react";
import "./hello.css";
import PropTypes from "prop-types";
import UserController from "../../../shared/seguriSign/controller/user_controller";
import CustomToasts from "../Toasts/CustomToasts";

const apiURL = "https://demo-api.incodesmile.com/";
const apiKey = "570c70d1693636fdc200713415ebc3973afbdf19";

const HelloInitSign = (props) => {
  const containerRef = useRef();
  const userController = new UserController();
  const helloRef = useRef();

  HelloInitSign.propTypes = {
    setFaceMatched: PropTypes.func.isRequired,
    toaster: PropTypes.instanceOf(CustomToasts).isRequired,
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk-js.s3.amazonaws.com/sdk/hello-1.1.0.js";
    document.body.appendChild(script);
    script.onload = () => {
      const { Hello } = window;
      helloRef.current = Hello.create({
        apiKey,
        apiURL,
        language: "es",
      });
      const instance = helloRef.current;
      instance.renderLogin(containerRef.current, {
        onSuccess: async (r) => {
          console.log("onSuccess", r);
          const isUser = await userController.compareCustomerId(r.customerId);
          if (isUser) {
            props.toaster.successToast(`Identidad confirmada: ${r.fullName}`);
            const saved = JSON.parse(localStorage.getItem("user"));
            saved.token = r.token;
            localStorage.setItem("user", JSON.stringify(saved));
            props.setFaceMatched(true);
          } else {
            props.toaster.errorToast("Error al confirmar identidad");
            props.setFaceMatched(false);
          }
        },
        onError: (r) => {
          console.log("on error", r);
          props.setFaceMatched(false);
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
};

export default HelloInitSign;
