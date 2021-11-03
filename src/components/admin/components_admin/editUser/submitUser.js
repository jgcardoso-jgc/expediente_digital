/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
const submit = async (auth, db, name, rfc, email, password) => {
  try {
    await auth
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        const id = res.user.uid;
        try {
          db.collection("users")
            .add({
              uid: id,
              fullname: name,
              cargo: "",
              email,
              rfc,
              token: "",
              onboarding: false,
              docsAdmin: [],
              documents: [],
            })
            .then(() => "Usuario registrado");
        } catch (e) {
          return e;
        }
      });
  } catch (e) {
    return e;
  }
};

export default submit;
