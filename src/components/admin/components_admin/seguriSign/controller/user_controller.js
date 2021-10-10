/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import { auth, db, functions } from "./firebase_controller";

class UserController {
  constructor(email) { this.email = email; }

  userCollection = db.collection("users");

  signDocCollection = db.collection("sign-docs");

  addNewDocToFirebase = async (emailList, document, requiresFaceMatch) => {
    const docRef = db.collection("sign-docs").doc();
    const body = {
      multilateralId: document.multilateralId,
      fileName: document.fileName,
      firmados: [],
      numeroFirmas: emailList.length,
      docType: document.docType,
      usuarios: emailList,
      requiresFaceMatch: requiresFaceMatch === 'on',
      status: 'PENDIENTE',
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
    const snapshot = await this.signDocCollection.where("multilateralId", "==", multilateralId).get();
    if (snapshot.size > 0) {
      return snapshot.docs[0].data();
    }
    return "404";
  }

  async compareCustomerId(customerId) {
    const { uid } = auth.currentUser;
    const snapshot = await this.userCollection.where("uid", "==", uid).get();
    if (snapshot.size > 0) {
      const data = snapshot.docs[0].data();
      return data.customerId === customerId;
    }
    return false;
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
    db.collection("sign-docs")
      .where("usuarios", "array-contains", this.email)
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
      this.testEmail();
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

  testEmail = () => {
    const val = functions.httpsCallable('signedDocEmail');
    val().then((result) => {
      console.log(result.data.output);
    }).catch((error) => {
      console.log(`error: ${JSON.stringify(error)}`);
    });
  }
}
export default UserController;
