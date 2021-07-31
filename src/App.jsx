/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import Login from "./components/main/mainPage/Login";
import HelloInit from "./components/user/hello/hello";
import Onboarding from "./components/user/onboarding/onboarding";
import Dashboard from "./components/user/dashboard/dashboard";
import FinalStep from "./components/user/finalSteps/finalStep";
import ToOnBoarding from "./components/user/toOnboarding/toOnboarding";
import Documents from "./components/user/documents/documents";
import LoginNormal from "./components/main/loginNormal/loginNormal";
import RegisterNormal from "./components/main/registerNormal/registerNormal";
import RecoverPassword from "./components/main/recoverPassword/recoverPassword";
import MyProfile from "./components/user/perfil/perfil";
import AlertasPagina from "./components/user/alertasPagina/alertasPagina";
import AdminInit from "./components/admin/admin_init";
import "./App.css";

function App() {
  const firebase = useFirebaseApp();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((res) => {
      if (res) {
        console.log("logged");
        console.log(res.uid);
        if (localStorage.getItem("admin")) {
          setAdmin(true);
          setLoading(false);
        } else {
          setAdmin(false);
          setUser(true);
          setLoading(false);
        }
      } else {
        console.log(" not logged");
        setUser(false);
        setLoading(false);
      }
    });
    /* después del estado inicial */
    const userAuth = firebase.auth().currentUser;
    if (userAuth) {
      if (localStorage.getItem("admin")) {
        setAdmin(true);
      } else {
        setUser(true);
      }
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
          render={() => {
            if (user) {
              return <Dashboard />;
            }
            if (admin) {
              return <AdminInit />;
            }
            return <Login />;
          }}
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
          render={() => {
            if (user) {
              return <Dashboard />;
            }
            if (admin) {
              return <AdminInit />;
            }
            return <Login />;
          }}
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
        <Route
          path="/loginNormal"
          render={() => {
            if (user) {
              return <Dashboard />;
            }
            if (admin) {
              return <AdminInit />;
            }
            return <LoginNormal />;
          }}
        />
        <Route path="/registerNormal">
          <RegisterNormal />
        </Route>
        <Route path="/recoverPassword">
          <RecoverPassword />
        </Route>
        <Route
          path="/admin"
          render={() => (admin ? <AdminInit /> : <Login />)}
        />
      </Switch>
    </Router>
  );
}

export default App;
