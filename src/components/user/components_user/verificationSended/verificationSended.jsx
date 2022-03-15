/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";

const VerificationSended = () => {
  const actionCodeSettings = {
    url: "https://expediente-digital.vercel.app/"
  };
  const firebase = useFirebaseApp();
  const auth = firebase.auth();
  const [text, setText] = useState("");
  function enviar() {
    if (!auth.currentUser.emailVerified) {
      setText("Enviando...");
      auth.currentUser
        .sendEmailVerification(actionCodeSettings)
        .then(() => {
          setText("Confirmación enviada");
        })
        .catch((e) => {
          setText(`Ocurrió el siguiente error:${e}`);
        });
    } else {
      setText("El correo ya se ha verificado.");
    }
  }
  useEffect(() => {
    enviar();
  }, []);
  return <div>{text}</div>;
};

export default VerificationSended;
