/* eslint-disable comma-dangle */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useRef, useState } from "react";
import Popup from "reactjs-popup";
import Card from "react-bootstrap/Card";
import { Col } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import UserController from "../controller/user_controller";

const SignPopUP = (props) => {
  const sigCanvas = useRef({});
  const { seguriSignController } = props;
  const { multilateralId } = props;
  const { lat } = props;
  const { long } = props;
  const { toaster } = props;
  const clear = () => sigCanvas.current.clear();
  const userController = new UserController();
  const [loading, setLoading] = useState(false);
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
                <Card.Title>Firmar documento</Card.Title>
                <Col>
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

                <Col>
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
                    className="btn-seguridata-lg"
                    type="button"
                    style={{
                      height: "3rem",
                      width: "9rem",
                      "margin-left": "3rem",
                    }}
                    onClick={async () => {
                      setLoading(true);
                      const status = await sign();
                      if (status) {
                        await userController.updateDocSigned(
                          props.multilateralId
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
                  {loading ? <div>cargando...</div> : <div>Listo</div>}
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
  multilateralId: PropTypes.any.isRequired,
  toaster: PropTypes.any.isRequired,
};
export default SignPopUP;
