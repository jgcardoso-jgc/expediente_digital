/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable quotes */
async function getState(db, locData) {
  return new Promise((resolve) => {
    const docs = ["croppedFrontID", "croppedBackID"];
    const urls = [];
    const promises = [];
    const { email } = locData;
    docs.forEach((doc) => {
      const route = `users/${email}/${doc}`;
      promises.push(
        db
          .ref(route)
          .getDownloadURL()
          .then((response) => {
            urls.push({ url: response, title: doc });
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

export default getState;
