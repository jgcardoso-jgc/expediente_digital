/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
import { useFirebaseApp } from 'reactfire';
import { Link, useHistory } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import uuid from 'react-uuid';
import { FaFileAlt } from 'react-icons/fa';

const useStyles = createUseStyles(() => ({
  dropdownItemsContainer: {
    background: 'white',
    border: '1px solid #DFE0EB',
    borderRadius: 7,
    minWidth: 250,
    padding: 0,
    WebkitBoxShadow: '0px 14px 28px 3px #CACACA',
    boxShadow: '0px 14px 28px 3px #CACACA',
    position: 'absolute',
    width: '100%'
  },
  flex: {
    display: 'flex',
    marginBottom: 10
  },
  verTodas: {
    minWidth: '100%',
    color: 'blue',
    textAlign: 'center',
    background: 'transparent',
    border: 0,
    fontSize: '14px'
  },
  circle: {
    height: '37px',
    minWidth: '37px',
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#4e73df',
    color: 'white'
  },
  alertBt: {
    borderRadius: 10,
    border: '1px solid transparent',
    marginLeft: 10,
    minWidth: '85%',
    maxWidth: '85%',
    textAlign: 'left',
    paddingLeft: 10
  },
  cardDashboard: {
    background: '#f5f5f5',
    borderRadius: '10px',
    padding: '10px',
    WebkitBoxShadow: '0px 8px 15px 3px #D1D1D1',
    boxShadow: '0px 8px 15px 3px #D1D1D1'
  },
  container: {
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'left',
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  noMailText: {
    marginTop: 20
  }
}));

const AlertasPagina = () => {
  const history = useHistory();
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [alerts, setAlerts] = useState([]);
  const classes = useStyles();
  const [mailVerified, setVerified] = useState(false);

  function onItemClick(doc) {
    if (doc === 'mail') {
      window.open('https://hotmail.com');
    } else {
      history.push({
        pathname: '/subir',
        state: { doc }
      });
    }
  }

  async function appendAlerts() {
    const al = [];
    const user = firebase.auth().currentUser;
    const { uid } = user;
    if (!user.emailVerified) {
      al.push({ message: 'No has confirmado tu correo', doc: 'mail' });
    } else {
      setVerified(true);
    }
    const query = db.collection('users').where('uid', '==', uid);
    query.get().then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const docs = doc.data().documents;
          docs.forEach((states) => {
            if (!states.state && !states.uploaded) {
              al.push({
                message: `Sube el siguiente documento: ${states.name}`,
                doc: states.imageName
              });
            }
          });
        });
      }
      setAlerts(al);
    });
  }

  useEffect(() => {
    appendAlerts();
  }, []);
  return (
    <div>
      <div className={classes.container}>
        {alerts.length > 0 && (
          <div className={classes.cardDashboard}>
            {alerts.map((projName) => (
              <div className={classes.flex}>
                <div className={classes.circle}>
                  <FaFileAlt />
                </div>
                <button
                  type="button"
                  key={uuid}
                  className={classes.alertBt}
                  onClick={() => onItemClick(projName.doc)}
                >
                  {projName.message}
                </button>
              </div>
            ))}
          </div>
        )}
        {mailVerified ? (
          ''
        ) : (
          <Link to="/verificar">
            <p className={classes.noMailText}>
              ¿No has recibido el correo de confirmación?
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AlertasPagina;
