/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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
import { useFirebaseApp } from "reactfire";
import { createUseStyles, useTheme } from "react-jss";
import { v4 as uuidv4 } from "uuid";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import docFunctions from "./getDocuments";
import toOnboarding from "../../../../assets/toOnboarding.png";
import facematch from "../../../../assets/facematch.png";
import styles from "../../../../resources/theme";
import ModalEdit from "../modal/modal";
import docwave from "../../../../assets/docwave.svg";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  card: {
    backgroundColor: "#f5f5f5",
    border: `1px solid #f5f5f5`,
    borderRadius: 10,
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
    height: "100%",
  },
  pointer: {
    cursor: "pointer",
  },
  max400: {
    maxWidth: "400px",
  },
  titleCard: {
    padding: 10,
  },
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
  mb20: {
    marginBottom: 20,
  },
  wave: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
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
  const storage = firebase.storage();
  const db = firebase.firestore();
  const [onBoarding, setOnboarding] = useState(false);
  const [grantAccess, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [show, setShow] = useState(false);
  const [urlView, setUrl] = useState("");
  const [titleModal, setTitle] = useState("");
  const [size, setSize] = useState(0);

  async function getDocs() {
    docFunctions.getState(db, storage, user).then((res) => {
      if (Array.isArray(res)) {
        //es array cuando ya se hizo onboarding y facematch
        setAccess(true);
        docFunctions.exists(res).then((docArray) => {
          //docs not exist
          if (docArray === "pendiente") {
            toast("Hay pendientes");
            setLoading(false);
          }
          if (docArray === "not exists") {
            //call this function only in case the missing docs are incode docs
            docFunctions.notExists(storage, user).then((resFinal) => {
              if (resFinal === "all done") {
                console.log("done!");
              } else {
                toast(resFinal);
              }
              setLoading(false);
            });
          } else {
            //docs exists
            setSize(docArray.length);
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

  function handleShow(url) {
    setUrl(url.url);
    setTitle(url.title);
    setShow(true);
  }

  if (loading) {
    return <div>Cargando...</div>;
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
          <div>
            {loading ? (
              <div className="center pb10"> Cargando tus documentos...</div>
            ) : (
              <div>
                <h4 className={classes.mb20}>
                  <b>{size}</b> documentos
                </h4>
                <Row className={classes.rowDocs}>
                  {docs.map((url) => (
                    <Col className={classes.col} key={uuidv4()}>
                      <div
                        className={`${classes.card} ${classes.pointer}`}
                        onKeyPress={() => handleShow(url)}
                        key={uuidv4()}
                        onClick={() => handleShow(url)}
                      >
                        <p className={classes.titleCard}>
                          <b>{url.title}</b>
                        </p>
                        <img alt="" src={docwave} className={classes.wave} />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
          <ModalEdit
            state={show}
            url={urlView}
            title={titleModal}
            onClose={() => setShow(false)}
          />
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

/*const frontId = new Image();
        frontId.src = url;
        frontId.style.width = "100%";
        frontId.style.borderTopLeftRadius = "14px";
        frontId.style.borderTopRightRadius = "14px";
        document.getElementById("ineFront").appendChild(frontId);*/
