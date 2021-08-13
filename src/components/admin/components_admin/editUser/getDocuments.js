/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable quotes */
async function getState(db, locData) {
  return new Promise((resolve) => {
    const { email } = locData;
    const query = db.collection("users").where("email", "==", email);
    query.get().then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const docs = doc.data().documents;
          resolve(docs);
        });
      }
    });
  });
}

async function getDownloadURLS(storage, docsArray, locData) {
  return new Promise((resolve) => {
    const urls = [];
    const pendientes = [];
    const promises = [];
    const { email } = locData;
    docsArray.forEach((doc) => {
      const route = `users/${email}/${doc.imageName}`;
      promises.push(
        storage
          .ref(route)
          .getDownloadURL()
          .then((response) => {
            if (!doc.state) {
              // se ha subido el documento, pero aun no se aprueba por el admin
              pendientes.push({
                url: response,
                title: doc.name,
                uploaded: doc.uploaded,
                imageName: doc.imageName,
              });
            } else {
              urls.push({
                url: response,
                title: doc.name,
                imageName: doc.imageName,
              });
              console.log("founded");
            }
          })
          .catch(() => {
            pendientes.push({ url: "404", title: doc.name });
          })
      );
    });
    Promise.all(promises).then(() => {
      console.log("all resolved");
      console.log(urls);
      resolve([urls, pendientes]);
    });
  });
}

async function setCheckboxes(db, urls) {
  return new Promise((resolve) => {
    const checkboxes = [];
    const query = db.collection("documentos");
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((docs) => {
        const { lista } = docs.data();
        const keysComp = Object.keys(urls[0]);
        const keysPend = Object.keys(urls[1]);
        const completados = urls[0];
        const pendientes = urls[1];
        lista.forEach((docElement) => {
          const found = keysComp.some(
            (key) => completados[key].title === docElement.nombre
          );
          const pendiente = keysPend.some(
            (key) => pendientes[key].title === docElement.nombre
          );
          if (!found && !pendiente) {
            checkboxes.push({
              nombre: docElement.nombre,
              nombreImagen: docElement.nombreImagen,
            });
          }
        });
        resolve(checkboxes);
      });
    });
  });
}

async function setPendientes(db, docsToUpdate, locData) {
  return new Promise((resolve) => {
    const { email } = locData;
    const query = db.collection("users").where("email", "==", email);
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const docs = doc.data().documents;
        docsToUpdate.forEach((newDoc) => {
          docs.push({
            name: newDoc.nombre,
            imageName: newDoc.nombreImagen,
            uploaded: false,
            state: false,
          });
        });
        db.collection("users").doc(doc.id).update({ documents: docs });
        resolve("Se agregó documento a Pendientes");
      });
    });
  });
}

const docFunctions = {
  getState,
  getDownloadURLS,
  setCheckboxes,
  setPendientes,
};

export default docFunctions;
