/* eslint-disable quotes */
import React, { useState } from "react";

const RegisterSign = () => {
  const [reg, setReg] = useState("hola");
  useState(() => {
    setReg("hola");
  });
  return <div>{reg}</div>;
};

export default RegisterSign;
