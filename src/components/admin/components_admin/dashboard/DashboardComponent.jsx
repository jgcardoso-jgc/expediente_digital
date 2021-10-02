/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { Column, Row } from "simple-flexbox";
import { createUseStyles } from "react-jss";
import { useFirebaseApp } from "reactfire";
import { useHistory } from "react-router-dom";
import Donut from "./donutComponent";
import MiniCardComponent from "./MiniCardComponent";

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
  card: {
    background: "#f5f5f5",
    padding: "10px",
    borderRadius: "10px",
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1",
  },
  mt30: {
    marginTop: 30,
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
  const history = useHistory();
  const classes = useStyles();
  const [completados, setCompletados] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [faltantes, setFaltantes] = useState(0);
  const [data, setData] = useState([]);

  function setDocs(querySnapshot) {
    const dataGet = [];
    if (querySnapshot.size > 0) {
      let sizeDocs = 0;
      let revDocs = 0;
      let penDocs = 0;
      querySnapshot.forEach((doc) => {
        const generalData = doc.data();
        const docData = generalData.documents;
        docData.forEach((docState) => {
          if (docState.state) {
            sizeDocs += 1;
          } else if (docState.uploaded) {
            revDocs += 1;
          } else {
            penDocs += 1;
          }
        });
      });
      setCompletados(sizeDocs);
      setPendientes(revDocs);
      setFaltantes(penDocs);
      setData([sizeDocs, revDocs, penDocs]);
    }
    return dataGet;
  }

  async function getData() {
    const query = db.collection("users").where("rfc", "!=", "");
    query.get().then((querySnapshot) => setDocs(querySnapshot));
  }

  function toDocs(value) {
    console.log("pressed");
    history.push("/usuarios", { search: value });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
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
              onClick={() => toDocs(completados)}
            />
            <MiniCardComponent
              className={classes.miniCardContainer}
              title="Pendientes"
              value={pendientes}
              onClick={() => toDocs(pendientes)}
            />
            <MiniCardComponent
              className={classes.miniCardContainer}
              title="Faltantes"
              value={faltantes}
              onClick={() => toDocs(faltantes)}
            />
          </Row>
        </Row>
      </Column>
      <Row className={classes.mt30}>
        {data.length > 0 && (
          <Column>
            <div className={classes.card}>
              <Donut dataFetched={data} />
            </div>
          </Column>
        )}
      </Row>
    </div>
  );
}

export default DashboardComponent;
