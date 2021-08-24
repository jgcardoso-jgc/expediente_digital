/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import { ToastContainer } from "react-toastify";
import { ReactSession } from "react-client-session";
import SegurisignController from "./controller/segurisign_controller";
import "./segurisign.css";
import SegurisignDocuments from "./SegurisignDocuments/SegurisignDocuments";
import CustomToasts from "../Toasts/CustomToasts";

const seguriSignController = new SegurisignController();

const Segurisign = () => {
  const passwordRef = useRef(null);
  const toaster = new CustomToasts();
  const [logged, setLogged] = useState(false);
  const [loadedCache, setLoadedCache] = useState(false);
  const [loading, setLoading] = useState(true);
  ReactSession.setStoreType("sessionStorage");

  const signIn = (e) => {
    setLoading(true);
    e.preventDefault();
    seguriSignController
      .loginUser(passwordRef.current.value)
      .then((value) => {
        setLogged(value);
        ReactSession.set(
          "sign-user",
          JSON.stringify(seguriSignController.segurisignUser)
        );
      })
      .catch((error) => {
        toaster.errorToast(error);
        setLogged(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!loadedCache) {
      const cookie = ReactSession.get("sign-user");
      if (cookie) {
        seguriSignController.segurisignUser = JSON.parse(cookie);
        setLogged(true);
      }
      setLoadedCache(true);
      setLoading(false);
    }
  }, [loadedCache]);

  return (
    <div>
      <ToastContainer />
      {() => {
        if (logged) {
          return (
            <SegurisignDocuments seguriSignController={seguriSignController} />
          );
        }
        if (loading) {
          return <div>Cargando...</div>;
        }
        return (
          <div className="centered box-shadow">
            <Card style={{ width: "18rem" }}>
              <Card.Header as="h5">Ingresa tu contraseña</Card.Header>
              <Card.Body className="box-shadow">
                <Card.Text>
                  <div>
                    <form>
                      <input
                        className="input-password-sign"
                        ref={passwordRef}
                        type="password"
                      />
                    </form>
                  </div>
                </Card.Text>
                <button
                  type="button"
                  className="btn-seguridata"
                  onClick={signIn}
                >
                  Entrar
                </button>
              </Card.Body>
            </Card>
          </div>
        );
      }}
    </div>
  );
};

export default Segurisign;
