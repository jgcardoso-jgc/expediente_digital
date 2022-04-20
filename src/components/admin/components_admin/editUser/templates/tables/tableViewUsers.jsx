/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable spaced-comment */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useState, useEffect } from 'react';
import { useFirebaseApp } from 'reactfire';
import { createUseStyles } from 'react-jss';
import Table from 'components/shared/table/table';

const useStyles = createUseStyles({
  editButton: {
    border: '1px solid transparent',
    background: '#d0d0d0',
    borderRadius: '4px'
  }
});

const TableViewUsers = ({ setSelected, docsNumber }) => {
  const classes = useStyles();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  async function getData() {
    setLoading(true);
    return new Promise((resolve) => {
      const query = db.collection('users').where('fullname', '!=', '');
      query.get().then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          const dataGet = [];
          querySnapshot.forEach((doc) => {
            const e = doc.data();
            if (e.curp) {
              dataGet.push(doc.data());
            }
          });
          resolve(dataGet);
        } else {
          resolve([]);
        }
      });
    });
  }

  useEffect(() => {
    if (data.length > 0) {
      setLoading(false);
    } else {
      getData().then((res) => {
        const dataGot = res;
        const keys = Object.keys(res);
        const size = keys.length;
        if (size > 0) {
          const JSONdata = dataGot;
          setData(JSONdata);
        }
      });
    }
  }, [data]);

  const shortString = (str, slice) => {
    if (str.length > 7) {
      return `${str.substring(0, slice)}...`;
    }
    return str;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table
        columns={[
          {
            Header: 'Nombre',
            accessor: 'fullname',
            Cell: (cellObj) => (
              <div>{shortString(cellObj.row.original.fullname, 15)}</div>
            )
          },
          {
            Header: 'Email',
            accessor: 'email',
            Cell: (cellObj) => (
              <div>
                <a href={`mailto:${cellObj.row.original.email}`} target="blank">
                  {shortString(cellObj.row.original.email, 15)}
                </a>
              </div>
            )
          },
          {
            Header: 'RFC',
            accessor: 'rfc'
          },
          {
            Header: 'CURP',
            accessor: 'curp',
            Cell: (cellObj) => (
              <div>
                {cellObj.row.original.curp
                  ? shortString(cellObj.row.original.curp, 10)
                  : 'Pendiente'}
              </div>
            )
          },
          {
            Header: '',
            accessor: 'fullName',
            Cell: (cellObj) => (
              <div>
                <button
                  type="button"
                  className={classes.editButton}
                  onClick={() =>
                    setSelected({
                      curp: cellObj.row.original.curp,
                      acreedor: cellObj.row.original.fullname
                    })
                  }
                >
                  Seleccionar
                </button>
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

export default TableViewUsers;
