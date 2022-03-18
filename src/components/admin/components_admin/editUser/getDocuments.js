/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
async function getAllDocs(db, locData) {
  return new Promise((resolve) => {
    const { email } = locData;
    const query = db.collection("users").where("email", "==", email);
    query.get().then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const docs = doc.data().documents;
          let { docsAdmin } = doc.data();
          if (docsAdmin == null) {
            docsAdmin = [];
          }
          resolve([docs, docsAdmin]);
        });
      }
    });
  });
}

async function getDownloadURLS(storage, docArray, locData) {
  return new Promise((resolve) => {
    const completed = [];
    const pendientes = [];
    const administrativos = [];
    const promises = [];
    const { email } = locData;
    docArray[0].forEach((doc) => {
      const route = `users/${email}/${doc.imageName}`;
      promises.push(
        storage
          .ref(route)
          .getDownloadURL()
          .then((response) => {
            if (!doc.state) {
              // se ha subido el documento, pero aun no se aprueba por el admin
              const pendientesFormat = {
                url: response,
                title: doc.name,
                uploaded: doc.uploaded,
                imageName: doc.imageName,
                email,
              };
              pendientes.push(pendientesFormat);
            } else {
              const completedFormat = {
                url: response,
                title: doc.name,
                imageName: doc.imageName,
              };
              completed.push(completedFormat);
            }
          })
          .catch(() => {
            const missingFormat = {
              url: "404",
              title: doc.name,
              email,
              imageName: doc.imageName,
            };
            pendientes.push(missingFormat);
          })
      );
    });
    docArray[1].forEach((docAdmin) => {
      const routeAdmin = `users/${email}/administrativos/${docAdmin.name}`;
      promises.push(
        storage
          .ref(routeAdmin)
          .getDownloadURL()
          .then((response) => {
            const adminDocFormat = { url: response, title: docAdmin.name };
            administrativos.push(adminDocFormat);
          })
      );
    });
    Promise.all(promises).then(() => {
      resolve([completed, pendientes, administrativos]);
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
        // se agregan los nuevos documentos pendientes
        docsToUpdate.forEach((newDoc) => {
          const newDocFormat = {
            name: newDoc.nombre,
            imageName: newDoc.nombreImagen,
            uploaded: false,
            state: false,
          };
          docs.push(newDocFormat);
        });
        db.collection("users")
          .doc(doc.id)
          .update({ documents: docs })
          .then(() => {
            resolve("listo");
          });
      });
    });
  });
}

function updateAdminDocs(db, locData, nameDoc, descDoc) {
  return new Promise((resolve) => {
    const format = {
      name: nameDoc,
      fileName: nameDoc,
      descripcion: descDoc,
    };
    const query = db.collection("users").where("email", "==", locData.email);
    query
      .get()
      .then((querySnapshot) =>
        querySnapshot.forEach((doc) => {
          let gotDoc = doc.data().docsAdmin;
          if (gotDoc == null) {
            gotDoc = [];
          }
          gotDoc.push(format);
          db.collection("users")
            .doc(doc.id)
            .update({ docsAdmin: gotDoc })
            .then(() => {
              resolve(gotDoc);
            });
        })
      )
      .catch((e) => {
        throw e;
      });
  });
}

function uploadFile(storage, file, locData, nameDoc) {
  return new Promise((resolve) => {
    storage
      .ref("users")
      .child(`/${locData.email}/administrativos/${nameDoc}`)
      .put(file)
      .then(() => {
        resolve("searchEmail");
      })
      .catch((e) => {
        throw e;
      });
  });
}

const docFunctions = {
  getAllDocs,
  getDownloadURLS,
  setCheckboxes,
  setPendientes,
  uploadFile,
  updateAdminDocs,
};

export default docFunctions;
