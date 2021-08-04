/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import React from "react";
import { Column, Row } from "simple-flexbox";
import { createUseStyles, useTheme } from "react-jss";

const useStyles = createUseStyles(() => ({
  container: {
    backgroundColor: "#f5f5f5",
    border: `1px solid #f5f5f5`,
    borderRadius: 4,
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
    padding: "24px 32px 0px 32px",
    height: "100%",
  },
  containerMobile: {
    padding: "12px 16px 6px 16px !important",
  },
  itemContainer: {
    marginLeft: -32,
    marginRight: -32,
    paddingLeft: 32,
    paddingRight: 32,
    paddingBottom: 18,
    paddingTop: 18,
    borderBottom: "1px solid #DFE0EB",
    "&:last-child": {
      borderBottom: "none",
    },
  },
  itemContainerMobile: {
    marginLeft: -16,
    marginRight: -16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  link: {},
  subtitle: {
    color: "#9fa2b4",
  },
  subtitle2: {
    color: "#373a47",
    marginLeft: 2,
  },
  title: {
    color: "#373a47",
  },
}));

function CardComponent(props) {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const { title, link, subtitle, subtitleTwo, items, containerStyles } = props;
  function renderItem(item, index) {
    return (
      <Column
        className={classes.itemContainer}
        key={`item-${index}`}
        breakpoints={{ 426: classes.itemContainerMobile }}
      >
        {item}
      </Column>
    );
  }

  return (
    <Column
      flexGrow={1}
      className={[classes.container, containerStyles].join(" ")}
      breakpoints={{ 426: classes.containerMobile }}
    >
      <Row horizontal="space-between">
        <Column>
          <span className={classes.title}>{title}</span>
          <Row style={{ marginTop: 8, marginBottom: 16 }}>
            <span className={classes.subtitle}>{subtitle}</span>
            {subtitleTwo && (
              <span className={[classes.subtitle, classes.subtitle2].join(" ")}>
                {subtitleTwo}
              </span>
            )}
          </Row>
        </Column>
        <span className={classes.link}>{link}</span>
      </Row>
      {items.map(renderItem)}
    </Column>
  );
}

export default CardComponent;
