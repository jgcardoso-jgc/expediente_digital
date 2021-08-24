/* eslint-disable react/forbid-prop-types */
/* eslint-disable quotes */
import Popup from "reactjs-popup";
import Card from "react-bootstrap/Card";
import { Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import CustomLoader from "../CustomLoader/CustomLoader";

const CancelPopup = (props) => {
  const reasonText = useRef(null);
  const [loading, setLoading] = useState(false);
  const { seguriSignController } = props;
  const { toaster } = props;
  const { multilateralId } = props;
  const cancel = () => {
    setLoading(true);
    seguriSignController
      .cancelDocument(multilateralId, reasonText.current.value)
      .then((result) => {
        setLoading(false);
        if (result) {
          toaster.successToast("Documento cancelado con éxito");
        } else {
          toaster.errorToast("Error al cancelar documento, intente de nuevo");
        }
      })
      .catch((err) => {
        toaster.errorToast(err);
        setLoading(false);
      });
  };
  return (
    <div>
      <Popup modal trigger={<Button variant="outline-dark">Cancelar</Button>}>
        {(close) => (
          <div align="center">
            {loading ? (
              <CustomLoader />
            ) : (
              <Card style={{}}>
                <Card.Body>
                  <Card.Title>Cancelar documento</Card.Title>
                  <Col>
                    <textarea className="input-cancel" ref={reasonText}>
                      Escribe el motivo de la cancelación
                    </textarea>
                  </Col>
                  <Col>
                    <Button variant="outline-dark" onClick={close}>
                      Cerrar
                    </Button>
                    <button
                      type="button"
                      className="btn-seguridata-lg"
                      style={{ "margin-left": "2rem" }}
                      onClick={cancel}
                    >
                      Cancelar
                    </button>
                  </Col>
                </Card.Body>
              </Card>
            )}
          </div>
        )}
      </Popup>
    </div>
  );
};

CancelPopup.propTypes = {
  seguriSignController: PropTypes.any.isRequired,
  toaster: PropTypes.any.isRequired,
  multilateralId: PropTypes.any.isRequired,
};

export default CancelPopup;
