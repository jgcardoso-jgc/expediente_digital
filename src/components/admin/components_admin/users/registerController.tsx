/* eslint-disable no-param-reassign */
import SoapController from '../../../shared/seguriSign/controller/soap_controller';
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

const soapController = new SoapController();

function rfcValido(rfcPassed) {
  if (rfcPassed.match(rfcpm) || rfcPassed.match(rfcpf)) {
    return true;
  }
  return false;
}

function passwordValida(pass): Boolean {
  const regexPass = new RegExp(
    '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'
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

async function uploadData(user, firebaseHandle) {
  if (checkForm(user.rfc, user.password)) {
    const jsonRegister: User = {
      uid: user.uid,
      fullname: user.name,
      email: user.email,
      rfc: user.rfc,
      token: '',
      registradoSign: user.registradoSign,
      onboarding: false,
      cargo: '',
      docsAdmin: [],
      documents: []
    };

    try {
      await firebaseHandle.db.collection('users').add(jsonRegister);
      return jsonRegister;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  }
  return false;
}

const createUserExpediente = async (firebaseHandle, user) => {
  try {
    const soapResponse = await soapController.createUser(user);
    if (soapResponse) {
      const existingSignin = firebaseHandle.auth().fetchSignInMethodsForEmail(user.email);
      console.log(existingSignin);
      if (existingSignin) {
        return 0;
      }
      const fbResponse = await firebaseHandle.auth
        .createUserWithEmailAndPassword(user.email, user.password);
      if (fbResponse) {
        user.uid = fbResponse.user.uid;
        user.registradoSign = soapResponse === 2;
        return uploadData(user, firebaseHandle);
      }
    }
    return 0;
  } catch (error) {
    return 0;
  }
};

export {
  rfcValido, passwordValida, createUserExpediente
};
