/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable comma-dangle */
/* eslint-disable react/require-default-props */
/* eslint-disable quotes */
import React, { useState, useEffect, useRef } from "react";
import {
  arrayOf,
  element,
  func,
  number,
  oneOfType,
  shape,
  string,
} from "prop-types";
import { Column } from "simple-flexbox";
import { createUseStyles, useTheme } from "react-jss";

const useStyles = createUseStyles(() => ({
  arrowContainer: {
    position: "absolute",
    top: -19,
    right: 15,
  },
  dropdownButton: {
    alignItems: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    padding: 0,
    outline: "none",
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownItemsContainer: {
    background: "white",
    border: "1px solid #DFE0EB",
    borderRadius: 5,
    minWidth: 170,
    padding: 0,
    WebkitBoxShadow: "0px 14px 28px 3px #CACACA",
    boxShadow: "0px 14px 28px 3px #CACACA",
    position: "absolute",
    width: "100%",
    top: ({ position }) => position.top,
    right: ({ position }) => position.right,
    bottom: ({ position }) => position.bottom,
    left: ({ position }) => position.left,
    "& button:first-of-type:hover div > svg > path": {
      fill: "#DDE2FF",
    },
  },
  dropdownItem: {
    cursor: "pointer",
    background: "transparent",
    border: "none",
    fontSize: 16,
    outline: "none",
    padding: "10px 10px",
    "&:hover": {
      background: "#DDE2FF",
    },
    "&:after": {
      content: '" "',
      display: "block",
      position: "relative",
      bottom: -10,
      width: "100%",
      height: 1,
      background: "#DDE2FF",
    },
    "&:last-child:after": {
      content: "",
      display: "none",
    },
  },
}));

function DropdownComponent({ label, options, position }) {
  const ref = useRef();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const theme = useTheme();
  const classes = useStyles({ theme, position });

  function onDropdownClick() {
    setUserMenuOpen((prev) => !prev);
  }

  function onItemClick(onClick) {
    setUserMenuOpen(false);
    onClick && onClick();
  }

  const handleClick = (e) => {
    if (ref.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setUserMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div ref={ref}>
      <Column className={classes.dropdownContainer}>
        <button
          type="button"
          className={classes.dropdownButton}
          onClick={() => onDropdownClick()}
        >
          {label}
        </button>
        {userMenuOpen && (
          <Column className={classes.dropdownItemsContainer}>
            {options.map((option, index) => (
              <button
                key={`option-${index}`}
                type="button"
                className={classes.dropdownItem}
                onClick={() => onItemClick(option.onClick)}
              >
                {option.label}
              </button>
            ))}
          </Column>
        )}
      </Column>
    </div>
  );
}

DropdownComponent.propTypes = {
  label: oneOfType([string, element]),
  options: arrayOf(
    shape({
      label: oneOfType([string, arrayOf(element)]),
      onClick: func,
    })
  ),
  position: shape({
    top: number,
    right: number,
    bottom: number,
    left: number,
  }),
};

DropdownComponent.defaultProps = {
  position: {
    top: 52,
    right: -6,
  },
};

export default DropdownComponent;
