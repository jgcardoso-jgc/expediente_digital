import React from "react";
import { Link } from "react-router-dom";

function ToOnBoarding() {
  return (
    <div>
      <h1>To Onboarding </h1>{" "}
      <Link to="/onboard">
        {" "}
        <button className="logBt" type="button">
          To Onboarding
        </button>
      </Link>
    </div>
  );
}

export default ToOnBoarding;
