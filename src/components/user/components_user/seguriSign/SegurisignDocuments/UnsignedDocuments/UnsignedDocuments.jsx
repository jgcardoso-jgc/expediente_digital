/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import {
  Accordion,
  Badge,
  Col,
  ProgressBar,
  Row,
  Table,
} from "react-bootstrap";
import React, { useState } from "react";
import {
  AiOutlineCheck,
  AiOutlineMail,
  TiDeleteOutline,
} from "react-icons/all";
// import UserController from "../../controller/user_controller";
import PropTypes from "prop-types";
import { createUseStyles } from "react-jss";
import SignPopUP from "../../SignPopup/SignPopup";
import CancelPopup from "../../CancelPopup/CancelPopup";
import CustomLoader from "../../CustomLoader/CustomLoader";

const useStyles = createUseStyles(() => ({}));
const UnsignedDocuments = (props) => {
  const [loading, setLoading] = useState(false);
  const { unsignedDocuments } = props;
  const { toaster } = props;
  const { seguriSignController } = props;
  const { long } = props;
  const classes = useStyles();
  const { lat } = props;
  // const userController = new UserController();

  const renderTableCell = (user, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.firmo ? <AiOutlineCheck /> : <TiDeleteOutline />}</td>
      <td>
        <button type="button">
          <AiOutlineMail />
        </button>
      </td>
    </tr>
  );

  const getPercentage = (item) =>
    Math.floor((item.firmados.length / item.numeroFirmas) * 100);

  return (
    <Accordion bsPrefix="seguridata" flush style={{ position: "inherit" }}>
      <Accordion.Header>
        Por Firmar
        <Badge style={{ marginLeft: "3rem" }} pill bg="dark">
          {unsignedDocuments.length}
        </Badge>
      </Accordion.Header>
      <Accordion.Body>
        <Accordion flush>
          {unsignedDocuments.map((item, index) => {
            const now = getPercentage(item);
            return (
              <Accordion.Item eventKey={index + 1}>
                <Accordion.Header>
                  {item.fileName}
                  <ProgressBar
                    bsPrefix="progress-bar"
                    striped
                    variant="info"
                    now={now}
                    label={`${now}%`}
                  />
                </Accordion.Header>
                <Accordion.Body>
                  <div align="center">
                    <div style={{ "margin-left": "2rem" }} align="left">
                      <li>Tipo de documento: {item.docType}</li>

                      <li>Número de firmas: {item.numeroFirmas}</li>

                      <li>Firmados: {item.firmados.length}</li>
                    </div>
                    <div>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Status</th>
                            <th>Recordar</th>
                          </tr>
                        </thead>
                        <tbody>{item.usuarios.map(renderTableCell)}</tbody>
                      </Table>
                    </div>
                    <br />
                    <Row>
                      <Col>
                        <CancelPopup
                          toaster={toaster}
                          key={item.multilateralId}
                          multilateralId={item.multilateralId}
                          seguriSignController={seguriSignController}
                        />
                      </Col>
                      <Col>
                        {loading ? (
                          <CustomLoader />
                        ) : (
                          <button
                            type="button"
                            className="btn-seguridata-lg"
                            style={{ width: "80%" }}
                            onClick={() => {
                              setLoading(true);
                              seguriSignController
                                .getDocument(item.multilateralId)
                                .then((docUrl) => {
                                  window.open(
                                    `data:application/pdf;base64,${docUrl}`
                                  );
                                  setLoading(false);
                                })
                                .catch((e) => {
                                  setLoading(false);
                                  toaster.errorToast(e);
                                });
                            }}
                          >
                            Ver
                          </button>
                        )}
                      </Col>
                      <Col>
                        <SignPopUP
                          toaster={toaster}
                          seguriSignController={seguriSignController}
                          long={long}
                          lat={lat}
                          key={item.multilateralId}
                          multilateralId={item.multilateralId}
                          fileName={item.fileName}
                        />
                      </Col>
                    </Row>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Accordion.Body>
    </Accordion>
  );
};

UnsignedDocuments.propTypes = {
  unsignedDocuments: PropTypes.any.isRequired,
  toaster: PropTypes.any.isRequired,
  seguriSignController: PropTypes.any.isRequired,
  long: PropTypes.any.isRequired,
  lat: PropTypes.any.isRequired,
};

export default UnsignedDocuments;
