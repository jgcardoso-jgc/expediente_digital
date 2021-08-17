/* eslint-disable operator-linebreak */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import onBoardingConfig from "./onBoardingConfig";

let incode = null;
const metadata = {
  contentType: "image/jpeg",
};

function start() {
  incode = window.OnBoarding.create(onBoardingConfig);
}

function exists(response) {
  return new Promise((resolve) => {
    let notFound = false;
    let pendiente = false;
    response.forEach((obj) => {
      if (obj.title === "incode") {
        notFound = true;
      }
      if (obj.title === "pendiente") {
        pendiente = true;
      }
    });
    if (pendiente) {
      resolve("pendiente");
    }
    if (notFound) {
      resolve("not exists");
    } else {
      const docArray = [];
      response.forEach((objImg) => {
        docArray.push(objImg);
      });
      resolve(docArray);
    }
  });
}

function getState(db, storage, user) {
  return new Promise((resolve) => {
    if (user.onboarding) {
      // if (user.token === "") {
      //  resolve("Set Onboarding");
      // }
      // if (user.token !== "") {
      let docs = [];
      const completados = [];
      const revision = [];
      const pendientes = [];
      const promises = [];
      const query = db.collection("users").where("email", "==", user.email);
      query.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          docs = doc.data().documents;
        });
        docs.forEach((doc) => {
          const route = `users/${user.email}/${doc.imageName}`;
          promises.push(
            storage
              .ref(route)
              .getDownloadURL()
              .then((response) => {
                if (doc.state) {
                  completados.push({ url: response, title: doc.name });
                } else {
                  revision.push({ url: response, title: doc.name });
                }
              })
              .catch(() => {
                if (
                  doc.imageName === "croppedBackID" ||
                  doc.imageName === "croppedFrontID"
                ) {
                  pendientes.push({ url: "404", title: "incode" });
                } else {
                  pendientes.push({ url: doc.imageName, title: doc.name });
                }
              })
          );
        });
        Promise.all(promises).then(() => {
          console.log("all resolved");
          resolve([completados, revision, pendientes]);
        });
      });
      // }
    } else {
      resolve("same state");
    }
  });
}

function notExists(db, user) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://sdk-js.s3.amazonaws.com/sdk/onBoarding-1.30.1.js";
    document.body.appendChild(script);
    script.onload = () => {
      start();
      incode
        .createSession("ALL", null, {
          configurationId: "60f0969272a9270015196d70",
        })
        .then(async () => {
          try {
            const imgs = await incode.getImages({
              token: user.token,
              body: { images: ["croppedFrontID", "croppedBackID"] },
            });
            const keys = Object.keys(imgs);
            const promises = [];
            keys.forEach((key) => {
              const frontId = new Image();
              frontId.src = `data:image/png;base64,${imgs[key]}`;
              frontId.style.width = "100%";
              frontId.style.borderTopLeftRadius = "14px";
              frontId.style.borderTopRightRadius = "14px";
              promises.push(
                db
                  .ref("users")
                  .child(`/${user.email}/${key}`)
                  .putString(imgs[key], "base64", metadata)
                  .then(() => {
                    console.log("uploaded");
                    document.getElementById("ineFront").appendChild(frontId);
                  })
              );
            });
            await Promise.all(promises).then(resolve("all done"));
          } catch (e) {
            resolve(`Ocurrió un error.${e}`);
          }
        });
    };
  });
}

const docFunctions = { exists, getState, notExists };

export default docFunctions;
