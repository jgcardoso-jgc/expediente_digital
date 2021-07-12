// check public/index.html
import { useEffect, useRef, useState } from "react";
import Steps from "./Steps";
import "./styles.css";

const apiURL = "https://demo-api.incodesmile.com/";
const apiKey = "570c70d1693636fdc200713415ebc3973afbdf19";
var incode = null;
//    <script src="https://sdk-js.s3.amazonaws.com/sdk/onBoarding-1.30.1.js"></script>
function start() {
  incode = window.OnBoarding.create({
    apiKey: apiKey,
    apiURL: apiURL,
    lang: "es",
    theme: {
      main: "red",
      mainButton: {
        borderRadius: "20px",
        color: "white",
        border: "2px solid black",
      },
    },
    translations: {
      tutorial: {
        front1: "Seguridata Onboarding",
        front2: "Scan ID",
        back1: "Now scan the ",
        back2: "back side ",
        back3: "of your ID",
        selfie1: "Let's take a selfie",
        selfie2: "Keep a neutral expression, find balanced",
        selfie3: "light and remove any glasses and hats",
        passport1: "Align your passport to the frame and take a photo",
        passport2: "Position just the page with the photo",
      },
    },
  });
}

function TutorialFrontId({ token, onSuccess }) {
  const containerRef = useRef();

  useEffect(() => {
    incode.renderFrontTutorial(containerRef.current, {
      onSuccess,
      noWait: true,
    });
  }, [onSuccess]);

  return <div ref={containerRef}></div>;
}

function FrontId({ session, onSuccess, showError }) {
  const containerRef = useRef();

  useEffect(() => {
    incode.renderCamera("front", containerRef.current, {
      onSuccess,
      onError: showError,
      token: session,
      numberOfTries: -1,
    });
  }, [onSuccess, showError, session]);

  return <div ref={containerRef}></div>;
}

function BackId({ session, onSuccess, showError }) {
  const containerRef = useRef();

  useEffect(() => {
    incode.renderCamera("back", containerRef.current, {
      onSuccess,
      onError: showError,
      token: session,
      numberOfTries: -1,
    });
  }, [onSuccess, showError, session]);

  return <div ref={containerRef}></div>;
}

function ProcessId({ session, onSuccess }) {
  useEffect(() => {
    incode.processId({ token: session.token }).then(() => {
      onSuccess();
    });
  }, [onSuccess, session]);

  return <p>Processing...</p>;
}

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

  return <div ref={containerRef}></div>;
}

/*function Conference({ session, onSuccess, showError }) {
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
}*/

function Onboarding() {
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
      incode.createSession("ALL").then(async (session) => {
        await incode.warmup();
        setSession(session);
      });
    };
  }, []);

  function goNext() {
    setStep(step + 1);
  }

  function showError() {
    setError(true);
  }

  if (!session) return "loading";
  if (error) return "Error!";
  return (
    <Steps currentStep={step}>
      <TutorialFrontId onSuccess={goNext} />
      <FrontId session={session} onSuccess={goNext} showError={showError} />
      <BackId session={session} onSuccess={goNext} showError={showError} />
      <ProcessId session={session} onSuccess={goNext} />
      <Selfie session={session} onSuccess={goNext} showError={showError} />
    </Steps>
  );
}
export default Onboarding;
