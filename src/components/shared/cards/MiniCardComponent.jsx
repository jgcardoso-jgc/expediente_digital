/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import React from "react";
import { Column } from "simple-flexbox";
import { createUseStyles, useTheme } from "react-jss";

const useStyles = createUseStyles(() => ({
  container: {
    backgroundColor: "#f5f5f5",
    border: `1px solid #f5f5f5`,
    borderRadius: 4,
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
    cursor: "pointer",
    maxWidth: 350,
    padding: "16px 32px 16px 32px",
    "&:hover": {
      borderColor: "#3751FF",
      "&:nth-child(n) > span": {
        color: "#3751FF",
      },
    },
  },
  title: {
    color: "#9fa2b4",
    marginBottom: 12,
    minWidth: 102,
    textAlign: "center",
  },
  value: {
    color: "#373a47",
    fontWeight: "bold",
    fontSize: 40,
    letterSpacing: "1px",
    lineHeight: "50px",
    textAlign: "center",
  },
}));

function MiniCardComponent({ className = "", title, value }) {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const composedClassName = [classes.container, className].join(" ");
  return (
    <Column
      flexGrow={1}
      className={composedClassName}
      horizontal="center"
      vertical="center"
    >
      <span className={classes.title}>{title}</span>
      <span className={classes.value}>{value}</span>
    </Column>
  );
}

export default MiniCardComponent;
