import React from "react";
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
//import { useFirebaseApp } from "reactfire";

function App() {
  //const firebase = useFirebaseApp();

  function auth() {
    if (localStorage.getItem("user") === null) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() =>
            auth() ? <Redirect to="/login" /> : <Redirect to="/dashboard" />
          }
        />
        {/* Registro & Login */}
        <Route
          path="/login"
          render={() => (auth() ? <Dashboard /> : <Login />)}
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
          render={() => (auth() ? <Dashboard /> : <Login />)}
        ></Route>
        <Route path="/finalStep">
          <FinalStep />
        </Route>
        <Route path="/documents">
          <Documents />
        </Route>
        <Route path="/loginNormal">
          <LoginNormal />
        </Route>
        <Route path="/registerNormal">
          <RegisterNormal />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
