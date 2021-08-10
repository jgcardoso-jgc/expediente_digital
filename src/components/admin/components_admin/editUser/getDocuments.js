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
    const promises = [];
    const { email } = locData;
    docsArray.forEach((doc) => {
      const route = `users/${email}/${doc.name}`;
      promises.push(
        storage
          .ref(route)
          .getDownloadURL()
          .then((response) => {
            let { name } = doc;
            if (doc.name === "croppedBackID") {
              name = "ID Reverso";
            }
            if (doc.name === "croppedFrontID") {
              name = "ID Frontal";
            }
            urls.push({ url: response, title: name });
            console.log("founded");
          })
          .catch((err) => {
            console.log(`not founded${err}`);
            urls.push({ url: "404", title: "No se encontró" });
          })
      );
    });
    Promise.all(promises).then(() => {
      console.log("all resolved");
      console.log(urls);
      resolve(urls);
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
        const keys = Object.keys(urls);
        lista.forEach((docElement) => {
          const found = keys.some(
            (key) => urls[key].title === docElement.nombre
          );
          if (!found) {
            checkboxes.push(docElement.nombre);
          }
        });
        resolve(checkboxes);
      });
    });
  });
}

async function setPendientes(db, locData) {
  return new Promise((resolve) => {
    const { email } = locData;
    const query = db.collection("users").where("email", "==", email);
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const docs = doc.data().documents;
        docs.push({ name: "test", state: false });
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
