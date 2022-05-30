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
import styles from './tableView.module.scss';
import PopupInputs from '../PopupInputs';

const TableViewDocs = ({
  data,
  docsNumber,
  userEmail,
  name,
  form,
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
            Header: 'Nombre',
            accessor: 'document',
            Cell: (cellObj) => (
              <div>
                <div
                  role="button"
                  className={styles.docButton}
                  onClick={() => handleClickEditRow(cellObj)}
                >
                  <PopupInputs
                    label={cellObj.cell.row.original.label}
                    docType={cellObj.cell.row.original.name}
                    items={cellObj.cell.row.original.items}
                    form={form}
                    soapController={soapController}
                    deudorEmail={userEmail}
                    deudorName={name}
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

export default TableViewDocs;
