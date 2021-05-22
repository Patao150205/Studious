import { Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import React, { FC } from "react";

//使っていません

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      padding: "20px 0px",
      color: "#444",
      backgroundColor: theme.palette.primary.dark,
      "& > h1": {
        fontSize: "2.5rem",
      },
    },
  })
);

type Props = {
  title: string;
};

const TopicHeader: FC<Props> = ({ title }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h1>{title}</h1>
    </div>
  );
};

export default TopicHeader;
