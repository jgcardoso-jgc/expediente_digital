/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
/* eslint-disable react/jsx-one-expression-per-line */
import { Accordion, Badge } from "react-bootstrap";
import React from "react";
import PropTypes from "prop-types";
import { createUseStyles } from "react-jss";
import styles from "../../../../../resources/theme";

const globalTheme = createUseStyles(styles);

const SignedDocuments = (props) => {
  const global = globalTheme();
  let { signedDocuments } = props;
  if (signedDocuments === "404") {
    signedDocuments = [];
  }
  const { seguriSignController } = props;

  function downloadBase64File(fileName, docUrl) {
    const linkSource = `data:application/pdf;base64,${docUrl}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

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
          {signedDocuments.length > 0 ? (
            <div>
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
                        className={global.initBt}
                        onClick={() =>
                          seguriSignController
                            .getDocument(item.multilateralId)
                            .then((docUrl) => {
                              downloadBase64File(item.fileName, docUrl);
                            })
                        }
                      >
                        Descargar
                      </button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </div>
          ) : (
            ""
          )}
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
