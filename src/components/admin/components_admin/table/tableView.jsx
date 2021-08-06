/* eslint-disable react/destructuring-assignment */
/* eslint-disable spaced-comment */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import { ConsoleView } from "react-device-detect";
import { useFirebaseApp } from "reactfire";
import Table from "./paginationTable";

function TableView() {
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

  /*
      {
        Header: "Nombre",
        accessor: "firstName",
      },

  */

  function handleClickEditRow(obj) {
    console.log("clicked");
    console.log(Object.keys(obj));
    console.log(obj.row.original.uid);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table
        columns={[
          {
            Header: "UID",
            accessor: "uid",
          },
          {
            Header: "Visits",
            accessor: "fullName",
            Cell: (cellObj) => (
              <div>
                <button
                  type="button"
                  onClick={() => handleClickEditRow(cellObj)}
                >
                  Edit
                </button>
              </div>
            ),
          },
          {
            Header: "Status",
            accessor: "status",
          },
          {
            Header: "Profile Progress",
            accessor: "progress",
          },
        ]}
        data={data}
      />
    </div>
  );
}

export default TableView;
