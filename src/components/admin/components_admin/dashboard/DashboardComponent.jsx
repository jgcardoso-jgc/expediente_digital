/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { Column, Row } from "simple-flexbox";
import { createUseStyles } from "react-jss";
import { useFirebaseApp } from "reactfire";
import MiniCardComponent from "../../../shared/cards/MiniCardComponent";
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
  miniCardContainer: {
    flexGrow: 1,
    marginRight: 30,
    "@media (max-width: 768px)": {
      marginTop: 30,
      maxWidth: "none",
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
  const firebase = useFirebaseApp();
  const db = firebase.firestore();
  const classes = useStyles();
  const [completados, setCompletados] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [faltantes, setFaltantes] = useState(0);

  async function getDataDocs() {
    getData().then((objSize) => {
      setCompletados(objSize.completados);
      setPendientes(objSize.revision);
      setFaltantes(objSize.faltantes);
    });
  }

  async function getData() {
    return new Promise((resolve) => {
      const query = db.collection("users").where("rfc", "!=", "");
      query.get().then((querySnapshot) => {
        const dataGet = [];
        if (querySnapshot.size > 0) {
          let sizeDocs = 0;
          let revDocs = 0;
          let penDocs = 0;
          querySnapshot.forEach((doc) => {
            const generalData = doc.data();
            const docData = generalData.documents;
            docData.forEach((docState) => {
              if (docState.state === true) {
                sizeDocs += 1;
              } else if (docState.uploaded === true) {
                revDocs += 1;
              } else {
                penDocs += 1;
              }
            });
          });
          resolve({
            completados: sizeDocs,
            revision: revDocs,
            faltantes: penDocs,
          });
        } else {
          resolve(dataGet);
        }
      });
    });
  }

  useEffect(() => {
    getDataDocs();
  }, []);
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
            title="Documentos"
            value={completados}
          />
          <MiniCardComponent
            className={classes.miniCardContainer}
            title="Pendientes"
            value={pendientes}
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
            value={faltantes}
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
        <UnresolvedTicketsComponent
          containerStyles={classes.unresolvedTickets}
        />
        <TasksComponent containerStyles={classes.tasks} />
      </Row>
    </Column>
  );
}

export default DashboardComponent;
