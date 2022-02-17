/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import { Accordion, Badge } from "react-bootstrap";
import React from "react";
import PropTypes from "prop-types";

const CancelledThirdsDocuments = (props) => {
  let { cancelledByThirds } = props;
  const { seguriSignController } = props;

  if (cancelledByThirds === "404") {
    cancelledByThirds = [];
  }

  return (
    <Accordion bsPrefix="seguridata" flush style={{ position: "inherit" }}>
      <Accordion.Header>
        <Badge style={{ marginRight: 16 }} pill bg="dark">
          {cancelledByThirds.length}
        </Badge>
        Cancelados Por Terceros
      </Accordion.Header>
      <Accordion.Body bsPrefix="seguridata-btn">
        <Accordion flush>
          {cancelledByThirds.map((item, index) => (
            <Accordion.Item eventKey={index + 1}>
              <Accordion.Header>{item.fileName}</Accordion.Header>
              <Accordion.Body>
                <div align="center">
                  <div style={{ marginLeft: "2rem" }} align="left">
                    <li>Tipo de documento: {item.docType}</li>
                    <li>Fecha de cancelación: {item.dateCancel}</li>
                    <li>Cancelado por: {item.canceledBy}</li>
                    <li>Motivo de cancelación: {item.reasonCancelDocument}</li>
                  </div>
                  <br />
                  <button
                    type="button"
                    className="btn-seguridata-lg"
                    onClick={() =>
                      seguriSignController
                        .getDocument(item.multilateralId)
                        .then((docUrl) => {
                          window.open(`data:application/pdf;base64,${docUrl}`);
                        })
                    }
                  >
                    Descargar
                  </button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Accordion.Body>
    </Accordion>
  );
};

CancelledThirdsDocuments.propTypes = {
  cancelledByThirds: PropTypes.any.isRequired,
  seguriSignController: PropTypes.any.isRequired,
};

export default CancelledThirdsDocuments;
