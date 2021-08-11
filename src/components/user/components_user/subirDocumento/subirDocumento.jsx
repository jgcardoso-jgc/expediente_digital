/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable quotes */
import React from "react";

function SubirDocumentos() {
  function uploadFile() {
    db.ref("users")
      .child(`/${user.email}/croppedFace`)
      .putString(imgs.croppedFace, "base64", metadata)
      .then(() => {
        console.log("uploaded");
        setLoading(false);
        document.getElementById("pic").appendChild(frontId);
      })
      .catch((e) => {
        toast(`Ocurrió un error.${e}`);
      });
  }
  return (
    <div>
      {" "}
      <input
        type="file"
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />
      <button type="button" onClick={() => upload()}>
        Upload
      </button>
    </div>
  );
}

export default SubirDocumentos;
