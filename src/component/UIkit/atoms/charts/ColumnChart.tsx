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
      height: 500,
    },
  })
);

type Props = {
  width?: number;
  height?: number;
  data: any[];
  title: string;
  isStacked?: boolean;
};

const ColumnChart: FC<Props> = ({ width, height, data, title, isStacked = true }) => {
  const classes = useStyles();
  const AssignedNumberForLineKey = data[0]?.length - 3;
  return (
    <>
      <div className="module-spacer--small" />
      <div className={`${classes.root}`}>
        <Chart
          className={classes.chart}
          chartType="ComboChart"
          loader={<div>グラフを読込中です....しばらくお待ち下さい😊</div>}
          width={width}
          height={height}
          data={data}
          options={{
            title,
            titleTextStyle: {
              color: "#AC2EBF",
              fontSize: 25,
              bold: true,
            },
            chartArea: { width: "85%", left: "10%" },
            isStacked,
            bar: { groupWidth: "50%" },
            legend: { position: "bottom" },
            tooltip: { textStyle: { color: "#AC2EBF" }, showColorCode: false },
            seriesType: "bars",
            vAxis: {
              minValue: 0,
            },
            series: {
              [AssignedNumberForLineKey]: {
                type: "line",
              },
            },
          }}
        />
      </div>
    </>
  );
};

export default ColumnChart;
