import React, { useState } from "react";
import logo from "../../assets/logo.png";
import "firebase/auth";
import { useFirebaseApp } from "reactfire";

const LoginNormal = (props) => {
  const firebase = useFirebaseApp();
  //const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className="center">
      <img src={logo} alt="logo" className="logo" />
      <div>Login</div>
      <label htmlFor="email">Correo electrónico</label>
      <input
        type="email"
        id="email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <label htmlFor="password">Contraseña</label>
      <input
        type="password"
        id="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button onClick={submit}>Iniciar Sesión</button>
    </div>
  );
};
export default LoginNormal;
