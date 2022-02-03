/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable spaced-comment */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
//import { useHistory } from "react-router-dom";
import { createUseStyles } from "react-jss";
import CancelPopup from "../seguriSign/CancelPopup/CancelPopup";
import Table from "./table";
import SignPopUP from "../seguriSign/SignPopup/SignPopup";

const useStyles = createUseStyles({
  editButton: {
    border: "1px solid transparent",
    background: "#d0d0d0",
    borderRadius: "4px",
  },
});

const TableView = ({
  docsNumber,
  data,
  controller,
  long,
  lat,
  toaster,
}: any) => {
  const classes = useStyles();
  //const history = useHistory();
  console.log(data);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  /*function handleClickEditRow(obj) {
    history.push({
      pathname: "/contacts/editUser",
      state: { objUser: obj.row.original },
    });
  }*/

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table
        columns={[
          {
            Header: "Nombre",
            accessor: "fileName",
          },
          {
            Header: "Firmas",
            accessor: "numeroFirmas",
          },
          {
            Header: "Tipo",
            accessor: "docType",
          },
          {
            Header: "Ver",
            accessor: "revisionDocs",
            Cell: (cellObj) => (
              <div>
                {console.log(cellObj)}
                <button
                  type="button"
                  className={classes.verBt}
                  style={{ width: "80%" }}
                  onClick={() => {
                    setLoading(true);
                    controller
                      .getDocument(cellObj.data.multilateralId)
                      .then((docUrl) => {
                        window.open(`data:application/pdf;base64,${docUrl}`);
                        setLoading(false);
                      })
                      .catch((e) => {
                        setLoading(false);
                        console.log(e);
                        //toaster.errorToast(e);
                      });
                  }}
                >
                  Ver
                </button>
              </div>
            ),
          },
          {
            Header: "Firmar",
            accessor: "revision",
            Cell: (cellObj) => (
              <div>
                <SignPopUP
                  toaster={toaster}
                  seguriSignController={controller}
                  long={long}
                  lat={lat}
                  requiresFaceMatch={cellObj.data.requiresFaceMatch}
                  key={cellObj.data.multilateralId}
                  multilateralId={cellObj.data.multilateralId}
                  fileName={cellObj.data.fileName}
                />
              </div>
            ),
          },
          {
            Header: "Cancelar",
            accessor: "fullName",
            Cell: (cellObj) => (
              <div>
                <CancelPopup
                  toaster={toaster}
                  key={cellObj.data.multilateralId}
                  multilateralId={cellObj.data.multilateralId}
                  seguriSignController={controller}
                />
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
