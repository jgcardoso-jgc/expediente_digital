/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import React from "react";
import { Row } from "simple-flexbox";
import { createUseStyles, useTheme } from "react-jss";
import CardComponent from "../../../shared/cards/CardComponent";

const useStyles = createUseStyles(() => ({
  itemTitle: {
    color: "#373a47"
  },
  itemValue: {
    color: "#9fa2b4"
  }
}));

function UnresolvedTicketsComponent({ containerStyles }) {
  const theme = useTheme();
  const classes = useStyles({ theme });

  function renderStat(title, value) {
    return (
      <Row horizontal="space-between" vertical="center">
        <span className={classes.itemTitle}>{title}</span>
        <span className={[classes.itemTitle, classes.itemValue].join(" ")}>
          {value}
        </span>
      </Row>
    );
  }

  return (
    <CardComponent
      containerStyles={containerStyles}
      title="Unresolved tickets"
      link="View details"
      subtitle="Group:"
      subtitleTwo="Support"
      items={[
        renderStat("Waiting on Feature Request", 4238),
        renderStat("Awaiting Customer Response", 1005),
        renderStat("Awaiting Developer Fix", 914),
        renderStat("Pending", 281)
      ]}
    />
  );
}

export default UnresolvedTicketsComponent;
