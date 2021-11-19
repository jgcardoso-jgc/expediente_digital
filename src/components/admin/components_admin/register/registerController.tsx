import SoapController from '../../../shared/seguriSign/controller/soap_controller';
import SegurisignController from '../../../shared/seguriSign/controller/segurisign_controller';

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

function uploadData(res) {
  if (checkForm()) {
    const id = res.user.uid;
    const jsonRegister = {
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
        .then(() => navigate(jsonRegister));
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      }
    }
  }
}

function checkForm() {
  if (rfc !== '' && password !== '') {
    return true;
  }
  return false;
}

function submitFirebase() {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => uploadData(res))
    .catch((error) => {
      setLoading(false);
      setDisabled(false);
      toast(error.message);
    });
}

const submit = async () => {
  const soapController = new SoapController();
  setDisabled(true);
  setLoading(true);
  soapController
    .createNewUser({
      email,
      password,
      name,
      rfc,
    })
    .then(() => {
      seguriSignController
        .loginUser(email, password)
        .then(() => {
          const responseJSON = JSON.stringify(
            seguriSignController.segurisignUser,
          );
          console.log(responseJSON);
          if (responseJSON.token === null) {
            toast('No estás registrado en Segurisign.');
          } else {
            localStorage.setItem(
              'sign-user',
              JSON.stringify(seguriSignController.segurisignUser),
            );
          }
        })
        .catch((error) => {
          alert(error);
        });

      submitFirebase();
    })
    .catch((e) => {
      setLoading(false);
      setDisabled(false);
      const parser = new DOMParser();
      const errorResponse = parser.parseFromString(
        e.responseText,
        'application/xhtml+xml',
      );
      const resultado = errorResponse.getElementsByTagName('message')[0].childNodes[0].nodeValue;
      toast(resultado);
    });
};

export {
  rfcValido, passwordValida, uploadData, submitFirebase, submit,
};
