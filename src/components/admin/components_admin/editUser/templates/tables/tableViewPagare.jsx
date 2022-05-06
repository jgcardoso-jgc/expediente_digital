/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable spaced-comment */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import Table from 'components/shared/table/table';
import styles from 'resources/theme';
import PopupInputs from '../PopupInputs';

const useStyles = createUseStyles({
  editButton: {
    border: '1px solid transparent',
    borderRadius: '4px',
    background: 'transparent'
  },
  mt: {
    marginTop: 32
  }
});

const TableViewPagare = ({
  data,
  docsNumber,
  userEmail,
  form,
  soapController
}) => {
  const classes = useStyles();
  const history = useHistory();

  function handleClickEditRow(obj) {
    history.push({
      pathname: '/usuarios/editar',
      state: { objUser: obj.row.original }
    });
  }

  return (
    <div className={styles.mt}>
      <Table
        columns={[
          {
            Header: 'Acreedor',
            accessor: 'acreedor'
          },
          {
            Header: 'Deudor',
            accessor: 'deudor'
          },
          {
            Header: 'Fecha',
            accessor: 'fecha'
          },
          {
            Header: 'Endoso',
            accesor: 'items',
            Cell: (cellObj) => (
              <div>
                <div
                  role="button"
                  className={classes.editButton}
                  onClick={() => handleClickEditRow(cellObj)}
                >
                  <PopupInputs
                    label="Generar"
                    docType={cellObj.cell.row.original.name}
                    items={cellObj.cell.row.original.items}
                    form={form}
                    soapController={soapController}
                    userEmail={userEmail}
                    uuid={cellObj.cell.row.original.uuid}
                  />
                </div>
              </div>
            )
          }
        ]}
        data={data}
        docNumber={docsNumber}
      />
    </div>
  );
};

export default TableViewPagare;
