/* eslint-disable no-use-before-define */
/* eslint-disable operator-linebreak */
/* eslint-disable prefer-template */
/* eslint-disable comma-dangle */
/* eslint-disable spaced-comment */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uuid from "react-uuid";
import { useFirebaseApp } from "reactfire";
import { createUseStyles, useTheme } from "react-jss";
import docFunctions from "./getDocuments";
import toOnboarding from "../../../../assets/toOnboarding.png";
import facematch from "../../../../assets/facematch.png";
import styles from "../../../../resources/theme";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  ".idFront": { maxWidth: "200px" },
  ".imgCard": { borderTopLeftRadius: "14px", borderTopRightRadius: "14px" },
  ".scan": { width: "100%" },
  ".imgDoc": {
    width: "100%",
    borderTopLeftRadius: "14px",
    borderTopRightRadius: "14px",
  },
  ".cardFit": {
    maxWidth: "200px",
    WebkitBoxShadow: "0px 8px 22px 9px #c7c7c7",
    boxShadow: "0px 8px 22px 9px #c7c7c7",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "14px",
  },
  ".cardTitle": {
    paddingTop: "4px",
    paddingLeft: "10px",
    paddingBottom: "0px",
    marginBottom: "0",
  },
  toBoarding: {
    display: "block",
    marginRight: "auto",
  },
  ".cardText": {
    paddingTop: "4px",
    paddingLeft: "10px",
    paddingBottom: "20px",
  },
}));

function Documents() {
  const theme = useTheme();
  const global = globalTheme({ theme });
  const classes = useStyles({ theme });
  const firebase = useFirebaseApp();
  const db = firebase.storage();
  const [onBoarding, setOnboarding] = useState(false);
  const [grantAccess, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  async function getDocs() {
    docFunctions.getState(db, user).then((res) => {
      if (Array.isArray(res)) {
        setAccess(true);
        docFunctions.exists(res).then((docArray) => {
          //docs not exist
          if (docArray === "not exists") {
            docFunctions.notExists(db, user).then((resFinal) => {
              if (resFinal === "all done") {
                console.log("done!");
              } else {
                toast(resFinal);
              }
              setLoading(false);
            });
          } else {
            //docs exists
            setDocs(docArray);
            setLoading(false);
          }
        });
      }
      if (res === "Set Onboarding") {
        setOnboarding(true);
        setLoading(false);
      }
      if (res === "same state") {
        console.log("do nothing");
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    getDocs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (onBoarding) {
    return (
      <div>
        <ToastContainer />
        <div>
          <div>
            <div>
              {" "}
              <div className="container">
                <div className="center pb10">
                  {" "}
                  Deberás hacer Facematch para comprobar tu identidad
                </div>
                <Link to="/hello">
                  <button
                    type="button"
                    className={`${global.initBt} ${classes.toBoarding}`}
                  >
                    Ir al Facematch
                  </button>
                </Link>
              </div>
              <div className="container">
                <img alt="" className="scan" src={facematch} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (grantAccess) {
    return (
      <div>
        <ToastContainer />
        <div>
          {" "}
          <div className="container pb40 pt20">
            {loading ? (
              <div className="center pb10"> Cargando tus documentos...</div>
            ) : (
              <div>
                <div className="row">
                  <div className="col">
                    {docs.length &&
                      docs.map((doc) => (
                        <div className="cardFit">
                          <div id="ineFront" className="idFront" />
                          <img
                            key={uuid()}
                            className="imgDoc"
                            alt="doc"
                            src={doc.url}
                          />
                          <h4 className="cardTitle">{doc.title}</h4>
                          <a href={doc.url} target="blank" key={uuid()}>
                            Ver
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <div className={global.center}>
        No has registrado tu Identificación Oficial
      </div>
      <Link style={{ display: "block" }} to="/onboard">
        <button
          type="button"
          className={`${global.initBt} ${classes.toBoarding}`}
        >
          Ir al OnBoarding
        </button>
      </Link>
      <div className="container">
        <img alt="" className="scan" src={toOnboarding} />
      </div>
    </div>
  );
}

export default Documents;

/*
      <input
        type="file"
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />
      <button onClick={() => upload()}>Upload</button>

              /*const frontId = new Image();
        frontId.src = url;
        frontId.style.width = "100%";
        frontId.style.borderTopLeftRadius = "14px";
        frontId.style.borderTopRightRadius = "14px";
        document.getElementById("ineFront").appendChild(frontId);*/
