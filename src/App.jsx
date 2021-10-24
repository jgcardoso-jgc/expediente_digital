/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useFirebaseApp } from "reactfire";
import { createUseStyles } from "react-jss";
import Login from "./components/main/mainPage/mainPage";
import LoginNormal from "./components/main/loginNormal/loginNormal";
import RegisterNormal from "./components/main/registerNormal/registerNormal";
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
  const db = firebase.firestore();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(false);
  const [admin, setAdmin] = useState(false);

  async function checkAdmin(uid) {
    return new Promise((resolve) => {
      const query = db.collection("users").where("uid", "==", uid);
      query.get().then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.admin) {
              localStorage.setItem("admin", true);
              resolve("isAdmin");
            } else {
              let cargo = "";
              if (data.cargo != null) {
                cargo = data.cargo;
              }
              const userData = {
                fullName: data.fullname,
                email: data.email,
                rfc: data.rfc,
                onboarding: data.onboarding,
                cargo,
                token: "",
              };
              localStorage.setItem("user", JSON.stringify(userData));
              resolve("isUser");
            }
          });
        } else {
          resolve("404");
        }
      });
    });
  }

  async function authState() {
    firebase.auth().onAuthStateChanged(async (res) => {
      if (res) {
        const { uid } = res;
        const isAdmin = localStorage.getItem("admin");
        const isUser = localStorage.getItem("user");
        if (isAdmin === null && isUser === null) {
          await checkAdmin(uid).then((adminRes) => {
            if (adminRes === "isAdmin") {
              setAdmin(true);
            }
            if (adminRes === "isUser") {
              setUser(true);
            }
          });
        } else if (isAdmin) {
          setAdmin(true);
        } else {
          setUser(true);
        }
      } else {
        setUser(false);
        setAdmin(false);
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    authState();
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
    return <div className="App">Cargando...</div>;
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
            return <LoginNormal />;
          }}
        />
        <Route path="/registerNormal">
          <RegisterNormal />
        </Route>
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
            return <LoginNormal />;
          }}
        />
      </Switch>
    </Router>
  );
}

export default App;
