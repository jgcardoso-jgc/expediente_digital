/* eslint-disable quotes */
import React from "react";
import { IoPersonCircle } from "react-icons/io5";
import NavBar from "../navBar/navBar";

const MyProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user.fullName;
  const { email } = user;
  const { rfc } = user;
  return (
    <div>
      <NavBar />
      <div>
        <h1 className="center pt40 mb20">Mi Perfil</h1>
      </div>
      <div className="container max500">
        <div className="cardDashboard pt10">
          <div className="row">
            <div className="col max40">
              <IoPersonCircle className="iconPerson d-block mx-auto" />
            </div>
            <div className="col min50">
              <p className="mb0">
                <b>{name}</b>
              </p>
              <p className="mt4 mb0">Frontend Developer</p>
              <p className="mt4 mb0">{email}</p>
              <p className="mt4">{rfc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
