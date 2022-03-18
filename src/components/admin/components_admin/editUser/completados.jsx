/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable quotes */
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { createUseStyles } from 'react-jss';
import { v4 as uuidv4 } from 'uuid';

const useStyles = createUseStyles(() => ({
  container: {
    backgroundColor: '#f5f5f5',
    border: `1px solid #f5f5f5`,
    borderRadius: 10,
    WebkitBoxShadow: '0px 8px 15px 3px #D1D1D1',
    boxShadow: '0px 8px 15px 3px #D1D1D1',
    padding: '24px 32px 0px 32px',
    height: '100%',
    maxWidth: 600,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 20
  },
  inputStyle: {
    width: '100%',
    border: '0',
    borderBottom: '1px solid rgb(194, 194, 194)',
    fontSize: '16px',
    background: 'transparent'
  },
  containerPendiente: {
    backgroundColor: '#f2bd85',
    border: `1px solid #f5f5f5`,
    borderRadius: 10,
    WebkitBoxShadow: '0px 8px 15px 3px #D1D1D1',
    boxShadow: '0px 8px 15px 3px #D1D1D1',
    padding: '24px 32px 0px 32px',
    height: '100%'
  },
  center: {
    textAlign: 'center'
  },
  checkbox: {
    display: 'block'
  },
  rowDocs: {
    marginTop: '20px'
  },
  pointer: {
    cursor: 'pointer'
  },
  btDisabled: {
    opacity: 0.5
  },
  mt20: { marginTop: '20px' },
  mb20: {
    marginBottom: '20px'
  },
  col: {
    maxWidth: '33.3333%',
    minWidth: '33.3333%',
    padding: 10
  },
  max3: {
    maxWidth: '33.3333%',
    minWidth: '33.3333%'
  },
  '@media screen and (max-width:768px)': {
    col: {
      marginTop: '20px',
      marginBottom: '20px'
    }
  }
}));

const Completados = ({ urlsCompleted, handleShow }) => {
  const urls = urlsCompleted;
  const classes = useStyles();
  return (
    <div>
      <Row className={classes.rowDocs}>
        {urls.map((url) => (
          <Col className={classes.col} key={uuidv4()}>
            <div
              className={`${classes.container} ${classes.pointer}`}
              onKeyPress={() => handleShow(url, 'completados')}
              key={uuidv4()}
              onClick={() => handleShow(url, 'completados')}
            >
              <p className={classes.center}>{url.title}</p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Completados;
