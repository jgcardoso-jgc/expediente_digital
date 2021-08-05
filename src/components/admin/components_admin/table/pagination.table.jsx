/* eslint-disable no-unused-vars */
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

const useStyles = createUseStyles({
  card: {
    background: "#f5f5f5",
    padding: "10px",
    borderRadius: "10px",
  },
});

function Table({ columns, data }) {
  const classes = useStyles();
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
    <>
      {console.log(globalFilter)}
      <input
        type="text"
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <table {...getTableProps()}>
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
      <div className="pagination">
        <button
          type="button"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button
          type="button"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>{" "}
        <button
          type="button"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>{" "}
        <button
          type="button"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
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
    </>
  );
}

function TableView() {
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
            // Use our custom `fuzzyText` filter on this column
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Age",
            accessor: "age",
            filter: "equals",
          },
          {
            Header: "Visits",
            accessor: "visits",
          },
          {
            Header: "Status",
            accessor: "status",
            filter: "includes",
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
      firstName: "horn-od926",
      lastName: "selection-gsykp",
      age: 22,
      visits: 20,
      progress: 39,
      status: "single",
    },
    {
      firstName: "heart-nff6w",
      lastName: "information-nyp92",
      age: 16,
      visits: 98,
      progress: 40,
      status: "complicated",
    },
    {
      firstName: "minute-yri12",
      lastName: "fairies-iutct",
      age: 7,
      visits: 77,
      progress: 39,
      status: "single",
    },
    {
      firstName: "degree-jx4h0",
      lastName: "man-u2y40",
      age: 27,
      visits: 54,
      progress: 92,
      status: "relationship",
    },
    {
      firstName: "degree-jx4h0",
      lastName: "man-u2y40",
      age: 27,
      visits: 54,
      progress: 92,
      status: "relationship",
    },
    {
      firstName: "degree-jx4h0",
      lastName: "man-u2y40",
      age: 27,
      visits: 54,
      progress: 92,
      status: "relationship",
    },
    {
      firstName: "degree-jx4h0",
      lastName: "man-u2y40",
      age: 27,
      visits: 54,
      progress: 92,
      status: "relationship",
    },
    {
      firstName: "degree-jx4h0",
      lastName: "man-u2y40",
      age: 27,
      visits: 54,
      progress: 92,
      status: "relationship",
    },
    {
      firstName: "degree-jx4h0",
      lastName: "man-u2y40",
      age: 27,
      visits: 54,
      progress: 92,
      status: "relationship",
    },
    {
      firstName: "degree-jx4h0",
      lastName: "man-u2y40",
      age: 27,
      visits: 54,
      progress: 92,
      status: "relationship",
    },
    {
      firstName: "degree-jx4h0",
      lastName: "man-u2y40",
      age: 27,
      visits: 54,
      progress: 92,
      status: "relationship",
    },
  ];

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default TableView;
