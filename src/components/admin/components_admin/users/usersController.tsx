/* eslint-disable quotes */
import axios from "axios";
import { stringify } from "querystring";
import { cargosLista } from "./usersModel";
import { User } from "../../../../types/user";

function fetchCargos(db) {
  return new Promise<cargosLista[]>((resolve) => {
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
    });
  });
}

async function sendWelcomeEmail(email) {
  const data = {
    email,
  };
  axios({
    method: 'post',
    url: "https://us-central1-seguridata-in-a-box.cloudfunctions.net/sendMail",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: stringify(data),
  })
    .then((res) => console.log(`sended:${res.status}`))
    .catch((res) => console.log(`error:${res}`));
}

function createUser(auth, email, db, name) {
  return new Promise((resolve, reject) => {
    auth
      .createUserWithEmailAndPassword(email, "OneSeguridata2021")
      .then((res) => {
        const id = res.user?.uid;
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
        try {
          db.collection("users")
            .add(jsonRegister)
            .then(() => {
              resolve("200");
            });
        } catch (error) {
          const msg = (error as Error).message;
          reject(msg);
        }
      })
      .catch((error) => {
        const msg = (error as Error).message;
        reject(msg);
      });
  });
}

export { fetchCargos, createUser, sendWelcomeEmail };
