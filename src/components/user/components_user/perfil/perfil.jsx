/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUseStyles } from "react-jss";
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
  container: {
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
  },
  mt20: {
    marginTop: 20,
  },
  textCard: {
    marginBottom: 4,
  },
  mb0: {
    marginBottom: 0,
  },
  img: {
    borderRadius: 10,
  },
}));

let incode = null;

function start() {
  incode = window.OnBoarding.create(onBoardingConfig);
}

const MyProfile = () => {
  const firebase = useFirebaseApp();
  const db = firebase.storage();
  const global = globalTheme();
  const classes = useStyles();
  const [urlProfile, setUrlProfile] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user.fullName;
  const { email } = user;
  const { rfc } = user;
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [toFaceMatch, setFaceMatch] = useState(false);
  const metadata = {
    contentType: "image/jpeg",
  };

  function exists(response) {
    setLoading(false);
    setUrlProfile(response);
    localStorage.setItem("profilepic", response);
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
            db.ref("users")
              .child(`/${user.email}/croppedFace`)
              .putString(imgs.croppedFace, "base64", metadata)
              .then(() => {
                setReload(true);
              });
          } catch (e) {
            toast(`Ocurrió un error.${e}`);
          }
        });
    };
  }

  function getState() {
    if (localStorage.getItem("profilepic") === null) {
      const route = `users/${user.email}/croppedFace`;
      db.ref(route)
        .getDownloadURL()
        .then((response) => {
          exists(response);
        })
        .catch(() => {
          notExists();
        });
    } else {
      const url = localStorage.getItem("profilepic");
      exists(url);
    }
  }

  useEffect(() => {
    getState();
  }, [reload]);

  return (
    <div>
      <ToastContainer />
      <div className={classes.container}>
        {loading ? (
          <div className={classes.center}>
            {" "}
            {toFaceMatch ? (
              <div>
                <p>Debes hacer Facematch para descargar tu información</p>
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
              "Cargando tu perfil..."
            )}
          </div>
        ) : (
          <div className={classes.cardDashboard}>
            <div className="row">
              <div className="col max40">
                <img src={urlProfile} className={classes.img} alt="profile" />
              </div>
              <div className="col min50">
                <p className="mb0">
                  <b>{name}</b>
                </p>
                <p className={classes.textCard}>Desarrollador Frontend</p>
                <p className={classes.textCard}>{email}</p>
                <p className={classes.textCard}>{rfc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={classes.container}>
        <div className={`${classes.cardDashboard} ${classes.mt20}`}>
          <p>
            <b>Editar Información</b>
          </p>
          <p className={classes.mb0}>RFC</p>
          <p>{rfc}</p>
          <p className={classes.mb0}>Ocupación</p>
          <p>Desarrollador Frontend</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
