/* eslint-disable quotes */
import React from "react";
import { Column, Row } from "simple-flexbox";
import { createUseStyles, useTheme } from "react-jss";
import LineChart from "react-svg-line-chart";

const data = [];

for (let x = 1; x <= 24; x += 1) {
  data.push({ x, y: Math.floor(Math.random() * 100) });
}

const useStyles = createUseStyles(() => ({
  container: {
    backgroundColor: "#f5f5f5",
    border: "1px solid #DFE0EB",
    borderRadius: 4,
    cursor: "pointer",
    WebkitBoxShadow: "0px 8px 15px 3px #D1D1D1",
    boxShadow: "0px 8px 15px 3px #D1D1D1"
  },
  graphContainer: {
    marginTop: 24,
    marginLeft: 0,
    marginRight: 0,
    width: "100%"
  },
  graphSection: {
    padding: 24
  },
  graphSubtitle: {
    color: "#9fa2b4",
    marginTop: 4,
    marginRight: 8
  },
  graphTitle: {
    color: "#373a47"
  },
  legendTitle: {
    fontWeight: "600",
    color: "#9fa2b4",
    marginLeft: 8
  },
  separator: {
    backgroundColor: "#DFE0EB",
    width: 1,
    minWidth: 1
  },
  statContainer: {
    borderBottom: "1px solid #9fa2b4",
    padding: "24px 32px 24px 32px",
    height: "calc(114px - 48px)",
    "&:last-child": {
      border: "none"
    }
  },
  stats: {
    borderTop: "1px solid #DFE0EB",
    width: "100%"
  },
  statTitle: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: "22px",
    letterSpacing: "0.3px",
    textAlign: "center",
    color: "#9fa2b4",
    whiteSpace: "nowrap",
    marginBottom: 6
  },
  statValue: {
    textAlign: "center",
    color: "black"
  }
}));

function TodayTrendsComponent() {
  const theme = useTheme();
  const classes = useStyles({ theme });

  function renderLegend(color, title) {
    return (
      <Row vertical="center">
        <div style={{ width: 16, border: "2px solid", borderColor: color }} />
        <span className={classes.legendTitle}>{title}</span>
      </Row>
    );
  }

  function renderStat(title, value) {
    return (
      <Column
        flexGrow={1}
        className={classes.statContainer}
        vertical="center"
        horizontal="center"
      >
        <span className={classes.statTitle}>{title}</span>
        <span className={classes.statValue}>{value}</span>
      </Column>
    );
  }

  return (
    <Row
      flexGrow={1}
      className={classes.container}
      horizontal="center"
      breakpoints={{ 1024: "column" }}
    >
      <Column
        wrap
        flexGrow={7}
        flexBasis="735px"
        className={classes.graphSection}
        breakpoints={{
          1024: { width: "calc(100% - 48px)", flexBasis: "auto" }
        }}
      >
        <Row wrap horizontal="space-between">
          <Column>
            <span className={classes.graphTitle}>Today’s trends</span>
            <span className={classes.graphSubtitle}>
              as of 25 May 2019, 09:41 PM
            </span>
          </Column>
          {renderLegend("black", "Today")}
        </Row>
        <div className={classes.graphContainer}>
          <LineChart
            data={data}
            viewBoxWidth={500}
            pointsStrokeColor="black"
            areaColor="green"
            areaVisible
          />
        </div>
      </Column>
      <Column
        className={classes.separator}
        breakpoints={{ 1024: { display: "none" } }}
      >
        <div />
      </Column>
      <Column
        flexGrow={3}
        flexBasis="342px"
        breakpoints={{ 1024: classes.stats }}
      >
        {renderStat("Resolved", "449")}
        {renderStat("Received", "426")}
        {renderStat("Average first response time", "33m")}
        {renderStat("Average response time", "3h 8m")}
        {renderStat("Resolution within SLA", "94%")}
      </Column>
    </Row>
  );
}

export default TodayTrendsComponent;
