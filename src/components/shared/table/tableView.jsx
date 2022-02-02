/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable spaced-comment */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { FaEdit } from "react-icons/fa";
import Table from "./table";

const useStyles = createUseStyles({
  editButton: {
    border: "1px solid transparent",
    background: "#d0d0d0",
    borderRadius: "4px",
  },
});

const TableView = ({ docsNumber, data }: any) => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  function handleClickEditRow(obj) {
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
            Header: "Cargo",
            accessor: "cargo",
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
        docNumber={docsNumber.docsNumber}
      />
    </div>
  );
};

export default TableView;
