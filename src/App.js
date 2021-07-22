import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Login from "./components/mainPage/Login";
import Hello from "./components/hello/hello";
import Onboarding from "./components/onboarding/onboarding";
import Dashboard from "./components/dashboard/dashboard";
import FinalStep from "./components/finalSteps/finalStep";
import ToOnBoarding from "./components/toOnboarding/toOnboarding";
import Documents from "./components/documents/documents";
import LoginNormal from "./components/loginNormal/loginNormal";
import RegisterNormal from "./components/registerNormal/registerNormal";
import RecoverPassword from "./components/recoverPassword/recoverPassword";
import { useFirebaseApp } from "reactfire";
import "./App.css";

function App() {
  const firebase = useFirebaseApp();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log("logged");
        console.log(user.uid);
        setUser(true);
        setLoading(false);
        return;
      } else {
        console.log(" not logged");
        setUser(false);
        setLoading(false);
        return;
      }
    });
    /* después del estado inicial */
    const user = firebase.auth().currentUser;
    if (user) {
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
          render={() =>
            user ? <Redirect to="/login" /> : <Redirect to="/dashboard" />
          }
        />
        {/* Registro & Login */}
        <Route
          path="/login"
          render={() => (user ? <Dashboard /> : <Login />)}
        ></Route>
        <Route path="/hello">
          <Hello />
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
        ></Route>
        <Route path="/finalStep">
          <FinalStep />
        </Route>
        <Route
          path="/documents"
          render={() => (user ? <Documents /> : <Login />)}
        ></Route>
        <Route path="/loginNormal">
          <LoginNormal />
        </Route>
        <Route path="/registerNormal">
          <RegisterNormal />
        </Route>
        <Route path="/recoverPassword">
          <RecoverPassword />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
