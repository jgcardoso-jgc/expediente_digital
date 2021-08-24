/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
/* eslint-disable react/jsx-one-expression-per-line */
import { Accordion, Badge } from "react-bootstrap";
import React from "react";
import PropTypes from "prop-types";

const SignedDocuments = (props) => {
  const { signedDocuments } = props;
  const { seguriSignController } = props;
  return (
    <Accordion bsPrefix="seguridata" flush style={{ position: "inherit" }}>
      <Accordion.Header>
        Firmados
        <Badge style={{ marginLeft: "3rem" }} pill bg="secondary">
          {signedDocuments.length}
        </Badge>
      </Accordion.Header>
      <Accordion.Body>
        <Accordion flush>
          {signedDocuments.map((item, index) => (
            <Accordion.Item eventKey={index + 1}>
              <Accordion.Header>{item.fileName}</Accordion.Header>
              <Accordion.Body>
                <div align="center">
                  <div style={{ "margin-left": "2rem" }} align="left">
                    <li>Tipo de documento: {item.docType}</li>
                    <li>Número de firmas: {item.numberSignatures}</li>
                    <li>Fecha de firmado: {item.signDate}</li>
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

SignedDocuments.propTypes = {
  signedDocuments: PropTypes.any.isRequired,
  seguriSignController: PropTypes.any.isRequired,
};

export default SignedDocuments;
