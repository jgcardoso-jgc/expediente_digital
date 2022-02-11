/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-typos */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import PropTypes from "prop-types";
import { createUseStyles } from "react-jss";
import CustomToasts from "../../../user/components_user/Toasts/CustomToasts";
import UploadPopup from "../UploadPopup/UploadPopup";
import SignedDocuments from "./SignedDocuments/SignedDocuments";
import UnsignedDocuments from "./UnsignedDocuments/UnsignedDocuments";
import CancelledDocuments from "./CancelledDocuments/CancelledDocuments";
import CancelledThirdsDocuments from "./CancelledThirdsDocuments/CancelledThirdsDocuments";
import ExpiredDocuments from "./ExpiredDocuments/ExpiredDocuments";
import UserController from "../controller/user_controller";
import loading from "../../../../assets/loading.gif";

const useStyles = createUseStyles(() => ({
  card: {
    backgroundColor: "#f5f5f5",
    border: `1px solid #f5f5f5`,
    borderRadius: 10,
    marginBottom: 24,
    height: "100%",
    padding: 20,
  },
  imgLoading: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  center: {
    textAlign: "center",
  },
  title: {
    marginBottom: 20,
  },
  mr: {
    marginRight: "auto",
  },
}));

const SegurisignDocuments = (props) => {
  const { seguriSignController } = props;
  const userController = new UserController(
    seguriSignController.segurisignUser.email
  );
  const [location, setLocation] = useState({
    loading: true,
    isEnabled: false,
    lat: 0,
    long: 0,
  });
  const classes = useStyles();
  const toaster = new CustomToasts();
  const [loaded, setLoaded] = useState({
    hasLoaded: false,
    signedDocuments: [],
    unsignedDocuments: [],
    cancelledDoc: [],
    expiredDoc: [],
    cancelledByThirds: [],
  });
  const timeOut = 15;

  function getPermissions() {
    return new Promise((resolve, reject) => {
      navigator.permissions &&
        navigator.permissions
          .query({ name: "geolocation" })
          .then((PermissionStatus) => {
            if (PermissionStatus.state === "granted") {
              resolve("granted");
            } else if (PermissionStatus.state === "prompt") {
              reject(new Error("Permiso denegado"));
            } else {
              reject(new Error("Permiso denegado"));
            }
          });
    });
  }

  const getPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        setLocation({
          loading: false,
          isEnabled: true,
          lat: latitude,
          lng: longitude,
        });
        const pos = { latitude, longitude };
        localStorage.setItem("position", JSON.stringify(pos));
      },
      () => {
        setLocation({
          loading: false,
          isEnabled: true,
          lat: 0,
          long: 0,
        });
      }
    );
  };

  const setTime = async () => {
    try {
      const permission = await getPermissions();
      if (permission === "granted") {
        const savedDate = localStorage.getItem("date");
        if (savedDate == null) {
          localStorage.setItem("date", new Date());
          getPosition();
        } else {
          const now = new Date();
          const past = new Date(localStorage.getItem("date"));
          const minutes = Math.floor((now - past) / 1000 / 60);
          if (minutes > timeOut) {
            localStorage.setItem("date", new Date());
            getPosition();
          } else {
            const position = localStorage.getItem("position");
            if (position) {
              setLocation({
                loading: false,
                isEnabled: true,
                lat: position.lat,
                lng: position.lng,
              });
              console.log("false");
            }
          }
        }
      }
    } catch (e) {
      setLocation({
        loading: false,
        isEnabled: false,
      });
    }
  };

  useEffect(() => {
    setTime();
  }, []);

  useEffect(() => {
    console.log(loaded.unsignedDocuments);
  }, [loaded]);

  const getDocuments = async () => {
    console.log("getting...");
    const [
      signedDoc,
      unsignedDoc,
      cancelledDoc,
      expiredDoc,
      cancelledByThirdsDoc,
    ] = await Promise.all([
      userController.getUserDocs("CONCLUIDO"),
      userController.getUserDocs("PENDIENTE"),
      userController.getUserDocs("CANCELADO"),
      props.seguriSignController.getStatus("EXPIRADOS"),
      props.seguriSignController.getStatus("CANCELADOS_TERCEROS"),
    ]);
    console.log(unsignedDoc);
    setLoaded({
      signedDocuments: signedDoc,
      hasLoaded: true,
      unsignedDocuments: unsignedDoc,
      cancelledDoc,
      expiredDoc,
      cancelledByThirds: cancelledByThirdsDoc,
    });
  };

  useEffect(() => {
    getDocuments();
  }, []);

  SegurisignDocuments.propTypes = {
    seguriSignController: PropTypes.any.isRequired,
  };

  if (location.loading) {
    return (
      <div className={classes.center}>
        <img className={classes.imgLoading} alt="load" src={loading} />
        <p className={classes.center}>Cargando tu ubicación...</p>
      </div>
    );
  }
  if (location.isEnabled) {
    if (loaded.hasLoaded) {
      return (
        <div>
          <div className={classes.card}>
            <ToastContainer />
            <h5 className={classes.title}>
              <b>Mis Documentos</b>
            </h5>
            <UnsignedDocuments
              lat={location.lat}
              long={location.long}
              toaster={toaster}
              unsignedDocuments={loaded.unsignedDocuments}
              seguriSignController={props.seguriSignController}
            />

            <SignedDocuments
              seguriSignController={props.seguriSignController}
              signedDocuments={loaded.signedDocuments}
            />

            <CancelledDocuments
              cancelledDoc={loaded.cancelledDoc}
              seguriSignController={props.seguriSignController}
            />

            <CancelledThirdsDocuments
              cancelledByThirds={loaded.cancelledByThirds}
              seguriSignController={props.seguriSignController}
            />

            <ExpiredDocuments
              expiredDoc={loaded.expiredDoc}
              seguriSignController={props.seguriSignController}
            />
          </div>
          <div className={classes.card}>
            <UploadPopup
              seguriSignController={props.seguriSignController}
              toaster={toaster}
            />
          </div>
        </div>
      );
    }
    if (loaded.loading) {
      return (
        <div className={classes.center}>
          <img className={classes.imgLoading} alt="load" src={loading} />
        </div>
      );
    }
  }
  if (!location.loaded && !location.isEnabled) {
    return (
      <div className="centered">
        <h2>Necesitas activar tu ubicación</h2>
      </div>
    );
  }
  return <div />;
};

export default SegurisignDocuments;
