/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable spaced-comment */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import { useFirebaseApp } from "reactfire";
import { useHistory } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { FaEdit } from "react-icons/fa";
import Table from "./paginationTable";

const useStyles = createUseStyles({
  editButton: {
    border: "1px solid transparent",
    background: "#d0d0d0",
    borderRadius: "4px",
  },
});

function TableView() {
  const classes = useStyles();
  const history = useHistory();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  async function getData() {
    setLoading(true);
    return new Promise((resolve) => {
      const query = db.collection("users").where("rfc", "!=", "");
      query.get().then((querySnapshot) => {
        const dataGet = [];
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            const generalData = doc.data();
            const docData = generalData.documents;
            let sizeDocs = 0;
            let revDocs = 0;
            let penDocs = 0;
            docData.forEach((docState) => {
              if (docState.state === true) {
                sizeDocs += 1;
              } else if (docState.uploaded === true) {
                revDocs += 1;
              } else {
                penDocs += 1;
              }
            });
            generalData.sizeDocuments = sizeDocs;
            generalData.revisionDocs = revDocs;
            generalData.pendientesDocs = penDocs;
            dataGet.push(generalData);
          });
          resolve(dataGet);
        } else {
          resolve(dataGet);
        }
      });
    });
  }

  useEffect(() => {
    if (data.length > 0) {
      console.log("stop");
      console.log(`data:${data}`);
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

  function handleClickEditRow(obj) {
    console.log(Object.keys(obj));
    console.log(obj.row.original.uid);
    history.push({
      pathname: "/contacts/editUser",
      state: { objUser: obj.row.original },
    });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table
        columns={[
          {
            Header: "Nombre",
            accessor: "fullname",
          },
          {
            Header: "Email",
            accessor: "email",
            Cell: (cellObj) => (
              <div>
                <a href={`mailto:${cellObj.row.original.email}`} target="blank">
                  {cellObj.row.original.email}
                </a>
              </div>
            ),
          },
          {
            Header: "🟢",
            accessor: "sizeDocuments",
          },
          {
            Header: "🟡",
            accessor: "revisionDocs",
          },
          {
            Header: "🔴",
            accessor: "pendientesDocs",
          },
          {
            Header: "RFC",
            accessor: "rfc",
          },
          {
            Header: "Editar",
            accessor: "fullName",
            Cell: (cellObj) => (
              <div>
                <button
                  type="button"
                  className={classes.editButton}
                  onClick={() => handleClickEditRow(cellObj)}
                >
                  <FaEdit />
                </button>
              </div>
            ),
          },
        ]}
        data={data}
      />
    </div>
  );
}

export default TableView;
