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

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isUserAuthenticated: false,
    };
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
                <Redirect to="/login" />
              )
            }
          />
          {/* Registro & Login */}
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/hello">
            <Hello />
          </Route>
          <Route path="/toOnboarding">
            <ToOnBoarding />
          </Route>
          <Route path="/onboard">
            <Onboarding />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/finalStep">
            <FinalStep />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
