/* eslint-disable comma-dangle */
/* eslint-disable react/no-typos */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import PropTypes from "prop-types";
import { createUseStyles } from "react-jss";
import CustomToasts from "../../Toasts/CustomToasts";
import UploadPopup from "../UploadPopup/UploadPopup";
import SignedDocuments from "./SignedDocuments/SignedDocuments";
import UnsignedDocuments from "./UnsignedDocuments/UnsignedDocuments";
import CancelledDocuments from "./CancelledDocuments/CancelledDocuments";
import CancelledThirdsDocuments from "./CancelledThirdsDocuments/CancelledThirdsDocuments";
import ExpiredDocuments from "./ExpiredDocuments/ExpiredDocuments";
import UserController from "../controller/user_controller";

const useStyles = createUseStyles(() => ({
  card: {
    backgroundColor: "#f5f5f5",
    border: `1px solid #f5f5f5`,
    borderRadius: 10,
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
    height: "100%",
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
}));

const SegurisignDocuments = (props) => {
  const userController = new UserController();
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
  useEffect(() => {
    if (!location.isEnabled) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            loading: false,
            isEnabled: true,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
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
    }
  }, [location]);

  const getDocuments = async () => {
    const [
      signedDoc,
      unsignedDoc,
      cancelledDoc,
      expiredDoc,
      cancelledByThirdsDoc,
    ] = await Promise.all([
      userController.getUserDocs('CONCLUIDO'),
      userController.getUserDocs('PENDIENTE'),
      props.seguriSignController.getStatus("CANCELADOS"),
      props.seguriSignController.getStatus("EXPIRADOS"),
      props.seguriSignController.getStatus("CANCELADOS_TERCEROS"),
    ]);

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
    return <div>Cargando...</div>;
  }
  if (location.isEnabled) {
    if (loaded.hasLoaded) {
      return (
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
          <UploadPopup
            seguriSignController={props.seguriSignController}
            toaster={toaster}
          />
        </div>
      );
    }
    if (loaded.loading) {
      return <div>Cargando...</div>;
    }
  }
  return (
    <div className="centered">
      <h2>Necesitas activar tu ubicación</h2>
    </div>
  );
};

export default SegurisignDocuments;
