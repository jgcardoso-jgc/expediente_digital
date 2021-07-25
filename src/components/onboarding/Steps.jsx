/* eslint-disable react/prop-types */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import React, { Children, cloneElement } from "react";
import PropTypes from "prop-types";

const Steps = ({ children, currentStep }) => (
  <>
    {Children.map(
      children,
      (child, index) => currentStep === index && cloneElement(child)
    )}
  </>
);

Steps.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default Steps;
