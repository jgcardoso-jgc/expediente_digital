/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
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
import "./App.css";
import UserInit from "./components/user/user_init";
//import ProtectedRoute from "./ProtectedRoute";

const useStyles = createUseStyles({
  "@global": {
    initBt: {
      backgroundColor: "rgb(75, 75, 75)",
      color: "white",
      border: "1px solid black",
      display: "block",
      marginLeft: "auto",
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
        querySnapshot.forEach((documentSnapshot) => {
          const data = documentSnapshot.data();
          if (data.admin) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    });
  }

  function exit() {
    setUser(false);
    setAdmin(false);
    setLoading(false);
  }

  async function authState() {
    firebase.auth().onAuthStateChanged(async (res) => {
      if (res) {
        console.log(res.uid);
        const { uid } = res;
        const isAdmin = localStorage.getItem("admin");
        if (isAdmin === null) {
          await checkAdmin(uid).then((adminRes) => {
            if (adminRes) {
              localStorage.setItem("admin", true);
              setAdmin(true);
              setLoading(false);
            } else {
              setUser(true);
              setLoading(false);
            }
          });
        } else if (isAdmin) {
          setAdmin(true);
          setLoading(false);
        } else {
          setUser(true);
          setLoading(false);
        }
      } else {
        exit();
      }
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
