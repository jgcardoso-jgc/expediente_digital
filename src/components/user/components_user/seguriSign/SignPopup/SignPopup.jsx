/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable comma-dangle */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useRef, useState } from "react";
import Popup from "reactjs-popup";
import { ToastContainer } from "react-toastify";
import Card from "react-bootstrap/Card";
import { Col } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import { createUseStyles } from "react-jss";
import UserController from "../controller/user_controller";
import HelloInitSign from "../../hello-sign/hello";
import signGif from "../../../../../assets/sign.gif";

const useStyles = createUseStyles(() => ({
  border: { border: "3px solid black", marginBottom: 14 },
  firmarBt: {
    backgroundColor: "rgb(75, 75, 75)",
    color: "white",
    border: "1px solid black",
    display: "block",
    marginLeft: "auto",
    marginRight: 0,
    minWidth: "150px",
    paddingTop: "10px",
    paddingBottom: "10px",
    fontSize: "15px",
    borderRadius: "10px",
  },
  signImg: {
    maxWidth: 200,
    marginBottom: 20,
  },
  flex: {
    display: "flex",
  },
  title: {
    marginTop: 5,
    marginBottom: 14,
  },
}));

const SignPopUP = (props) => {
  const sigCanvas = useRef({});
  const { seguriSignController } = props;
  const classes = useStyles();
  const { multilateralId } = props;
  const { lat } = props;
  const { long } = props;
  const { toaster } = props;
  const { requiresFaceMatch } = props;
  const clear = () => sigCanvas.current.clear();
  const userController = new UserController();
  const [loading, setLoading] = useState(false);
  const [faceMatched, setFaceMatched] = useState(false);
  const sign = async () => {
    const signedSuccessfully = await seguriSignController.biometricSignature(
      sigCanvas.current,
      multilateralId,
      lat,
      long
    );
    if (signedSuccessfully) {
      console.log(signedSuccessfully);
    } else {
      console.log("Error al firmar");
    }
    return signedSuccessfully;
  };

  if (!requiresFaceMatch || faceMatched) {
    return (
      <div>
        <Popup
          modal
          trigger={
            <button
              type="button"
              style={{ width: "100%" }}
              className="btn-seguridata-lg"
            >
              Firmar
            </button>
          }
        >
          {(close) => (
            <div align="center">
              <Card style={{}}>
                <Card.Body>
                  <Card.Title className={classes.title}>
                    <b>ONESeguridata</b> | Firmar documento
                  </Card.Title>
                  <img className={classes.signImg} src={signGif} alt="sign" />
                  <Col className={classes.border}>
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: "sigCanvas",
                      }}
                    />
                  </Col>

                  <div className={classes.flex}>
                    <Button variant="outline-dark" onClick={close}>
                      Cerrar
                    </Button>
                    <Button
                      variant="outline-dark"
                      style={{ "margin-left": "2rem" }}
                      onClick={clear}
                    >
                      Borrar
                    </Button>
                    <button
                      className={classes.firmarBt}
                      type="button"
                      onClick={async () => {
                        setLoading(true);
                        const status = await sign();
                        if (status) {
                          await userController.updateDocSigned(
                            props.multilateralId,
                            { lat: props.lat, long: props.long }
                          );
                          toaster.successToast("Documento firmado con éxito");
                        } else {
                          props.toaster.errorToast("Error al firmar documento");
                        }
                        setLoading(false);
                        close();
                      }}
                    >
                      Firmar
                    </button>
                    {loading ? <div>cargando...</div> : ""}
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Popup>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Popup
        modal
        trigger={
          <button
            type="button"
            style={{ width: "100%" }}
            className="btn-seguridata-lg"
          >
            Firmar
          </button>
        }
      >
        {(close) => (
          <div align="center">
            <Card style={{}}>
              <Card.Body>
                <Card.Title>Firmar documento</Card.Title>
                <div>
                  <HelloInitSign
                    toaster={props.toaster}
                    setFaceMatched={setFaceMatched}
                  />
                </div>
                <Col>
                  <Button variant="outline-dark" onClick={close}>
                    Cerrar
                  </Button>
                </Col>
              </Card.Body>
            </Card>
          </div>
        )}
      </Popup>
    </div>
  );
};

SignPopUP.propTypes = {
  seguriSignController: PropTypes.any.isRequired,
  lat: PropTypes.any.isRequired,
  long: PropTypes.any.isRequired,
  requiresFaceMatch: PropTypes.any.isRequired,
  multilateralId: PropTypes.any.isRequired,
  toaster: PropTypes.any.isRequired,
};
export default SignPopUP;
