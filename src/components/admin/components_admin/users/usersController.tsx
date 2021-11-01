/* eslint-disable quotes */
import { cargosLista } from "./usersModel";

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

export default fetchCargos;
