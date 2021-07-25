/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable quotes */
// check public/index.html
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import PropTypes from "prop-types";
import Steps from "./Steps";
import "./styles.css";
import loading from "../../assets/loading.gif";
import ContinuePhone from "../continuePhone/continuePhone";
import settings from "./settings";
// import { saveUser } from "./api";

let incode = null;
function start() {
  incode = window.OnBoarding.create(settings);
}

// eslint-disable-next-line spaced-comment
//function TutorialFrontId({ token, onSuccess })

function TutorialFrontId({ onSuccess }) {
  const containerRef = useRef();
  const screenOrientation = window.matchMedia("(orientation: landscape)");
  const [horizontal, setOrientation] = useState(false);

  useEffect(() => {
    if (screenOrientation.matches) {
      console.log("isLandscape");
    } else {
      console.log("isPortrait");
    }
    console.log(screenOrientation);
    if (screenOrientation.matches) {
      setOrientation(true);
    } else {
      incode.renderFrontTutorial(containerRef.current, {
        onSuccess,
        noWait: true,
      });
    }
  }, [onSuccess, screenOrientation]);

  return (
    <div className="fit" ref={containerRef}>
      {horizontal ? <ContinuePhone /> : ""}
    </div>
  );
}

TutorialFrontId.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

const FrontId = ({ session, onSuccess, showError }) => {
  const containerRef = useRef();

  useEffect(() => {
    incode.renderCamera("front", containerRef.current, {
      onSuccess,
      onError: showError,
      token: session,
      numberOfTries: -1,
      nativeCamera: true,
    });
  }, [onSuccess, showError, session]);

  return <div ref={containerRef} />;
};

FrontId.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
};

const BackId = ({ session, onSuccess, showError }) => {
  const containerRef = useRef();

  useEffect(() => {
    incode.renderCamera("back", containerRef.current, {
      onSuccess,
      onError: showError,
      token: session,
      numberOfTries: -1,
      nativeCamera: true,
    });
  }, [onSuccess, showError, session]);

  return <div ref={containerRef} />;
};

BackId.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
};

function ProcessId({ session, onSuccess }) {
  useEffect(() => {
    incode.processId({ token: session.token }).then(() => {
      onSuccess();
    });
  }, [onSuccess, session]);

  return <p>Processing...</p>;
}

ProcessId.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

function Selfie({ session, onSuccess, showError }) {
  const containerRef = useRef();

  useEffect(() => {
    incode.renderCamera("selfie", containerRef.current, {
      onSuccess,
      onError: showError,
      token: session,
      numberOfTries: 3,
    });
  }, [onSuccess, showError, session]);

  return <div ref={containerRef} />;
}

Selfie.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
};

/* function Conference({ session, onSuccess, showError }) {
  const [status, setStatus] = useState();
  const containerRef = useRef();

  useEffect(() => {
    incode.renderConference(
      containerRef.current,
      {
        token: session
      },
      {
        onSuccess: (status) => {
          setStatus(status);
        },
        onError: (error) => {
          console.log("error", error);
          setStatus(error);
        },
        onLog: (...params) => console.log("onLog", ...params)
      }
    );
  }, [onSuccess, showError, session]);

  if (status) {
    return <p>Finished with status {status}</p>;
  }

  return <div ref={containerRef}></div>;
} */

function Onboarding() {
  const history = useHistory();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [session, setSession] = useState();
  const [step, setStep] = useState(0);
  const [error, setError] = useState(false);
  useEffect(() => {
    console.log("incode...");
    const script = document.createElement("script");
    script.src = "https://sdk-js.s3.amazonaws.com/sdk/onBoarding-1.30.1.js";
    document.body.appendChild(script);
    script.onload = () => {
      start();
      incode
        .createSession("ALL", null, {
          configurationId: "60f0969272a9270015196d70",
        })
        .then(async (sessionRes) => {
          await incode.warmup();
          setSession(sessionRes);
          console.log(`session:${Object.keys(sessionRes)}`);
          // toFinal(); <- for testing
        });
    };
  }, []);

  function goNext() {
    setStep(step + 1);
  }

  function toFinal() {
    let uid = "";
    incode
      .getFinishStatus(session.interviewId, { token: session.token })
      .then(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            uid = user.uid;
          }
        });
        const user = firebase.auth().currentUser;
        if (user) {
          uid = user.uid;
        }
        db.collection("users")
          .where("uid", "==", uid)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((document) => {
              db.collection("users")
                .doc(document.id)
                .update({ onboarding: true })
                .then(() => {
                  const saved = JSON.parse(localStorage.getItem("user"));
                  saved.onboarding = true;
                  localStorage.setItem("user", JSON.stringify(saved));
                  history.push("/finalStep");
                });
            });
          });
      });
  }

  function showError() {
    setError(true);
  }

  if (!session) {
    return (
      <div className="loading">
        <img src={loading} className="loadgif" alt="loading..." />
      </div>
    );
  }
  if (error) return "Error!";
  return (
    <Steps currentStep={step}>
      <TutorialFrontId onSuccess={goNext} />
      <FrontId session={session} onSuccess={goNext} showError={showError} />
      <BackId session={session} onSuccess={goNext} showError={showError} />
      <ProcessId session={session} onSuccess={goNext} />
      <Selfie
        session={session}
        onSuccess={toFinal}
        showError={showError}
        /* const response = await saveUser(session.token);
          if (response) {
            console.log("response:" + response); */
      />
    </Steps>
  );
}
export default Onboarding;
