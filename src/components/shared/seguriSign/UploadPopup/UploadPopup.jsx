/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-console */
/* eslint-disable object-curly-newline */
/* eslint-disable quotes */
import { FiDelete } from "react-icons/all";
import { ButtonGroup, Col, Dropdown, Form, Row, Modal } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "react-bootstrap/Button";
import React, { useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import PropTypes from "prop-types";
import CustomLoader from "../CustomLoader/CustomLoader";
import UserController from "../controller/user_controller";
import SoapController from "../controller/soap_controller";

const useStyles = createUseStyles(() => ({
  subirBt: {
    color: "white",
    border: "1px solid black",
    display: "block",
    fontSize: 15,
    minWidth: 150,
    paddingTop: 10,
    borderRadius: 10,
    paddingBottom: 10,
    backgroundColor: "rgb(75, 75, 75)",
  },
  mt14: {
    marginTop: 14,
  },
  flex: {
    display: "flex",
    marginTop: 20,
  },
  firmanteBt: {
    color: "white",
    border: "1px solid black",
    display: "block",
    fontSize: 15,
    minWidth: 150,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: "rgb(75, 75, 75)",
  },
  inputStyle: {
    width: "100%",
    border: "0",
    borderBottom: "1px solid rgb(194, 194, 194)",
    fontSize: "16px",
    background: "transparent",
  },
  spaceCheckbox: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
}));

const UploadPopup = (props) => {
  const { onClose } = props;
  const { state } = props;
  if (!state) {
    return null;
  }

  const signerInput = useRef(null);
  const { toaster } = props;
  const classes = useStyles();
  const { seguriSignController } = props;
  const soapController = new SoapController();
  const userController = new UserController(
    seguriSignController.segurisignUser.email
  );
  const { email } = seguriSignController.segurisignUser;
  const [loader, setLoader] = useState(false);
  const [requiresFM, setRequiresFM] = useState(false);
  const [signType, setSignType] = useState("fab");
  const [selectedFile, setSelectedFile] = useState({
    selectedFile: null,
    hasSelected: false,
  });
  const [signers, setSigners] = useState({ arr: [] });
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  soapController.segurisignUser = seguriSignController.segurisignUser;
  const addDocumentServer = () => {
    if (signers.arr.length === 0) {
      toaster.warningToast("Necesitas agregar por lo menos un firmante");
      return;
    }
    if (!selectedFile.hasSelected) {
      toaster.warningToast("Selecciona un archivo");
      return;
    }

    setLoader(true);
    soapController
      .addDocumentString(signers.arr, selectedFile.selectedFile)
      .then(async (response) => {
        console.log(response);
        if (response[0]) {
          console.log(signers.arr);
          await userController.addNewDocToFirebase(
            signers.arr,
            response[1],
            requiresFM
          );
          toaster.successToast("Documento subido con éxito");
          soapController.sendWelcomeEmail(email).then(() => {
            toaster.successToast("Email enviado con éxito");
          });
          // aqui enviar correo
        } else {
          toaster.errorToast("Error al subir documento, intenta de nuevo");
        }
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        toaster.errorToast(error);
      });
  };

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
          await userController.addNewDocToFirebase(
            signers.arr,
            document,
            requiresFM
          );
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
      toaster.warningToast("Ingrese el correo de un firmante");
      return;
    }
    setLoader(true);
    const isValid = await seguriSignController.getSignersList(signerMail);
    setLoader(false);
    if (isValid || signType === "server") {
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
    <Modal show={state}>
      <Modal.Header onClick={onClose} closeButton>
        <Modal.Title>Subir Documento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loader ? (
          <CustomLoader />
        ) : (
          <div className="newDocContent">
            <Row>
              <Form.Check
                type="radio"
                label="Server Side"
                value="server"
                name="sign-type"
                className={classes.spaceCheckbox}
                onChange={(event) => setSignType(event.target.value)}
              />
              <Form.Check
                type="radio"
                label="FAB"
                value="fab"
                name="sign-type"
                className={classes.spaceCheckbox}
                onChange={(event) => setSignType(event.target.value)}
              />
            </Row>
            <input
              className={classes.inputStyle}
              type="text"
              ref={signerInput}
              placeholder="Ingresa el correo de los firmantes"
            />
            <Dropdown className={classes.mt14} as={ButtonGroup}>
              <Button
                bsPrefix="btn-seguridata-lg"
                onClick={addSigner}
                variant="success"
                className={classes.firmanteBt}
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
            <Form.Group as={Row} className={classes.mt14}>
              <Col>
                <Form.Control type="file" size="sm" onChange={onFileChange} />
              </Col>
            </Form.Group>
            <Row>
              <Form.Check
                type="checkbox"
                label="Requiere Facematch"
                className={classes.spaceCheckbox}
                onChange={(event) => setRequiresFM(event.target.value)}
              />
            </Row>
            <Row>
              <Document
                onLoadError={console.error}
                file={selectedFile.selectedFile}
              >
                <Page pageNumber={1} />
              </Document>
            </Row>
            <div className={classes.flex}>
              <Button variant="outline-dark" onClick={onClose}>
                Cerrar
              </Button>
              <button
                type="button"
                style={{
                  "margin-left": "2rem",
                  height: "2.5rem",
                }}
                className={classes.subirBt}
                onClick={async () => {
                  if (signType === "fab") {
                    addDocument();
                  } else {
                    // console.log('add doc');
                    addDocumentServer();
                  }
                  onClose();
                }}
              >
                Enviar Documento
              </button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

UploadPopup.propTypes = {
  toaster: PropTypes.func,
  seguriSignController: PropTypes.any,
  onClose: PropTypes.any.isRequired,
  state: PropTypes.any.isRequired,
};

UploadPopup.defaultProps = {
  toaster: null,
  seguriSignController: null,
};
export default UploadPopup;
