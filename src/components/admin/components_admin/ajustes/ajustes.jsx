/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";

const AjustesAdmin = () => {
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const [data, setData] = useState([]);

  async function getData() {
    const query = db.collection("documentos");
    await query.get().then((querySnapshot) => {
      let dataGet = [];
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          dataGet = doc.data().lista;
        });
        setData(dataGet);
      }
    });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="container max500">
        <div className="cardDashboard pt10">
          <div className="row" />
          <div>
            {data.length > 0 ? (
              <div>
                {data.map((doc) => (
                  <div>
                    <p key={doc.nombreImagen}>{doc.nombre}</p>
                    <p key={`${doc.nombreImagen}i`}>{doc.nombreImagen}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjustesAdmin;
