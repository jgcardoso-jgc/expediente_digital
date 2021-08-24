/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import { Accordion } from "react-bootstrap";
import React from "react";

const CancelledDocuments = (props) => (
  <Accordion bsPrefix="seguridata" flush style={{ position: "inherit" }}>
    <Accordion.Header>Cancelados</Accordion.Header>
    <Accordion.Body bsPrefix="seguridata-btn">
      <Accordion flush>
        {props.cancelledDoc.map((item, index) => (
          <Accordion.Item eventKey={index + 1}>
            <Accordion.Header>{item.fileName}</Accordion.Header>
            <Accordion.Body>
              <div align="center">
                <div style={{ "margin-left": "2rem" }} align="left">
                  <li>Tipo de documento: {item.docType}</li>
                  <li>Fecha de cancelación: {item.dateCancel}</li>
                  <li>Motivo de cancelación: {item.reasonCancelDocument}</li>
                </div>
                <br />
                <button
                  type="button"
                  className="btn-seguridata-lg"
                  onClick={() =>
                    props.seguriSignController
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
export default CancelledDocuments;
