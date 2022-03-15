/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable quotes */
import axios from "axios";
import { cargosLista } from "./usersModel";

function fetchCargos(db) {
  return new Promise<cargosLista[]>((resolve, reject) => {
    const query = db.collection("cargos");
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const dataLista = doc.data().lista;
        const cLista: cargosLista[] = [];
        dataLista.forEach((c) => {
          cLista.push({
            value: c.nombre,
            label: c.nombre
          });
        });
        resolve(cLista);
      });
    }).catch((error) => {
      const msg = (error as Error).message;
      reject(msg);
    });
  });
}

async function sendWelcomeEmail(email) {
  return new Promise((resolve, reject) => {
    const msg = "Bienvenido a Seguridata | Expediente <br> Para terminar tu registro haz click en el siguiente link: <br> <a href='https://expediente-digital.vercel.app/updatePassword'> Inicia ahora </a> <br> Tu contraseña temporal es: <br> <b>OneSeguridata2021</b>";
    // agregar mensaje de bienvenida a estudiante
    const data = {
      email,
      msg
    };
    axios({
      method: 'post',
      url: "https://us-central1-seguridata-in-a-box.cloudfunctions.net/sendWelcome",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: JSON.stringify(data)
    })
      .then((res) => resolve(`sended:${res.status}`))
      .catch((res) => reject(`error:${res}`));
  });
}

async function sendWelcomeEmailSign(email) {
  return new Promise((resolve, reject) => {
    const msg = "Bienvenido a Seguridata | Expediente <br> Para registrarte haz click en el siguiente link: <br> <a href='https://expediente-digital.vercel.app/updatePasswordSign'> Inicia ahora </a> <br> Tu contraseña temporal es: <br> <b>OneSeguridata2021</b> Tu contraseña de Sign sigue siendo la misma.";
    const data = {
      email,
      msg
    };
    axios({
      method: 'post',
      url: "https://us-central1-seguridata-in-a-box.cloudfunctions.net/sendWelcome",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: JSON.stringify(data)
    })
      .then((res) => resolve(`sended:${res.status}`))
      .catch((res) => reject(`error:${res}`));
  });
}

export { fetchCargos, sendWelcomeEmail, sendWelcomeEmailSign };
