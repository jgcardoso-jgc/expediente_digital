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
import faceid from "../../../../../assets/faceid.gif";
import TableView from "../../../table/tableView";

const useStyles = createUseStyles(() => ({
  recordarBt: {
    backgroundColor: "rgb(75, 75, 75)",
    color: "white",
    border: "1px solid black",
    display: "block",
    marginLeft: "auto",
    marginRight: 0,
    minWidth: "150px",
    paddingTop: "10px",
    paddingBottom: "10px",
    fontSize: "15px",
    borderRadius: "10px",
  },
  fontTitles: {
    fontSize: 25,
  },
  biometric: { maxWidth: 40 },
  mt10: {
    marginTop: 20,
  },
  verBt: {
    backgroundColor: "  rgb(97 137 184)",
    color: "white",
    border: "1px solid black",
    display: "block",
    marginLeft: "auto",
    marginRight: 0,
    minWidth: "150px",
    paddingTop: "10px",
    paddingBottom: "10px",
    fontSize: "15px",
    borderRadius: "10px",
  },
  recordarMiniBt: {
    backgroundColor: "rgb(75, 75, 75)",
    color: "white",
    border: "1px solid black",
    display: "block",
    marginLeft: "auto",
    marginRight: 0,
    minWidth: 50,
    paddingTop: "10px",
    paddingBottom: "10px",
    fontSize: "15px",
    borderRadius: "10px",
  },
}));
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
        <button className={classes.recordarMiniBt} type="button">
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
          {unsignedDocuments.length > 0 ? unsignedDocuments.length : "0"}
        </Badge>
      </Accordion.Header>
      <Accordion.Body>
        <Accordion flush>
          <TableView docsNumber={0} data={unsignedDocuments} />
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
                    <Row>
                      <Col>
                        <span className={classes.fontTitles}>
                          <b>{item.docType}</b>
                        </span>{" "}
                        <br />
                        Tipo de documento
                      </Col>

                      <Col>
                        <span className={classes.fontTitles}>
                          <b>{item.numeroFirmas}</b>
                        </span>{" "}
                        <br />
                        Firmas
                      </Col>

                      <Col>
                        <span className={classes.fontTitles}>
                          <b>{item.firmados.length}</b>
                        </span>{" "}
                        <br />
                        Firmados
                      </Col>
                      {item.requiresFaceMatch ? (
                        <Col>
                          <img
                            src={faceid}
                            className={classes.biometric}
                            alt="faceid"
                          />
                          Protegido con biometría
                        </Col>
                      ) : (
                        <></>
                      )}
                    </Row>
                    <div>
                      <Table striped bordered hover className={classes.mt10}>
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
                            className={classes.verBt}
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
                          requiresFaceMatch={item.requiresFaceMatch}
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
