/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import { Accordion } from "react-bootstrap";
import React from "react";
import PropTypes from "prop-types";

const ExpiredDocuments = (props) => {
  let { expiredDoc } = props;
  const { seguriSignController } = props;

  if (expiredDoc === "404") {
    expiredDoc = [];
  }

  return (
    <Accordion bsPrefix="seguridata" flush style={{ position: "inherit" }}>
      <Accordion.Header>Expirados</Accordion.Header>
      <Accordion.Body bsPrefix="seguridata-btn">
        <Accordion flush>
          {expiredDoc.map((item, index) => (
            <Accordion.Item eventKey={index + 1}>
              <Accordion.Header>{item.fileName}</Accordion.Header>
              <Accordion.Body>
                <div align="center">
                  <div style={{ "margin-left": "2rem" }} align="left">
                    <li>Tipo de documento: {item.docType}</li>
                    <li>Fecha de cancelación: {item.dateCancel}</li>
                    <li>Cancelado por: {item.dateCancel}</li>
                    <li>Motivo de cancelación: {item.dateCancel}</li>
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

ExpiredDocuments.propTypes = {
  expiredDoc: PropTypes.any.isRequired,
  seguriSignController: PropTypes.any.isRequired,
};

export default ExpiredDocuments;
