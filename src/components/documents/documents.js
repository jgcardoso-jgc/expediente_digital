import React from "react";
import { getImage } from "./api";
import { useEffect } from "react";

function Documents() {
  const user = JSON.parse(localStorage.getItem("user"));
  function getImg() {
    return async () =>
      await getImage(user.token).then((res) => {
        console.log("response:" + res);
        return res;
      });
  }

  useEffect(() => {
    getImg();
  });
  return (
    <div>
      <h1 className="center">Mis documentos</h1>
    </div>
  );
}

export default Documents;
