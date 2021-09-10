/* eslint-disable import/no-named-as-default */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createUseStyles } from "react-jss";
import loading from "../../../../assets/loading.gif";
import styles from "../../../../resources/theme";
import settings from "./settings";
import onboardingSDK from "../../../../config/onboarding-config";

let incode = null;

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles({
  mrAuto: {
    marginRight: "auto",
  },
});

function HelloInit() {
  const global = globalTheme();
  const classes = useStyles();
  const history = useHistory();
  const [session, setSession] = useState("");
  const configID = onboardingSDK.idConfig;

  function RenderLogin({ onSuccess, onError }) {
    const containerRef = useRef();
    useEffect(() => {
      incode.renderLogin(containerRef.current, {
        // token: session,
        onSuccess,
        onError,
      });
    }, [onSuccess, onError]);

    return <div ref={containerRef} />;
  }

  const success = (r) => {
    const saved = JSON.parse(localStorage.getItem("user"));
    saved.token = r.token;
    localStorage.setItem("user", JSON.stringify(saved));
    history.push("/documentos");
  };

  const error = () => {
    history.push({ pathname: "/toOnboarding", state: { reload: true } });
  };

  useEffect(() => {
    incode = window.OnBoarding.create(settings);
    incode
      .createSession("ALL", null, {
        configurationId: configID,
      })
      .then(async (sessionRes) => {
        await incode.warmup();
        console.log(`session:${Object.keys(sessionRes)}`);
        setSession(sessionRes);
      });
  }, []);

  return (
    <div className="App">
      <h2 className="faceTitle">Facematch</h2>
      {session !== "" ? (
        <RenderLogin session={session} onSuccess={success} onError={error} />
      ) : (
        <img src={loading} className="loadgif" alt="loading..." />
      )}
      <button
        type="button"
        onClick={() => window.location.reload(true)}
        className={`${global.initBt} ${classes.mrAuto}`}
      >
        ¿Tienes problemas?
      </button>
    </div>
  );
}

export default HelloInit;
