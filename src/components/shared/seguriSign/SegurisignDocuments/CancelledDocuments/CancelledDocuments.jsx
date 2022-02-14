/* eslint-disable react/no-array-index-key */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import { Accordion } from "react-bootstrap";
import React from "react";
import PropTypes from "prop-types";
import { createUseStyles } from "react-jss";
import styles from "../../../../../resources/theme";

const globalTheme = createUseStyles(styles);

const CancelledDocuments = (props) => {
  const global = globalTheme();
  let { cancelledDoc } = props;
  const { seguriSignController } = props;
  if (cancelledDoc === "404") {
    cancelledDoc = [];
  }
  return (
    <Accordion bsPrefix="seguridata" flush style={{ position: "inherit" }}>
      <Accordion.Header>Cancelados</Accordion.Header>
      <Accordion.Body bsPrefix="seguridata-btn">
        <Accordion flush>
          {cancelledDoc.map((item, index) => (
            <Accordion.Item eventKey={index + 1} key={`${index}i`}>
              <Accordion.Header>{item.fileName}</Accordion.Header>
              <Accordion.Body>
                <div align="center">
                  <div style={{ marginLeft: "2rem" }} align="left">
                    <li>Tipo de documento: {item.docType}</li>
                    <li>Fecha de cancelación: {item.dateCancel}</li>
                    <li>Motivo de cancelación: {item.reasonCancelDocument}</li>
                  </div>
                  <br />
                  <button
                    type="button"
                    className={global.initBt}
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

CancelledDocuments.propTypes = {
  cancelledDoc: PropTypes.any.isRequired,
  seguriSignController: PropTypes.any.isRequired,
};
export default CancelledDocuments;
