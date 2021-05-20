import { makeStyles, Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";
import React, { FC } from "react";
import { Chart } from "react-google-charts";

type Props = {
  title: string;
  data: any;
  height?: string;
  width?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      minWidth: 320,
      height: 420,
      maxWidth: "calc(100% - 2rem)",
      borderRadius: "10px",
      boxShadow: "0 10px 10px 5px rgba(0, 0, 0, 0.2)",
      background: "#cc18bd",
      padding: "0.5rem 0.5rem",
      [theme.breakpoints.up("sm")]: {
        maxWidth: 800,
      },
    },
  })
);

const PieChart: FC<Props> = ({ title, data, height = 400 }) => {
  const classes = useStyles();
  return (
    <>
      <div className="module-spacer--small" />
      <div className={`${classes.root}`}>
        <Chart
          className="center"
          chartType="PieChart"
          loader={<div>グラフを読込中です....しばらくお待ち下さい😊</div>}
          data={data}
          height={height}
          options={{
            title,
            titleTextStyle: {
              color: "#AC2EBF",
              fontSize: 25,
              bold: true,
            },
            is3D: true,
            legend: { position: "right", maxLines: 3 },
            chartArea: { width: "90%", top: 100 },
            forcelFrame: true,
            tooltip: { textStyle: { color: "#AC2EBF" }, showColorCode: false },
          }}
        />
      </div>
    </>
  );
};

export default PieChart;
