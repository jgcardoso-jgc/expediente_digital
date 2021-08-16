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
  mt40: {
    marginTop: 40,
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
  const [revision, setRevision] = useState(0);
  const [faltantes, setFaltantes] = useState(0);

  // eslint-disable-next-line no-unused-vars

  function getStatusDocuments() {
    const query = db.collection("users").where("email", "==", user.email);
    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const gotDoc = doc.data().documents;
        let docsCompletados = 0;
        let docsRevision = 0;
        let docsFaltantes = 0;
        gotDoc.forEach((array) => {
          if (array.state) {
            docsCompletados += 1;
          }
          if (!array.state && array.uploaded) {
            docsRevision += 1;
          }
          if (!array.uploaded) {
            docsFaltantes += 1;
          }
        });
        setCompletados(docsCompletados);
        setRevision(docsRevision);
        setFaltantes(docsFaltantes);
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
            url="/documentos"
          />
          <MiniCardComponent
            className={classes.miniCardContainer}
            title="Revisión"
            value={revision}
            url="/documentos"
          />
          <MiniCardComponent
            className={classes.miniCardContainer}
            title="Faltantes"
            value={faltantes}
            url="/documentos"
          />
        </Row>
      </Row>
      <Row
        className={`${classes.cardsContainer} ${classes.mt40}`}
        wrap
        flexGrow={1}
        horizontal="space-between"
        breakpoints={{ 768: "column" }}
      >
        <DocumentsCard containerStyles={classes.unresolvedTickets} />
        <AlertCard containerStyles={classes.unresolvedTickets} />
      </Row>
    </Column>
  );
}

export default DashboardComponent;
