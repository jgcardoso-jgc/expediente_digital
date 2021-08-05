/* eslint-disable quotes */
import React from "react";
import { Column, Row } from "simple-flexbox";
import { createUseStyles } from "react-jss";
import UnresolvedTicketsComponent from "./UnresolvedTicketsComponent";
import TasksComponent from "./TasksComponent";

const useStyles = createUseStyles({
  cardsContainer: {
    marginRight: -30,
    marginTop: -30,
  },
  cardRow: {
    marginTop: 30,
    "@media (max-width: 768px)": {
      marginTop: 0,
    },
  },
  todayTrends: {
    marginTop: 30,
  },
  lastRow: {
    marginTop: 30,
  },
  unresolvedTickets: {
    marginRight: 30,
    "@media (max-width: 1024px)": {
      marginRight: 0,
    },
  },
  tasks: {
    marginTop: 0,
    "@media (max-width: 1024px)": {
      marginTop: 30,
    },
  },
});

function DashboardComponent() {
  const classes = useStyles();
  return (
    <Column>
      <Row
        horizontal="space-between"
        className={classes.lastRow}
        breakpoints={{ 1024: "column" }}
      >
        <UnresolvedTicketsComponent
          containerStyles={classes.unresolvedTickets}
        />
        <TasksComponent containerStyles={classes.tasks} />
      </Row>
    </Column>
  );
}

export default DashboardComponent;
