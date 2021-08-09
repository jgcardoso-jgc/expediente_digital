/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEdit = ({ state, onClose, url }) => {
  if (!state) {
    return null;
  }

  return (
    <Modal show={state}>
      <Modal.Header onClick={onClose} closeButton>
        <Modal.Title>Login Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img alt="" src={url} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} variant="secondary">
          Close Modal
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdit;
