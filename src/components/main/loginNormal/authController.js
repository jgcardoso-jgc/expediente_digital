/* eslint-disable quotes */
function checkUser(uid, db) {
  return new Promise((resolve, reject) => {
    const query = db.collection("users").where("uid", "==", uid);
    query
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.admin) {
              localStorage.setItem("admin", true);
              resolve("admin");
            } else {
              let cargo = "";
              if (data.cargo != null) {
                cargo = data.cargo;
              }
              const userData = {
                fullName: data.fullname,
                email: data.email,
                rfc: data.rfc,
                curp: data.curp,
                onboarding: data.onboarding,
                cargo,
                token: ""
              };
              localStorage.setItem("user", JSON.stringify(userData));
              resolve("user");
            }
          });
        } else {
          console.log(uid);
          reject(new Error("4044"));
        }
      })
      .catch((e) => {
        reject(e.message);
      });
  });
}

export default checkUser;
