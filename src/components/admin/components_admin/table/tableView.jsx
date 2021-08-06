/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable spaced-comment */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import { useFirebaseApp } from "reactfire";
import { useHistory } from "react-router-dom";
import { createUseStyles } from "react-jss";
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
            dataGet.push(doc.data());
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
        const keysObj = Object.keys(dataGot[0]);
        if (size > 0) {
          const JSONdata = dataGot;
          setData(JSONdata);
        }
      });
    }
  }, [data]);

  function handleClickEditRow(obj) {
    console.log("clicked");
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
            Header: "Documentos",
            accessor: "sizeDocuments",
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
                  Edit
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
