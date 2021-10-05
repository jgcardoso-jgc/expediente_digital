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
import { Col, Row, Form } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import { createUseStyles } from "react-jss";
import UserController from "../controller/user_controller";
import HelloInitSign from "../../hello-sign/hello";
import signGif from "../../../../../assets/sign.gif";
import loadingGif from "../../../../../assets/loading.gif";

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
  loadGif: {
    maxWidth: 50,
  },
  signImg: {
    maxWidth: 200,
    marginBottom: 20,
  },
  flex: {
    display: "flex",
  },
  loadingBlock: {
    display: "block",
  },
  title: {
    marginTop: 5,
    marginBottom: 14,
  },
}));

const SignPopUP = (props) => {
  const sigCanvas = useRef({});
  const passwordRef = useRef('');
  const { seguriSignController } = props;
  const classes = useStyles();
  const { multilateralId } = props;
  const { lat } = props;
  const { long } = props;
  const { toaster } = props;
  const { requiresFaceMatch } = props;
  const userController = new UserController();
  const [loading, setLoading] = useState(false);
  const [signType, setSignType] = useState('');
  const [docHash, setDocHash] = useState('');
  const [faceMatched, setFaceMatched] = useState(false);
  const clear = () => sigCanvas.current.clear();
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

  const signPkcs7 = async () => {
    const signedSuccessfully = await seguriSignController.pkcs7(
      multilateralId,
      passwordRef.current.value
    );
    if (signedSuccessfully) {
      console.log(signedSuccessfully);
    } else {
      console.log("Error al firmar");
    }
    return signedSuccessfully;
  };

  if (!requiresFaceMatch || faceMatched) {
    if (signType === 'fab') {
      return (
        <div>
          <Popup
            modal
            trigger={
              <button
                type="button"
                style={{ width: "100%" }}
                className={classes.firmarBt}
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
                    <p> Firma biométrica</p>
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
                    </div>
                    {loading ? (
                      <div className={classes.loadingBlock}>
                        <img
                          className={classes.loadGif}
                          src={loadingGif}
                          alt="load"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </Card.Body>
                </Card>
              </div>
            )}
          </Popup>
        </div>
      );
    }
    if (signType === 'server') {
      return (
        <div>
          <Popup
            modal
            trigger={
              <button
                type="button"
                style={{ width: "100%" }}
                className={classes.firmarBt}
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
                      <Row>
                        <Button onClick={async () => {
                          setLoading(true);
                          const hash = await seguriSignController.getHash(props.multilateralId);
                          setDocHash(hash);
                          setLoading(false);
                          close();
                        }}
                        >
                          Conseguir Hash
                        </Button>
                      </Row>
                      <Row>
                        <Form.Control type="text" placeholder="Hash" readOnly value={docHash} />
                        <Form.Control type="password" placeholder="Hash" ref={passwordRef} />
                      </Row>
                    </Col>
                    <p> Firma Avanzada</p>
                    <div className={classes.flex}>
                      <Button variant="outline-dark" onClick={close}>
                        Cerrar
                      </Button>
                      <button
                        className={classes.firmarBt}
                        type="button"
                        onClick={async () => {
                          setLoading(true);
                          const status = await signPkcs7();
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
                    </div>
                    {loading ? (
                      <div className={classes.loadingBlock}>
                        <img
                          className={classes.loadGif}
                          src={loadingGif}
                          alt="load"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </Card.Body>
                </Card>
              </div>
            )}
          </Popup>
        </div>
      );
    }
    if (signType === '') {
      return (
        <div>
          <Popup
            modal
            trigger={
              <button
                type="button"
                style={{ width: "100%" }}
                className={classes.firmarBt}
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
                    <div className={classes.flex}>
                      <Button variant="outline-dark" onClick={close}>
                        Cerrar
                      </Button>
                      <Button
                        variant="outline-dark"
                        onClick={() => {
                          setSignType('server');
                        }}
                      >
                        Firma Avanzada
                      </Button>
                      <Button
                        variant="outline-dark"
                        onClick={() => {
                          setSignType('fab');
                        }}
                      >
                        Firma Autógrafa Biométrica
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}
          </Popup>
        </div>
      );
    }
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
            className={classes.firmarBt}
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
