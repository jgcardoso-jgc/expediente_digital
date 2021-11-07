/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable quotes */
import axios from "axios";
import { stringify } from "querystring";
import { cargosLista } from "./usersModel";
import { User } from "../../../../types/user";

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
            label: c.nombre,
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
    const msg = "Bienvenido a Seguridata | Expediente <br> Para registrarte haz click en el siguiente link: <br> <a href='https://expediente-digital.vercel.app/loginNormal'> Inicia ahora </a> <br> Tu contraseña es: <br> <b>OneSeguridata2021</b>";
    const data = {
      email,
      msg,
    };
    axios({
      method: 'post',
      url: "https://us-central1-seguridata-in-a-box.cloudfunctions.net/sendWelcome",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: stringify(data),
    })
      .then((res) => resolve(`sended:${res.status}`))
      .catch((res) => reject(`error:${res}`));
  });
}

function createUser(auth, email, db, name) {
  return new Promise((resolve, reject) => {
    auth
      .createUserWithEmailAndPassword(email, "OneSeguridata2021")
      .then((userCredential) => {
        userCredential.user.sendEmailVerification().then(() => {
          const id = userCredential.user?.uid;
          const jsonRegister: User = {
            uid: id,
            fullname: name,
            email,
            rfc: "",
            token: "",
            onboarding: false,
            cargo: "",
            docsAdmin: [],
            documents: [],
          };
          db.collection("users")
            .add(jsonRegister)
            .then(() => {
              resolve("200");
            });
        });
      })
      .catch((error) => {
        const msg = (error as Error).message;
        reject(msg);
      });
  });
}

export { fetchCargos, createUser, sendWelcomeEmail };
