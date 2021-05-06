import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { FC, ReactNode } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: "calc(320px - 2rem)",
      maxWidth: 400,
      width: "100%",
      height: 275,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundImage: "url(/img/goalBoard.jpeg)",
      position: "relative",
      [theme.breakpoints.down("xs")]: {
        width: "calc(320px - 2rem)",
        height: 200,
      },
      "@media (max-width: 750px)": {
        order: -1,
      },
    },
    container: {
      wordBreak: "break-word",
      overflowY: "scroll",
      width: "80%",
      height: "70%",
      position: "absolute",
      top: "20%",
      left: "10%",
    },
    content: {
      margin: "0 auto",
      width: "100%",
      lineHeight: "2.0rem",
      fontSize: "2vw",
      overflowY: "scroll",
      "& > h1": {
        color: "red",
        fontSize: 30,
        textAlign: "center",
      },
      "& > p": {
        fontFamily: "Hannotate SC, TsukuARdGothic-Regular,ヒラギノ丸ゴ Pro , HanziPen SC, Wawati SC, san-serif",
        fontSize: 15,
      },
      [theme.breakpoints.down("xs")]: {
        "& > h1": {
          fontSize: 20,
        },
        "& > p": {
          fontSize: 14,
        },
      },
    },
  })
);

type Props = { content: ReactNode };

const GoalBoard: FC<Props> = ({ content }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.content}>{content}</div>
      </div>
    </div>
  );
};

export default GoalBoard;
