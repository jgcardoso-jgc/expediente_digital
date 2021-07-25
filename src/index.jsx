/* eslint-disable quotes */
/* eslint-disable comma-dangle */
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { FirebaseAppProvider } from "reactfire";
import App from "./App";
import { firebaseConfig } from "./config/firebase-config";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Suspense fallback="">
        <App />
      </Suspense>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
