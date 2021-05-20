import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { FC, ReactNode } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: "calc(320px - 2rem)",
      maxWidth: 500,
      width: "100%",
      height: 275,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundImage: "url(/img/blackboard.png)",
      color: "white",
      position: "relative",
      [theme.breakpoints.down("xs")]: {
        width: 320,
        height: 180,
      },
    },
    container: {
      wordBreak: "break-word",
      overflowY: "scroll",
      width: "80%",
      height: "70%",
      position: "absolute",
      top: "10%",
      left: "10%",
    },
    content: {
      width: "100%",
      lineHeight: "1.8rem",
      fontSize: 14,
      "& > p": {
        fontFamily: "Hannotate SC, TsukuARdGothic-Regular , HanziPen SC, Wawati SC, ヒラギノ丸ゴ Pro, san-serif",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: 16,
      },
    },
  })
);

type Props = { content: ReactNode };

const Blackboard: FC<Props> = ({ content }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.content}>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Blackboard;
