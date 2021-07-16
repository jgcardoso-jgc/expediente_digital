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

class App extends React.Component {
  constructor() {
    super();
    if (localStorage.getItem("user") === null) {
      this.state = {
        isUserAuthenticated: false,
      };
    } else {
      this.state = {
        isUserAuthenticated: true,
      };
    }
  }

  auth() {
    if (localStorage.getItem("user") === null) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { isUserAuthenticated } = this.state;
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              isUserAuthenticated ? (
                <Redirect to="/login" />
              ) : (
                <Redirect to="/dashboard" />
              )
            }
          />
          {/* Registro & Login */}
          <Route
            path="/login"
            render={() => (isUserAuthenticated ? <Dashboard /> : <Login />)}
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
            render={() => (this.auth() ? <Dashboard /> : <Login />)}
          ></Route>
          <Route path="/finalStep">
            <FinalStep />
          </Route>
          <Route path="/documents">
            <Documents />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
