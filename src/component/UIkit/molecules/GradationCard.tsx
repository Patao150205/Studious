import { createStyles, makeStyles } from "@material-ui/styles";
import classNames from "classnames";
import React, { FC } from "react";

type Props = {
  title: string;
  children: React.ReactElement;
  width?: string | number;
  height?: string | number;
  className?: string;
};

const GradationCard: FC<Props> = ({ title, children, className }) => {
  const useStyles = makeStyles(
    createStyles({
      root: {
        color: "#444",
        background: "linear-gradient(to bottom, #FFF,#00ffcf 50%, #deb5f5)",
        boxShadow: "0, 10px 5px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: 10,
        fontSize: "1.3rem",
        padding: "0 10px",
        "& > h1": {
          textAlign: "center",
          fontSize: "1.9rem",
        },
        "& > p": {
          textAlign: "left",
        },
      },
    })
  );

  const classes = useStyles();
  return (
    <div className={classNames(classes.root, className)}>
      <div className="module-spacer--small" />
      <h1>{title}</h1>
      <div className="module-spacer--small" />
      <p>
        {children}
        ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章ダミー文章
      </p>
      <div className="module-spacer--small" />
    </div>
  );
};

export default GradationCard;
