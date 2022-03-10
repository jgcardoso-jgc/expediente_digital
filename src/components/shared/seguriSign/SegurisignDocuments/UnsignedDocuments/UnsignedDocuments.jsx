/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable quotes */
import { Accordion, Badge } from "react-bootstrap";
import React from "react";
// import UserController from "../../controller/user_controller";
import PropTypes from "prop-types";
import TableView from "../Table/tableView";
import styles from "./UnsignedDocuments.module.scss";

const UnsignedDocuments = (props) => {
  const { unsignedDocuments } = props;
  const { toaster } = props;
  const { seguriSignController } = props;
  const { long } = props;
  const { lat } = props;

  return (
    <Accordion bsPrefix="seguridata" flush style={{ position: "inherit" }}>
      <Accordion.Header>
        <Badge style={{ marginRight: 16 }} pill bg="dark">
          {unsignedDocuments.length > 0 ? unsignedDocuments.length : "0"}
        </Badge>
        Por Firmar
      </Accordion.Header>
      <Accordion.Body>
        <Accordion flush>
          <div className={styles.tableView}>
            <TableView
              docsNumber={0}
              data={unsignedDocuments}
              controller={seguriSignController}
              long={long}
              lat={lat}
              toaster={toaster}
            />
          </div>
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
