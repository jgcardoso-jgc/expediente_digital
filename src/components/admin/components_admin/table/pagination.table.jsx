/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable quotes */
// src/components/pagination.table.js
import React from "react";
import { useTable, usePagination } from "react-table";
import { createUseStyles } from "react-jss";
import "bootstrap/dist/css/bootstrap.min.css";

const useStyles = createUseStyles({
  card: {
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
    borderRadius: "10px",
    padding: "10px",
    backgroundColor: "#f5f5f5",
  },
});

function Table({ columns, data }) {
  const classes = useStyles();
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 1, pageSize: 5 },
    },
    usePagination
  );

  // Render the UI for your table
  return (
    <div className={classes.card}>
      <table className="table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
      <ul className="pagination">
        <li
          className="page-item"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <button type="button" className="page-link">
            First
          </button>
        </li>
        <li
          className="page-item"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <button type="button" className="page-link">
            {"<"}
          </button>
        </li>
        <li
          className="page-item"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <button type="button" className="page-link">
            {">"}
          </button>
        </li>
        <li
          className="page-item"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <button type="button" className="page-link">
            Last
          </button>
        </li>
        <li>
          <button className="page-link" type="button">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </button>
        </li>
        <select
          className="form-control"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ width: "120px", height: "38px" }}
        >
          {[5, 10, 20, 30, 40, 50].map((pgSize) => (
            <option key={pgSize} value={pgSize}>
              Show {pgSize}
            </option>
          ))}
        </select>
      </ul>
    </div>
  );
}

Table.defaultProps = {
  columns: null,
  data: null,
};

function PaginationTableComponent() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName",
          },
          {
            Header: "Last Name",
            accessor: "lastName",
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Age",
            accessor: "age",
          },
          {
            Header: "Visits",
            accessor: "visits",
          },
          {
            Header: "Status",
            accessor: "status",
          },
          {
            Header: "Profile Progress",
            accessor: "progress",
          },
        ],
      },
    ],
    []
  );

  const data = [
    {
      firstName: "committee-c15dw",
      lastName: "editor-ktsjo",
      age: 3,
      visits: 46,
      progress: 75,
      status: "relationship",
    },
    {
      firstName: "midnight-wad0y",
      lastName: "data-7h4xf",
      age: 1,
      visits: 56,
      progress: 15,
      status: "complicated",
    },
    {
      firstName: "tree-sbdb0",
      lastName: "friendship-w8535",
      age: 1,
      visits: 45,
      progress: 66,
      status: "single",
    },
    {
      firstName: "chin-borr8",
      lastName: "shirt-zox8m",
      age: 0,
      visits: 25,
      progress: 67,
      status: "complicated",
    },
    {
      firstName: "women-83ef0",
      lastName: "chalk-e8xbk",
      age: 9,
      visits: 28,
      progress: 23,
      status: "relationship",
    },
    {
      firstName: "women-83ef0",
      lastName: "chalk-e8xbk",
      age: 9,
      visits: 28,
      progress: 23,
      status: "relationship",
    },
    {
      firstName: "women-83ef0",
      lastName: "chalk-e8xbk",
      age: 9,
      visits: 28,
      progress: 23,
      status: "relationship",
    },
    {
      firstName: "women-83ef0",
      lastName: "chalk-e8xbk",
      age: 9,
      visits: 28,
      progress: 23,
      status: "relationship",
    },
  ];

  return <Table columns={columns} data={data} />;
}

export default PaginationTableComponent;
