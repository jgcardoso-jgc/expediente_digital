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
import Table from 'components/shared/table/table';
import styles from 'resources/theme';
import PopupInputs from '../PopupInputs';

const TableViewPagare = ({
  data,
  docsNumber,
  userEmail,
  form,
  uuid,
  soapController
}) => {
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
            Header: 'CURP Acreedor',
            accessor: 'curpAcreedor'
          },
          {
            Header: 'Deudor',
            accessor: 'deudor'
          },
          {
            Header: 'CURP Deudor',
            accessor: 'curpDeudor'
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
                  className={styles.editButton}
                  onClick={() => handleClickEditRow(cellObj)}
                >
                  {console.log('cell', cellObj.cell.row.original)}
                  <PopupInputs
                    label="Generar"
                    docType={cellObj.cell.row.original.name}
                    items={cellObj.cell.row.original.items}
                    form={form}
                    soapController={soapController}
                    userEmail={userEmail}
                    uuid={uuid}
                    deudorEmail={cellObj.cell.row.original.deudor}
                    deudorName={cellObj.cell.row.original.deudor}
                    inherit={cellObj.cell.row.original.inherit}
                    data={cellObj.cell.row.original}
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
//¿como obtener el email de el deudor?
export default TableViewPagare;
