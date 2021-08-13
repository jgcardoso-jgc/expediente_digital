/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { Column, Row } from "simple-flexbox";
import { createUseStyles } from "react-jss";
import { useFirebaseApp } from "reactfire";
import DocumentsCard from "./cardView";
import AlertCard from "./alertCard";
import MiniCardComponent from "../../../shared/cards/MiniCardComponent";

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
  miniCardContainer: {
    flexGrow: 1,
    marginRight: 30,
    "@media (max-width: 768px)": {
      marginTop: 30,
      maxWidth: "none",
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
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const user = JSON.parse(localStorage.getItem("user"));
  const [completados, setCompletados] = useState(0);

  function getStatusDocuments() {
    const query = db.collection("users").where("email", "==", user.email);
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const gotDoc = doc.data().documents;
        let docsCompletados = 0;
        gotDoc.forEach((array) => {
          console.log(array);
          if (array.state) {
            docsCompletados += 1;
          }
        });
        setCompletados(docsCompletados);
      });
    });
  }

  useEffect(() => {
    getStatusDocuments();
  }, []);
  const classes = useStyles();
  return (
    <Column>
      <Row
        className={classes.cardsContainer}
        wrap
        flexGrow={1}
        horizontal="space-between"
        breakpoints={{ 768: "column" }}
      >
        <Row
          className={classes.cardRow}
          wrap
          flexGrow={1}
          horizontal="space-between"
          breakpoints={{ 384: "column" }}
        >
          <MiniCardComponent
            className={classes.miniCardContainer}
            title="Completados"
            value={completados}
          />
          <MiniCardComponent
            className={classes.miniCardContainer}
            title="Pendientes"
            value="0"
          />
        </Row>
        <Row
          className={classes.cardRow}
          wrap
          flexGrow={1}
          horizontal="space-between"
          breakpoints={{ 384: "column" }}
        >
          <MiniCardComponent
            className={classes.miniCardContainer}
            title="Faltantes"
            value="0"
          />
          <MiniCardComponent
            className={classes.miniCardContainer}
            title="Alertas"
            value="0"
          />
        </Row>
      </Row>
      <Row
        horizontal="space-between"
        className={classes.lastRow}
        breakpoints={{ 1024: "column" }}
      >
        <DocumentsCard containerStyles={classes.unresolvedTickets} />
        <AlertCard containerStyles={classes.unresolvedTickets} />
      </Row>
    </Column>
  );
}

export default DashboardComponent;
