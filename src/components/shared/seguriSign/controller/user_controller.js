/* eslint-disable class-methods-use-this */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */

/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import { auth, db, functions } from './firebase_controller';

class UserController {
  constructor(email) {
    this.email = email;
  }

  userCollection = db.collection('users');

  signDocCollection = db.collection('sign-docs');

  async addNewDocToFirebase(curpList, document, requiresFaceMatch) {
    const docRef = db.collection('sign-docs').doc();
    const body = {
      multilateralId: document.multilateralId,
      fileName: document.fileName,
      firmados: [],
      numeroFirmas: curpList.length,
      docType: document.docType,
      usuarios: curpList,
      requiresFaceMatch: requiresFaceMatch === 'on',
      status: 'PENDIENTE'
    };
    docRef
      .set(body)
      .then((docReference) => {})
      .catch((error) => {});
  }

  async addNewCreatedDocToFirebase(
    curpList,
    document,
    requiresFaceMatch,
    docValues
  ) {
    const docRef = db.collection('sign-docs').doc();
    const docValuesObj = {};
    docValues.forEach((obj) => {
      docValuesObj[obj.name] = obj.value;
    });
    const bodyTemp = {
      multilateralId: document.multilateralId,
      fileName: document.fileName,
      firmados: [],
      numeroFirmas: curpList.length,
      docType: document.docType,
      usuarios: curpList,
      requiresFaceMatch: requiresFaceMatch === 'on',
      status: 'PENDIENTE'
    };
    const body = { ...docValuesObj, ...bodyTemp };
    docRef
      .set(body)
      .then((docReference) => {})
      .catch((error) => {});
  }

  async getSignDocData(multilateralId) {
    const snapshot = await this.signDocCollection
      .where('multilateralId', '==', multilateralId)
      .get();
    if (snapshot.size > 0) {
      return snapshot.docs[0].data();
    }
    return '404';
  }

  async compareCustomerId(customerId) {
    const { uid } = auth.currentUser;
    const snapshot = await this.userCollection.where('uid', '==', uid).get();
    if (snapshot.size > 0) {
      const data = snapshot.docs[0].data();
      return data.customerId === customerId;
    }
    return false;
  }

  async getUserCurp() {
    const { uid } = auth.currentUser;
    const snapshot = await this.userCollection.where('uid', '==', uid).get();
    if (snapshot.size > 0) {
      const data = snapshot.docs[0].data();
      this.curp = data.curp;
    } else {
      this.curp = '';
    }
  }

  static async addNewDocAlert(users, multilateralID) {
    users.forEach(async (user) => {
      await db
        .collection('users')
        .where('uid', '==', user.uid)
        .get()
        .then((snapshot) => {
          snapshot.forEach(async (doc) => {
            await doc.ref
              .collection('por-firmar')
              .doc(multilateralID.toString())
              .set({
                multilateralID
              });
          });
        })
        .catch((err) => {});
    });
  }

  async getUserDocs(status) {
    const docs = [];

    const emailIndexDocs = await db
      .collection('sign-docs')
      .where('usuarios', 'array-contains', this.email)
      .where('status', '==', status)
      .get();

    const curpIndexDocs = await db
      .collection('sign-docs')
      .where('usuarios', 'array-contains', this.curp)
      .where('status', '==', status)
      .get();

    const curpDeudorDocs = await db
      .collection('sign-docs')
      .where('curpDeudor', '==', this.curp)
      .where('status', '==', status)
      .get();

    const curpAcreedorDocs = await db
      .collection('sign-docs')
      .where('curpAcreedor', '==', this.curp)
      .where('status', '==', status)
      .get();
    emailIndexDocs.forEach((doc) => {
      const docData = doc.data();
      const found = docs.some(
        (el) => el.multilateralId === docData.multilateralId
      );
      if (!found) docs.push(docData);
    });
    curpAcreedorDocs.forEach((doc) => {
      const docData = doc.data();
      const found = docs.some(
        (el) => el.multilateralId === docData.multilateralId
      );
      if (!found) docs.push(docData);
    });
    curpDeudorDocs.forEach((doc) => {
      const docData = doc.data();
      const found = docs.some(
        (el) => el.multilateralId === docData.multilateralId
      );
      if (!found) docs.push(docData);
    });
    curpIndexDocs.forEach((doc) => {
      const docData = doc.data();
      const found = docs.some(
        (el) => el.multilateralId === docData.multilateralId
      );
      if (!found) docs.push(docData);
    });
    console.log(docs);
    return docs;
  }

  async updateDocSigned(multilateralId, location) {
    const snapshot = await this.signDocCollection
      .where('multilateralId', '==', multilateralId)
      .get();
    if (snapshot.size > 0) {
      const { uid } = auth.currentUser;
      const doc = snapshot.docs[0];
      const docData = doc.data();
      const time = new Date().toLocaleString('es').split(' ');

      docData.firmados.push(uid);
      // eslint-disable-next-line operator-linebreak
      docData.status =
        docData.firmados.length === docData.numeroFirmas
          ? 'CONCLUIDO'
          : 'PENDIENTE';
      docData.usuarios.forEach((u) => {
        if (u.uid === uid) {
          u.firmo = true;
          u.datosFirma = {
            fechaFirma: time[0],
            horaFirma: time[1],
            ubicacion: {
              lat: location.lat,
              long: location.long
            },
            agente: navigator.userAgent
          };
        }
      });
      await doc.ref.update(docData);
    }
  }

  async updateDocCancelled(multilateralId) {
    const snapshot = await this.signDocCollection
      .where('multilateralId', '==', multilateralId)
      .get();
    if (snapshot.size > 0) {
      const doc = snapshot.docs[0];
      const docData = doc.data();
      docData.status = 'CANCELADO';
      await doc.ref.update(docData);
    }
  }

  /* testEmail = () => {
    const val = functions.httpsCallable("signedDocEmail");
    val()
      .then((result) => {
        console.log(result.data.output);
      })
      .catch((error) => {
        console.log(`error: ${JSON.stringify(error)}`);
      });
  }; */
}
export default UserController;
