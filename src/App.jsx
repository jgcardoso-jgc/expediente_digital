/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import Login from "./components/mainPage/Login";
import HelloInit from "./components/hello/hello";
import Onboarding from "./components/onboarding/onboarding";
import Dashboard from "./components/dashboard/dashboard";
import FinalStep from "./components/finalSteps/finalStep";
import ToOnBoarding from "./components/toOnboarding/toOnboarding";
import Documents from "./components/documents/documents";
import LoginNormal from "./components/loginNormal/loginNormal";
import RegisterNormal from "./components/registerNormal/registerNormal";
import RecoverPassword from "./components/recoverPassword/recoverPassword";
import MyProfile from "./components/perfil/perfil";
import AlertasPagina from "./components/alertasPagina/alertasPagina";
import AdminInit from "./components/admin/admin_init";
import "./App.css";

function App() {
  const firebase = useFirebaseApp();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((res) => {
      if (res) {
        console.log("logged");
        console.log(user.uid);
        setUser(true);
        setLoading(false);
      } else {
        console.log(" not logged");
        setUser(false);
        setLoading(false);
      }
    });
    /* después del estado inicial */
    const userAuth = firebase.auth().currentUser;
    if (userAuth) {
      setUser(true);
    } else {
      setUser(false);
    }
  }, [firebase]);

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (user ? <Dashboard /> : <Login />)}
        />
        {/* Registro & Login */}
        <Route
          path="/login"
          render={() => (user ? <Dashboard /> : <Login />)}
        />
        <Route path="/hello">
          <HelloInit />
        </Route>
        <Route path="/toOnboarding">
          <ToOnBoarding />
        </Route>
        <Route path="/onboard">
          <Onboarding />
        </Route>
        <Route
          path="/dashboard"
          render={() => (user ? <Dashboard /> : <Login />)}
        />
        <Route path="/finalStep">
          <FinalStep />
        </Route>
        <Route
          path="/documents"
          render={() => (user ? <Documents /> : <Login />)}
        />
        <Route
          path="/perfil"
          render={() => (user ? <MyProfile /> : <Login />)}
        />
        <Route
          path="/alertas"
          render={() => (user ? <AlertasPagina /> : <Login />)}
        />
        <Route path="/loginNormal">
          <LoginNormal />
        </Route>
        <Route path="/registerNormal">
          <RegisterNormal />
        </Route>
        <Route path="/recoverPassword">
          <RecoverPassword />
        </Route>
        <Route path="/admin">
          <AdminInit />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
