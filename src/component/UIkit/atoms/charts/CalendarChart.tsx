import { createStyles } from "@material-ui/styles";
import React, { FC } from "react";
import Chart from "react-google-charts";
import { Avatar, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: "10px",
      boxShadow: "0 10px 10px 5px rgba(0, 0, 0, 0.2)",
      maxWidth: "calc(100% - 2rem)",
      margin: "0 auto",
      backgroundColor: theme.palette.primary.main,
      overflow: "scroll",
      color: "#000",
      padding: "10px 0",
      [theme.breakpoints.up("sm")]: {
        maxWidth: 1000,
        width: "calc(100% - 2rem)",
      },
    },
    chart: {},
  })
);

const CalendarChart: FC = () => {
  const classes = useStyles();

  return (
    <>
      <div className="module-spacer--small" />
      <div className={classes.root}>
        <Chart
          width={950}
          className={classes.chart}
          height={200}
          chartType="Calendar"
          loader={<div>Loading Chart</div>}
          data={[
            [
              { type: "date", id: "Date" },
              { type: "number", id: "Won/Loss" },
            ],
            [new Date(2021, 2, 10), 1],
            [new Date(2021, 4, 10), 3],
            [new Date(2021, 1, 10), 4],
            [new Date(2021, 11, 10), 2],
          ]}
          options={{
            title: "Learning Calendar",
          }}
          rootProps={{ "data-testid": "1" }}
        />
      </div>
    </>
  );
};

export default CalendarChart;
