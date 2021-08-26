/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import { auth, db } from "./firebase_controller";

class UserController {
  userCollection = db.collection("users");

  signDocCollection = db.collection("sign-docs");

  async addNewDocToFirebase(emailList, document, requiresFaceMatch) {
    const users = await this.getUIDsFromEmails(emailList);
    console.log(users);
    const docRef = db.collection("sign-docs").doc();

    const uids = users.map((u) => ({ uid: u.uid }));
    const body = {
      multilateralId: document.multilateralId,
      fileName: document.fileName,
      firmados: [],
      numeroFirmas: users.length,
      docType: document.docType,
      usuarios: users,
      requiresFaceMatch: requiresFaceMatch === 'on',
      status: 'PENDIENTE',
      uids,
    };
    console.log(body);
    docRef
      .set(body)
      .then((docReference) => console.log(docReference))
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  }

  async getSignDocData(multilateralId) {
    const snapshot = await Promise.resolve(
      this.signDocCollection.where("multilateralId", "==", multilateralId).get()
    );
    if (snapshot.size > 0) {
      return snapshot.docs[0].data();
    }
    return "404";
  }

  async getUIDsFromEmails(emailList) {
    const users = [];
    await Promise.all(emailList.map(async (email) => {
      const snapshot = await this.userCollection.where("email", "==", email).get();
      snapshot.forEach((doc) => {
        const docData = doc.data();
        users.push({
          uid: docData.uid,
          email: docData.email,
          name: docData.fullname,
          firmo: false,
        });
      });
    }));
    return users;
  }

  static async addNewDocAlert(users, multilateralID) {
    users.forEach(async (user) => {
      await db
        .collection("users")
        .where("uid", "==", user.uid)
        .get()
        .then((snapshot) => {
          snapshot.forEach(async (doc) => {
            await doc.ref
              .collection("por-firmar")
              .doc(multilateralID.toString())
              .set({
                multilateralID,
              });
          });
        })
        .catch((err) => console.log("Error getting documents", err));
    });
  }

  getUserDocs = (status) => {
    const docs = [];
    const { uid } = auth.currentUser;
    db.collection("sign-docs")
      .where("uids", "array-contains", { uid })
      .where("status", "==", status)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const docData = doc.data();
          docs.push(docData);
        });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
    return docs;
  }

  async updateDocSigned(multilateralId, location) {
    const snapshot = await this.signDocCollection
      .where("multilateralId", "==", multilateralId)
      .get();
    if (snapshot.size > 0) {
      const { uid } = auth.currentUser;
      const doc = snapshot.docs[0];
      const docData = doc.data();
      const time = new Date().toLocaleString('es').split(' ');

      docData.firmados.push(uid);
      docData.status = docData.firmados.length === docData.numeroFirmas ? 'CONCLUIDO' : 'PENDIENTE';
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
      .where("multilateralId", "==", multilateralId)
      .get();
    if (snapshot.size > 0) {
      const doc = snapshot.docs[0];
      const docData = doc.data();
      docData.status = 'CANCELADO';
      await doc.ref.update(docData);
    }
  }
}
export default UserController;
