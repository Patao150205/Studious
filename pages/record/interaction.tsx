import { Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noPostRoot: {
      position: "absolute",
      transform: "translate(-50%, -50%)",
      top: "50%",
      left: "50%",
    },
  })
);

const interaction = () => {
  const classes = useStyles();
  return (
    <div className={`${classes.noPostRoot} c-section-container`}>
      <h1>この機能は使用することができません。今後のアップデートで実装予定です！</h1>
      <div className="module-spacer--medium" />
      <Link href="/record/edit">
        <a>投稿作成ページへ</a>
      </Link>
    </div>
  );
};

export default interaction;
