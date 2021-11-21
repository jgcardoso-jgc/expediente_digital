import SoapController from '../../../shared/seguriSign/controller/soap_controller';
import SegurisignController from '../../../shared/seguriSign/controller/segurisign_controller';
import { User } from '../../../../types/user';

const rfcpm = '^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|'
    + '(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|'
    + '(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|'
    + '(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$';
  // patron del RFC, persona fisica
const rfcpf = '^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|'
    + '(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|'
    + '(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|'
    + '(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$';

const seguriSignController = new SegurisignController();

function rfcValido(rfcPassed) {
  if (rfcPassed.match(rfcpm) || rfcPassed.match(rfcpf)) {
    return true;
  }
  return false;
}

function passwordValida(pass): Boolean {
  const regexPass = new RegExp(
    '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$',
  );
  if (regexPass.test(pass)) {
    return true;
  }
  return false;
}

function checkForm(rfc, password) {
  if (rfc !== '' && password !== '') {
    return true;
  }
  return false;
}

function uploadData(res, email, name, rfc, password, db) {
  return new Promise((resolve, reject) => {
    if (checkForm(rfc, password)) {
      const id = res.user.uid;
      const jsonRegister : User = {
        uid: id,
        fullname: name,
        email,
        rfc,
        token: '',
        onboarding: false,
        cargo: '',
        docsAdmin: [],
        documents: [],
      };
      try {
        db.collection('users')
          .add(jsonRegister)
          .then(() => resolve(jsonRegister));
      } catch (error) {
        if (error instanceof Error) {
          reject(error.message);
        }
      }
    }
  });
}

function submitFirebase(email, password, auth) {
  return new Promise((resolve, reject) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => resolve(res))
      .catch((error) => {
        reject(error.message);
      });
  });
}

const loginUser = (email, password, auth) => new Promise((resolve, reject) => {
  seguriSignController
    .loginUser(email, password)
    .then(() => {
      const responseJSON = seguriSignController.segurisignUser;
      // console.log(responseJSON);
      if (responseJSON.token === null) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('No estás registrado en Segurisign.');
      } else {
        localStorage.setItem(
          'sign-user',
          JSON.stringify(seguriSignController.segurisignUser),
        );
      }
    })
    .catch((error) => {
      reject(error);
    });
  submitFirebase(email, password, auth).then((res) => {
    resolve(res);
  }).catch((e) => {
    reject(e);
  });
});

const submit = async (email, password, name, rfc) => new Promise((resolve, reject) => {
  const soapController = new SoapController();
  soapController
    .createNewUser({
      email,
      password,
      name,
      rfc,
    }).then(() => resolve(200))
    .catch((e) => {
      const parser = new DOMParser();
      const errorResponse = parser.parseFromString(
        e.responseText,
        'application/xhtml+xml',
      );
      const resultado = errorResponse.getElementsByTagName('message')[0].childNodes[0].nodeValue;
      reject(resultado);
    });
});

export {
  rfcValido, passwordValida, uploadData, submitFirebase, submit, loginUser,
};
