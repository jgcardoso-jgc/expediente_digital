/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable spaced-comment */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React from "react";
import { useHistory } from "react-router-dom";
import { createUseStyles } from "react-jss";
import Table from "components/shared/table/table";
import PopupInputs from "./PopupInputs";

const useStyles = createUseStyles({
  editButton: {
    border: "1px solid transparent",
    background: "#d0d0d0",
    borderRadius: "4px",
  },
});

const TableView = ({ data, docsNumber }) => {
  const classes = useStyles();
  const history = useHistory();

  function handleClickEditRow(obj) {
    history.push({
      pathname: "/usuarios/editar",
      state: { objUser: obj.row.original },
    });
  }

  return (
    <div>
      <Table
        columns={[
          {
            Header: "Nombre",
            accessor: "document",
            Cell: (cellObj) => (
              <div>
                <button
                  type="button"
                  className={classes.editButton}
                  onClick={() => handleClickEditRow(cellObj)}
                >
                  <PopupInputs
                    label={cellObj.cell.row.original.label}
                    items={cellObj.cell.row.original.items}
                  />
                </button>
              </div>
            ),
          },
        ]}
        data={data}
        docNumber={docsNumber}
      />
    </div>
  );
};

export default TableView;
