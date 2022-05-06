/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */

/* eslint-disable react/destructuring-assignment */
/* eslint-disable spaced-comment */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useFirebaseApp } from 'reactfire';
import { AiFillEye } from 'react-icons/ai';
import Table from 'components/shared/table/table';
import CancelPopup from '../../CancelPopup/CancelPopup';
import SignPopUP from '../../SignPopup/SignPopup';
import UnsignedPopUp from '../../UnsignedPopUp/UnsignedPopup';

const useStyles = createUseStyles({
  editButton: {
    border: '1px solid transparent',
    background: '#d0d0d0',
    borderRadius: '4px'
  },
  biometry: {
    textAlign: 'center'
  },
  firmarBt: {
    backgroundColor: '#cccccc',
    color: 'black',
    width: '100%',
    border: '0px solid black',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 0,
    paddingTop: '10px',
    paddingBottom: '10px',
    fontSize: '15px',
    borderRadius: '10px'
  },
  recordarBt: {
    backgroundColor: 'rgb(75, 75, 75)',
    color: 'white',
    border: '1px solid black',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 0,
    minWidth: '150px',
    paddingTop: '10px',
    paddingBottom: '10px',
    fontSize: '15px',
    borderRadius: '10px'
  },
  fontTitles: {
    fontSize: 25
  },
  biometric: { maxWidth: 40 },
  mt10: {
    marginTop: 20
  },
  verBt: {
    backgroundColor: '  rgb(97 137 184)',
    color: 'white',
    border: '1px solid black',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 0,
    minWidth: '150px',
    paddingTop: '10px',
    paddingBottom: '10px',
    fontSize: '15px',
    borderRadius: '10px'
  },
  recordarMiniBt: {
    backgroundColor: 'rgb(75, 75, 75)',
    color: 'white',
    border: '1px solid black',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 0,
    minWidth: 50,
    paddingTop: '10px',
    paddingBottom: '10px',
    fontSize: '15px',
    borderRadius: '10px'
  }
});

const TableView = ({
  docsNumber,
  data,
  controller,
  long,
  lat,
  toaster
}: any) => {
  const classes = useStyles();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [loading, setLoading] = useState(true);
  const [docNames, setDocNames] = useState([]);

  const getDocNames = async () => {
    try {
      const query = await db
        .collection('documentos')
        .doc('uuid')
        .get()
        .catch((e) => {
          throw e;
        });
      const gotDocNames = [];
      gotDocNames.push(query.data());
      setDocNames(gotDocNames);
    } catch (e) {
      console.log(e.message);
    }
  };

  const filterName = (uuid: string) => {
    if (docNames[0]) {
      const asArray = Object.entries(docNames[0]);
      const filtered = asArray.find((doc) => doc[1].uuid === uuid);
      return filtered[1].label;
    }
    return uuid;
  };

  useEffect(() => {
    setLoading(false);
  }, [data]);

  useEffect(() => {
    getDocNames();
  }, []);

  const viewDocument = (cellObj) => {
    const id = cellObj.cell.row.original.multilateralId;
    setLoading(true);
    controller
      .getDocument(id)
      .then((docUrl) => {
        window.open(`data:application/pdf;base64,${docUrl}`);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  /*function handleClickEditRow(obj) {
    history.push({
      pathname: "/contacts/editUser",
      state: { objUser: obj.row.original },
    });
  }*/

  if (loading) {
    return <div>Loading...</div>;
  }

  if (docNames.size === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table
        columns={[
          {
            Header: 'Nombre',
            accessor: 'fileName'
          },
          {
            Header: 'Firmas',
            accessor: 'numeroFirmas',
            Cell: (cellObj) => (
              <div>
                <UnsignedPopUp
                  usuarios={cellObj.cell.row.original.usuarios}
                  firmados={cellObj.cell.row.original.firmados}
                  noFirmas={cellObj.cell.row.original.numeroFirmas}
                />
              </div>
            )
          },
          {
            Header: 'Tipo',
            accessor: 'docType',
            Cell: (cellObj) => (
              <div>{filterName(cellObj.cell.row.original.docType)}</div>
            )
          },
          {
            Header: 'Ver',
            accessor: 'revisionDocs',
            Cell: (cellObj) => (
              <div>
                <button
                  type="button"
                  className={classes.firmarBt}
                  onClick={() => viewDocument(cellObj)}
                >
                  <AiFillEye />
                </button>
              </div>
            )
          },
          {
            Header: 'Firmar',
            accessor: 'revision',
            Cell: (cellObj) => (
              <div>
                <SignPopUP
                  toaster={toaster}
                  seguriSignController={controller}
                  long={long}
                  lat={lat}
                  doctType={cellObj.data.docType}
                  requiresFaceMatch={
                    cellObj.cell.row.original.requiresFaceMatch
                  }
                  key={cellObj.data.multilateralId}
                  multilateralId={cellObj.cell.row.original.multilateralId}
                  fileName={cellObj.data.fileName}
                />
              </div>
            )
          },
          {
            Header: 'Biometria',
            accessor: 'requiresFaceMatch',
            Cell: (cellObj) => (
              <div>
                <p className={classes.biometry}>
                  {cellObj.cell.row.original.requiresFaceMatch ? 'Sí' : 'No'}
                </p>
              </div>
            )
          },
          {
            Header: 'Cancelar',
            accessor: 'fullName',
            Cell: (cellObj) => (
              <div>
                <CancelPopup
                  toaster={toaster}
                  key={cellObj.data.multilateralId}
                  multilateralId={cellObj.cell.row.original.multilateralId}
                  seguriSignController={controller}
                />
              </div>
            )
          }
        ]}
        data={data}
        docNumber={docsNumber.docsNumber}
      />
    </div>
  );
};

export default TableView;
