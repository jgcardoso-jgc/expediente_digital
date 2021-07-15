import React from "react";
import { getImage } from "./api";
import { useEffect } from "react";

function Documents() {
  const user = JSON.parse(localStorage.getItem("user"));

  async function getImg() {
    console.log("getting...");
    const response = await getImage(user.token);
    console.log(response);
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
