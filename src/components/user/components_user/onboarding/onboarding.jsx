/* eslint-disable operator-linebreak */
/* eslint-disable import/no-named-as-default */
/* eslint-disable comma-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { toast } from "react-toastify";
import Steps from "./Steps";
import loading from "../../../../assets/loading.gif";
import ContinuePhone from "../continuePhone/continuePhone";
import settings from "../../../../config/settings";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import onboardingSDK from "../../../../config/onboarding-config";

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

  return <div className="fit" ref={containerRef} />;
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

function Onboarding() {
  const history = useHistory();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const configID = onboardingSDK.idConfig;
  const [session, setSession] = useState("");
  const [step, setStep] = useState(0);
  const [error, setError] = useState(false);
  useEffect(() => {
    start();
    incode
      .createSession("ALL", null, {
        configurationId: configID,
      })
      .then(async (sessionRes) => {
        await incode.warmup();
        setSession(sessionRes);
        console.log(`session:${Object.keys(sessionRes)}`);
      });
  }, []);

  const goNext = () => {
    setStep(step + 1);
  };

  async function getCURP() {
    return new Promise((resolve, reject) => {
      const { token } = session;
      incode
        .ocrData({ token })
        .then((res) => {
          resolve(res.curp);
        })
        .catch((res) => reject(res));
    });
  }

  function save() {
    const saved = JSON.parse(localStorage.getItem("user"));
    saved.onboarding = true;
    localStorage.setItem("user", JSON.stringify(saved));
    history.push("/finalStep");
  }

  async function updateDocs(snapshot, clientID) {
    let curp = "";
    await getCURP()
      .then((res) => {
        curp = res;
      })
      .catch((curp = "error"));
    snapshot.docs.forEach(async (document) => {
      const doc = await db.collection("users").doc(document.id).get();
      let { documents } = doc.data();
      documents =
        ({
          name: "ID Frontal",
          imageName: "croppedFrontID",
          state: true,
          uploaded: true,
        },
        {
          name: "ID Reverso",
          imageName: "croppedBackID",
          uploaded: true,
          state: true,
        });
      db.collection("users")
        .doc(document.id)
        .update({
          onboarding: true,
          documents,
          curp,
          token: clientID,
        })
        .then(() => {
          save();
        });
    });
  }

  function checkAuth(id) {
    let uid = "";
    const clientID = id;
    {
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
        .then((snapshot) => updateDocs(snapshot, clientID));
    }
  }

  const toFinal = () => {
    // console.log(`interviewId:${session.interviewId}`);
    // console.log(`token:${session.token}`);
    const { interviewId } = session;
    incode
      .getFinishStatus(configID, { token: session.token })
      .then(() => checkAuth(interviewId))
      .catch((e) => {
        toast(e);
      });
  };

  const showError = () => {
    setError(true);
  };

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
      <Selfie session={session} onSuccess={toFinal} showError={showError} />
    </Steps>
  );
}
export default Onboarding;
