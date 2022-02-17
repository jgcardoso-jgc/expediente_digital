/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable comma-dangle */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable quotes */
import React from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
import { createUseStyles } from "react-jss";
import { Table, Card, Button } from "react-bootstrap";
import {
  AiOutlineCheck,
  AiOutlineMail,
  TiDeleteOutline,
} from "react-icons/all";

const useStyles = createUseStyles(() => ({
  border: { border: "3px solid black", marginBottom: 14 },
  firmarBt: {
    backgroundColor: "#cccccc",
    color: "black",
    border: "0px solid black",
    display: "block",
    marginLeft: "auto",
    marginRight: 0,
    paddingTop: "10px",
    paddingBottom: "10px",
    fontSize: "15px",
    borderRadius: "10px",
  },
  loadGif: {
    maxWidth: 50,
  },
  signImg: {
    maxWidth: 200,
    marginBottom: 20,
  },
  flex: {
    display: "flex",
  },
  loadingBlock: {
    display: "block",
  },
  title: {
    marginTop: 5,
    marginBottom: 14,
  },
}));

const UnsignedPopUp = ({ usuarios, firmados, noFirmas }) => {
  const classes = useStyles();
  const getFirmadosLength = (f) => f.length;
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
  // eslint-disable-next-line react/jsx-indent
  return (
    <div>
      <Popup
        modal
        trigger={
          <button
            type="button"
            style={{ width: "100%" }}
            className={classes.firmarBt}
          >
            {getFirmadosLength(firmados)} / {noFirmas}
          </button>
        }
      >
        {(close) => (
          <div align="center">
            <Card style={{}}>
              <Card.Body>
                <Card.Title className={classes.title}>
                  <b>ONESeguridata</b> | Firmar documento
                </Card.Title>
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
                  <tbody>{usuarios ? usuarios.map(renderTableCell) : ""}</tbody>
                </Table>
                <Button variant="outline-dark" onClick={close}>
                  Cerrar
                </Button>
                <div className={classes.flex} />
              </Card.Body>
            </Card>
          </div>
        )}
      </Popup>
    </div>
  );
};

UnsignedPopUp.propTypes = {
  usuarios: PropTypes.any.isRequired,
  firmados: PropTypes.any.isRequired,
  noFirmas: PropTypes.any.isRequired,
};
export default UnsignedPopUp;
