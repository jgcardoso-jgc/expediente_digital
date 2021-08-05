/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUseStyles, useTheme } from "react-jss";
import onBoardingConfig from "../documents/onBoardingConfig";
import styles from "../../../../resources/theme";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  center: {
    textAlign: "center",
  },
  toMatch: {
    display: "block",
    marginRight: "auto",
  },
  cardDashboard: {
    background: "#f5f5f5",
    borderRadius: "10px",
    padding: "10px",
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
  },
}));

let incode = null;

function start() {
  incode = window.OnBoarding.create(onBoardingConfig);
}

const MyProfile = () => {
  const firebase = useFirebaseApp();
  const db = firebase.storage();
  const theme = useTheme();
  const global = globalTheme({ theme });
  const classes = useStyles({ theme });
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user.fullName;
  const { email } = user;
  const { rfc } = user;
  const [loading, setLoading] = useState(true);
  const [toFaceMatch, setFaceMatch] = useState(false);
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
      frontId.style.borderRadius = "7px";
      setLoading(false);
      document.getElementById("pic").appendChild(frontId);
    }
  }

  function notExists() {
    if (user.token === "") {
      setFaceMatch(true);
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
          <div className={classes.center}>
            {" "}
            {toFaceMatch ? (
              <div>
                <p>Debes hacer Facematch</p>
                <Link to="/hello">
                  <button
                    type="button"
                    className={`${global.initBt} ${classes.toMatch}`}
                  >
                    Ir al Facematch
                  </button>
                </Link>
              </div>
            ) : (
              "Cargando tus documentos..."
            )}
          </div>
        ) : (
          <div className={classes.cardDashboard}>
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
