/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable quotes */
const submit = async (auth, db, name, rfc, email, password) => {
  try {
    await auth
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        const id = res.user.uid;
        console.log(id);
        try {
          db.collection("users")
            .add({
              uid: id,
              fullname: name,
              email,
              rfc,
              token: "",
              onboarding: false,
              documents: [],
            })
            .then(() => {
              localStorage.setItem(
                "user",
                JSON.stringify({
                  fullName: name,
                  email,
                  rfc,
                  token: "",
                  onboarding: false,
                  documents: [],
                })
              );
              return "Usuario registrado";
            });
        } catch (e) {
          return e;
        }
      });
  } catch (e) {
    return e;
  }
};

export default submit;
