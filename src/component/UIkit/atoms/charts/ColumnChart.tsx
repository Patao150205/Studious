import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { FC } from "react";
import Chart from "react-google-charts";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "#cc18bd",
      width: "100%",
      minWidth: 320,
      maxWidth: "calc(100% - 2rem)",
      borderRadius: "10px",
      boxShadow: "0 10px 10px 5px rgba(0, 0, 0, 0.2)",
      padding: "0.5rem 0.5rem",
      [theme.breakpoints.up("sm")]: {
        maxWidth: 900,
      },
    },
    chart: {
      height: 400,
    },
  })
);

const ColumnChart: FC = () => {
  const classes = useStyles();
  return (
    <>
      <div className="module-spacer--small" />
      <div className={`${classes.root}`}>
        <Chart
          className={classes.chart}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["City", "2010 Population", "2000 Population"],
            ["New York City, NY", 8175000, 8008000],
            ["Los Angeles, CA", 3792000, 3694000],
            ["Chicago, IL", 2695000, 2896000],
            ["Houston, TX", 2099000, 1953000],
            ["Philadelphia, PA", 1526000, 1517000],
          ]}
          options={{
            title: "Population of Largest U.S. Cities",
            chartArea: { width: "50%" },
            isStacked: true,
            hAxis: {
              title: "Total Population",
              minValue: 0,
            },
            vAxis: {
              title: "City",
            },
          }}
          // For tests
          rootProps={{ "data-testid": "3" }}
        />
      </div>
    </>
  );
};

export default ColumnChart;
