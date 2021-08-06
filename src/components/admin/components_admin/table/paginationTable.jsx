/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import React, { useEffect } from "react";
import { createUseStyles } from "react-jss";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { FaSearch, FaAngleRight, FaAngleLeft } from "react-icons/fa";

const useStyles = createUseStyles({
  card: {
    background: "#f5f5f5",
    padding: "10px",
    borderRadius: "10px",
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
  },
  table: {
    minWidth: "100%",
  },
  searchIcon: {
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  containerSearch: {
    marginTop: "-27px",
    marginBottom: "14px",
    display: "flex",
    background: "#cccccc",
    maxWidth: "50%",
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
    borderRadius: "10px",
    padding: "4px",
  },
  inputPagination: {
    minWidth: "40%",
    background: "transparent",
    border: "1px",
  },
  paginationContainer: {
    marginTop: "10px",
  },
  paginationButtons: {
    border: "1px solid transparent",
    background: "#d0d0d0",
    borderRadius: "4px",
  },
});

const Table = ({ columns, data }) => {
  const classes = useStyles();
  console.log(`heredata:${data}`);
  const props = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter, // useGlobalFilter!
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
  } = props;
  console.log(props);

  useEffect(() => {
    console.log(globalFilter);
  }, [globalFilter]);

  return (
    <div className={classes.card}>
      {console.log(globalFilter)}
      <div className={classes.containerSearch}>
        <span className={classes.searchIcon}>
          <FaSearch />
        </span>
        <input
          type="text"
          className={classes.inputPagination}
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <table className={classes.table} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                </th>
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
      <div className={classes.paginationContainer}>
        <button
          type="button"
          className={classes.paginationButtons}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button
          type="button"
          className={classes.paginationButtons}
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <FaAngleLeft />
        </button>{" "}
        <button
          type="button"
          className={classes.paginationButtons}
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <FaAngleRight />
        </button>{" "}
        <button
          type="button"
          className={classes.paginationButtons}
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>{" "}
        <span>
          Página{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Ir a la Página:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <br />
      <div>
        Mostrando {pageSize} de {rows.length} resultados
      </div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};

export default Table;
