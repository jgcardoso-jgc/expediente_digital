/* eslint-disable comma-dangle */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-console */
/* eslint-disable object-curly-newline */
/* eslint-disable quotes */
import Popup from "reactjs-popup";
import { FcUpload, FiDelete } from "react-icons/all";
import Card from "react-bootstrap/Card";
import { ButtonGroup, Col, Dropdown, Form, Row } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "react-bootstrap/Button";
import React, { useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import PropTypes from "prop-types";
import CustomLoader from "../CustomLoader/CustomLoader";
import UserController from "../controller/user_controller";
import styles from "../../../../../resources/theme";

const globalTheme = createUseStyles(styles);
const useStyles = createUseStyles(() => ({
  subirBt: {
    marginRight: "auto",
  },
}));

const UploadPopup = (props) => {
  const signerInput = useRef(null);
  const { toaster } = props;
  const classes = useStyles();
  const { seguriSignController } = props;
  const global = globalTheme();
  const [loader, setLoader] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    selectedFile: null,
    hasSelected: false,
  });
  const [signers, setSigners] = useState({ arr: [] });
  const userController = new UserController();
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  const addDocument = () => {
    if (signers.arr.length === 0) {
      toaster.warningToast("Necesitas agregar por lo menos un firmante");
      return;
    }
    if (!selectedFile.hasSelected) {
      toaster.warningToast("Selecciona un archivo");
      return;
    }

    setLoader(true);
    seguriSignController
      .addDocumentForParticipants(signers.arr, selectedFile.selectedFile)
      .then(async (response) => {
        const succeed = response[0];
        if (succeed) {
          const document = response[1];
          console.log(signers.arr);
          await userController.addNewDocToFirebase(signers.arr, document);
          props.toaster.successToast("Documento subido con éxito");
        } else {
          props.toaster.errorToast(
            "Error al subir documento, intenta de nuevo"
          );
        }
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        props.toaster.errorToast(error);
      });
  };

  const addSigner = async () => {
    const signerMail = signerInput.current.value;
    if (signerMail === "") {
      props.toaster.warningToast("Ingrese el correo de un firmante");
      return;
    }
    setLoader(true);
    const isValid = await props.seguriSignController.getSignersList(signerMail);
    setLoader(false);
    if (isValid) {
      if (signers.arr.includes(signerMail)) {
        props.toaster.warningToast("Firmante ya agregado");
      } else {
        setSigners({ arr: [...signers.arr, signerMail] }); // simple value
        props.toaster.shortSuccesToast("Agregado");
      }
    } else {
      props.toaster.errorToast("Firmante no registrado");
    }
  };

  const onFileChange = (event) => {
    setSelectedFile({ hasSelected: true, selectedFile: event.target.files[0] });
  };

  const deleteSigner = (signer) => {
    setSigners({ arr: signers.arr.filter((sig) => sig !== signer) });
  };
  return (
    <div style={{ "margin-top": "3rem" }}>
      <Popup
        modal
        trigger={
          <button
            type="button"
            size="lg"
            className={`${global.initBt} ${classes.subirBt}`}
          >
            <FcUpload />
            <h6>Subir documento</h6>
          </button>
        }
      >
        {(close) => (
          <div className="sigNewDoc">
            {loader ? (
              <CustomLoader />
            ) : (
              <Card border="black" style={{}}>
                <Card.Header>Subir Documento</Card.Header>
                <Card.Body className="box-shadow">
                  <div className="newDocContent">
                    <Col>
                      <Row style={{ marginBottom: "1rem" }}>
                        <Col>
                          <input
                            className="input-email-firmante"
                            type="text"
                            ref={signerInput}
                            placeholder="Ingresa el correo de los firmantes"
                          />
                        </Col>
                        <Col>
                          <Dropdown as={ButtonGroup}>
                            <Button
                              bsPrefix="btn-seguridata-lg"
                              onClick={addSigner}
                              variant="success"
                            >
                              Agregar firmante
                            </Button>
                            <Dropdown.Toggle
                              style={{
                                "background-color": "#88be0f",
                              }}
                              split
                              variant="success"
                              id="dropdown-split-basic"
                            />
                            <Dropdown.Menu>
                              {signers.arr.map((signer) => (
                                <Dropdown.Item key={signer}>
                                  {signer}
                                  <button
                                    type="button"
                                    className="btn-del-signer"
                                    onClick={() => {
                                      deleteSigner(signer);
                                    }}
                                  >
                                    <FiDelete />
                                  </button>
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </Col>
                      </Row>
                      <Form.Group as={Row}>
                        <Col>
                          <Form.Control
                            type="file"
                            size="sm"
                            onChange={onFileChange}
                          />
                        </Col>
                      </Form.Group>
                      <Row>
                        <Document
                          onLoadError={console.error}
                          file={selectedFile.selectedFile}
                        >
                          <Page pageNumber={1} />
                        </Document>
                      </Row>
                      <Col style={{ "margin-top": "1rem" }}>
                        <Button variant="outline-dark" onClick={close}>
                          Cerrar
                        </Button>
                        <button
                          type="button"
                          style={{
                            "margin-left": "2rem",
                            height: "2.5rem",
                          }}
                          className="btn-seguridata-lg"
                          onClick={async () => {
                            await addDocument();
                            close();
                          }}
                        >
                          Enviar archivo!
                        </button>
                      </Col>
                    </Col>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        )}
      </Popup>
    </div>
  );
};

UploadPopup.propTypes = {
  toaster: PropTypes.func,
  seguriSignController: PropTypes.any,
};

UploadPopup.defaultProps = {
  toaster: null,
  seguriSignController: null,
};
export default UploadPopup;
