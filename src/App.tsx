/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import { createUseStyles } from "react-jss";
import Login from "./components/main/mainPage/mainPage";
import LoginNormal from "./components/main/loginNormal/loginNormal";
import RecoverPassword from "./components/main/recoverPassword/recoverPassword";
import AdminInit from "./components/admin/admin_init";
import PrivacidadView from "./components/main/privacidad/privacidad";
import TerminosView from "./components/main/terminos/terminos";
import "./App.css";
import UserInit from "./components/user/user_init";

const useStyles = createUseStyles({
  "@global": {
    initBt: {
      backgroundColor: "rgb(75, 75, 75)",
      color: "white",
      border: "1px solid black",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      minWidth: "150px",
      paddingTop: "10px",
      marginTop: "20px",
      paddingBottom: "10px",
      fontSize: "15px",
      borderRadius: "10px",
    },
  },
});

function App() {
  useStyles();
  const firebase = useFirebaseApp();
  const auth = firebase.auth();
  const [user, setUser] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  function authState() {
    const isAdmin = localStorage.getItem("admin");
    const isUser = localStorage.getItem("user");
    if (isAdmin) {
      return "admin";
    }
    if (isUser) {
      return "user";
    }
    return "logout";
  }

  const afterInit = () => {
    auth.onAuthStateChanged((userState) => {
      if (userState) {
        //detect type of user
        const state = authState();
        if (state === "user") {
          setUser(true);
          setLoading(false);
        }
        if (state === "admin") {
          setAdmin(true);
          setLoading(false);
        }
        if (state === "logout") {
          console.log("logged out");
          //prevent logout before query
          auth.signOut().then(() => {
            setLoading(false);
          });
        }
      } else {
        //destroy all user data
        setLoading(false);
      }
    });
  };

  const setLog = useCallback((log) => {
    setLogged(log);
  }, []);

  useEffect(() => {
    afterInit();
  }, [logged]);

  if (loading) {
    return "";
  }

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            if (user) {
              return <UserInit />;
            }
            if (admin) {
              return <AdminInit />;
            }
            return <Login />;
          }}
        />
        {/* Registro & Login */}
        <Route
          path="/loginNormal"
          render={() => {
            if (user) {
              return <UserInit />;
            }
            if (admin) {
              return <AdminInit />;
            }
            return <LoginNormal setLog={setLog} />;
          }}
        />
        <Route path="/recoverPassword">
          <RecoverPassword />
        </Route>
        <Route path="/terminos">
          <TerminosView />
        </Route>
        <Route path="/privacidad">
          <PrivacidadView />
        </Route>
        <Route
          path="/"
          render={() => {
            if (user) {
              return <UserInit />;
            }
            if (admin) {
              return <AdminInit />;
            }
            return <LoginNormal setLog={setLog} />;
          }}
        />
      </Switch>
    </Router>
  );
}

export default App;
