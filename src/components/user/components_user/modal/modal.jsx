/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEdit = ({ state, onClose, url, title }) => {
  if (!state) {
    return null;
  }

  function download(urlDownload) {
    const a = document.createElement("a");
    a.href = urlDownload;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <Modal show={state}>
      <Modal.Header onClick={onClose} closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img alt="" src={url} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => download(url)} variant="secondary">
          Descargar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdit;
