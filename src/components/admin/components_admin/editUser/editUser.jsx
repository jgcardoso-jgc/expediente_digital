/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const EditUser = () => {
  const location = useLocation();
  const [userData, setData] = useState("");

  useEffect(() => {
    setData(location.state.objUser); // result: 'some_value'
  }, [location]);
  return (
    <div>
      <div className="container max500">
        <div className="cardDashboard pt10">
          <div className="row" />
          <p>{userData.fullname}</p>
          <p>{userData.rfc}</p>
          <p>{userData.email}</p>
          <p>Documentos</p>
          <button type="button">Agregar Documentos</button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
