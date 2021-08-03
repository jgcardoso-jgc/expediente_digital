/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import onBoardingConfig from "../documents/onBoardingConfig";

let incode = null;

function start() {
  incode = window.OnBoarding.create(onBoardingConfig);
}

const MyProfile = () => {
  const firebase = useFirebaseApp();
  const db = firebase.storage();
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user.fullName;
  const { email } = user;
  const { rfc } = user;
  const [loading, setLoading] = useState(true);
  const metadata = {
    contentType: "image/jpeg",
  };

  function exists(response) {
    if (response.includes("404", 0)) {
      notExists();
    } else {
      const frontId = new Image();
      frontId.src = response;
      frontId.style.width = "100%";
      frontId.style.borderTopLeftRadius = "14px";
      frontId.style.borderTopRightRadius = "14px";
      setLoading(false);
      document.getElementById("pic").appendChild(frontId);
    }
  }

  function notExists() {
    if (user.token === "") {
      toast("Debes ir a hello");
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk-js.s3.amazonaws.com/sdk/onBoarding-1.30.1.js";
    document.body.appendChild(script);
    script.onload = () => {
      start();
      incode
        .createSession("ALL", null, {
          configurationId: "60f0969272a9270015196d70",
        })
        .then(async () => {
          try {
            const imgs = await incode.getImages({
              token: user.token,
              body: { images: ["croppedFace"] },
            });
            const frontId = new Image();
            frontId.src = `data:image/png;base64,${imgs.croppedFace}`;
            frontId.style.width = "100%";
            frontId.style.borderTopLeftRadius = "14px";
            frontId.style.borderTopRightRadius = "14px";
            db.ref("users")
              .child(`/${user.email}/croppedFace`)
              .putString(imgs.croppedFace, "base64", metadata)
              .then(() => {
                console.log("uploaded");
                setLoading(false);
                document.getElementById("pic").appendChild(frontId);
              });
          } catch (e) {
            toast(`Ocurrió un error.${e}`);
          }
        });
    };
  }

  function getState() {
    console.log(user.token);
    const route = `users/${user.email}/croppedFace`;
    db.ref(route)
      .getDownloadURL()
      .then((response) => {
        console.log("founded");
        exists(response);
      })
      .catch(() => {
        console.log("not founded");
        notExists();
      });
  }

  useEffect(() => {
    getState();
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="container max500">
        {loading ? (
          <div className="center pb10"> Cargando tus documentos...</div>
        ) : (
          <div className="cardDashboard pt10">
            <div className="row">
              <div className="col max40">
                <div id="pic" />
              </div>
              <div className="col min50">
                <p className="mb0">
                  <b>{name}</b>
                </p>
                <p className="mt4 mb0">Frontend Developer</p>
                <p className="mt4 mb0">{email}</p>
                <p className="mt4">{rfc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
