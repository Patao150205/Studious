import { makeStyles, Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";
import React from "react";
import { Chart } from "react-google-charts";

// type Props = {
//   data: *;
//   graphId: string;
//   height: string;
//   options: *;
//   width: string;
// };

// const PieChart = ({ data, graphId, height, options, width }: Props) => (
//   <div>
//     <Chart chartType="PieChart" data={data} graph_id={graphId} height={height} options={options} width={width} />
//   </div>
// );

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      minWidth: 320,
      maxWidth: "calc(100% - 2rem)",
      borderRadius: "10px",
      boxShadow: "0 10px 10px 5px rgba(0, 0, 0, 0.2)",
      background: "#cc18bd",
      padding: "0.5rem 0.5rem",
      [theme.breakpoints.up("sm")]: {
        maxWidth: 400,
      },
    },
  })
);

const PieChart = () => {
  const classes = useStyles();
  return (
    <>
      <div className="module-spacer--small" />
      <div className={`${classes.root}`}>
        <Chart
          className="center"
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Task", "Hours per Day"],
            ["Work", 11],
            ["Eat", 2],
            ["Commute", 2],
            ["Watch TV", 2],
            ["Sleep", 7],
          ]}
          options={{
            title: "My Daily Activities",
            // Just add this option
            is3D: true,
          }}
          rootProps={{ "data-testid": "2" }}
        />
      </div>
    </>
  );
};

export default PieChart;
