/* eslint-disable react/prop-types */
/* eslint-disable comma-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable quotes */
import React, { useState, useEffect } from 'react';
import 'firebase/auth';
import { Link } from 'react-router-dom';
import { useFirebaseApp } from 'reactfire';
import { ToastContainer, toast } from 'react-toastify';
import { createUseStyles, useTheme } from 'react-jss';
import Container from 'react-bootstrap/Container';
import loadingGif from '../../../assets/loading.gif';
import 'react-toastify/dist/ReactToastify.css';
import NavBarMainPage from '../navBarMainPage/navBarMainPage';
import SoapController from '../../shared/seguriSign/controller/soap_controller';
// import waves from '../../../assets/waves.svg';
import SegurisignController from '../../shared/seguriSign/controller/segurisign_controller';
import checkUser from './authController';

const useStyles = createUseStyles(() => ({
  logoNav: { width: '45px', height: '45px', paddingTop: '10px' },
  containerLogin: {
    maxWidth: '400px',
    paddingTop: '60px',
    textAlign: 'left'
  },
  loginBt: {
    backgroundColor: 'rgb(75, 75, 75)',
    color: 'white',
    border: '1px solid black',
    display: 'block',
    marginLeft: 'auto',
    minWidth: '150px',
    paddingTop: '10px',
    marginTop: '20px',
    paddingBottom: '10px',
    fontSize: '15px',
    borderRadius: '10px'
  },
  inputStyle: {
    width: '100%',
    border: '1px solid #f1f1f1',
    fontSize: '16px',
    background: '#f1f1f1',
    marginTop: 8
  },
  tright: {
    textAlign: 'right',
    marginTop: 16
  },
  loadgif: {
    marginTop: '30vh',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  gif: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  mb20: {
    marginBottom: 20
  },
  wave: {
    position: 'absolute',
    bottom: 0
  },
  expText: { marginTop: '4px' },
  pt20: { paddingTop: '20px' },
  pb10: { paddingBottom: '10px' },
  mb4: { marginBottom: '4px' },
  pt14: { paddingTop: '14px' },
  qa: { marginTop: '0', marginBottom: '4px', fontSize: '15px' },
  right: { textAlign: 'right' },
  pt10: { paddingTop: '10px' },
  dBlock: { display: 'block' },
  center: { textAlign: 'center' },
  '@media (max-width: 420px)': { w50: { minWidth: '100%' } },
  '@media (min-width: 768px)': { segTitle: { paddingTop: '30vh' } }
}));

const LoginNormal = ({ setLog }) => {
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [disable, setDisable] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const seguriSignController = new SegurisignController();
  const soapController = new SoapController();

  const loginFirebase = async () => {
    try {
      const credential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
          throw error;
        });
      const { uid } = credential.user;
      localStorage.setItem(
        'sign-user',
        JSON.stringify(seguriSignController.segurisignUser)
      );
      const checkUserFB = await checkUser(uid, db);
      setLoading(false);
      if (checkUserFB === 'error') {
        toast('error');
      } else {
        setLog(checkUserFB);
      }
    } catch (e) {
      setLoading(false);
      setDisable(false);
      toast(e.message);
    }
  };

  async function loginSoap() {
    try {
      setLoading(true);
      if (email !== '' && password !== '') {
        setDisable(true);
        const resultado = await soapController.loginUser(email, password);
        if (resultado instanceof Error) {
          throw resultado;
        }
        seguriSignController
          .loginUser(email, password)
          .then(() => {
            const responseJSON = JSON.stringify(
              seguriSignController.segurisignUser
            );
            // console.log(responseJSON);
            if (responseJSON.token === null) {
              toast('No estás registrado en Segurisign.');
            } else {
              loginFirebase();
            }
          })
          .catch((error) => {
            toast(error);
          });
      } else {
        setLoading(false);
      }
    } catch (e) {
      setDisable(false);
      setLoading(false);
      toast(e.toString());
    }
  }

  useEffect(() => {
    const listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        loginSoap();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [email, password]);

  return (
    <div>
      <div className={classes.center}>
        {loading ? (
          <div className={classes.loadgif}>
            <img src={loadingGif} className={classes.gif} alt="loading..." />
            <p>Accediendo con tus credenciales</p>
          </div>
        ) : (
          <div>
            <ToastContainer />
            <NavBarMainPage />
            <Container className={classes.containerLogin}>
              <div>
                <h2 className="mb4">
                  <b>Login</b>
                </h2>
                <p className="expText">Accede a tu cuenta</p>
              </div>
              <div className={classes.mb20}>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  className={classes.inputStyle}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block pb10 pt20">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  className={classes.inputStyle}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <button
                type="button"
                className={classes.loginBt}
                disabled={disable}
                onClick={() => loginSoap()}
              >
                Iniciar Sesión
              </button>
              <div className={classes.tright}>
                <Link
                  style={{ display: 'inline-block' }}
                  to="./recoverPassword"
                >
                  <p className={(classes.qa, classes.right)}>
                    ¿Olvidaste tu contraseña?
                  </p>
                </Link>
              </div>
            </Container>
          </div>
        )}
      </div>
    </div>
  );
};
export default LoginNormal;
