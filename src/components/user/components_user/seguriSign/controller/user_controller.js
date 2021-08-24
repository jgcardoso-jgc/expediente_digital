/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable quotes */
import { auth, db } from "./firebase_controller";

class UserController {
  userCollection = db.collection("users");

  signDocCollection = db.collection("sign-docs");

  async addNewDocToFirebase(emailList, document) {
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
    emailList.forEach(async (email) => {
      await this.userCollection
        .where("email", "==", email)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const docData = doc.data();
            users.push({
              uid: docData.uid,
              email: docData.email,
              name: docData.fullname,
              firmo: false,
            });
          });
        })
        .catch((err) => {
          console.log("Error getting documents", err);
        });
    });
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

  static getUserDocs(uid) {
    const docs = [];
    db.collection("sign-docs")
      .where("uids", "array-contains", { uid })
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

  async updateDocSigned(multilateralId) {
    const snapshot = await this.signDocCollection
      .where("multilateralId", "==", multilateralId)
      .get();
    if (snapshot.size > 0) {
      const { uid } = auth.currentUser;
      const doc = snapshot.docs[0];
      const docData = doc.data();
      docData.firmados.push(uid);
      docData.usuarios.forEach((u) => {
        u.firmo = u.uid === uid;
      });
      await doc.ref.update(docData);
    }
  }
}

export default UserController;
