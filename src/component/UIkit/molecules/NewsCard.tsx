import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC } from "react";

const useStyles = makeStyles(
  createStyles({
    cardContent: {
      padding: "0 16px 0 16px",
      fontFamily: "Hannotate SC, TsukuARdGothic-Regular,ヒラギノ丸ゴ Pro , HanziPen SC, Wawati SC, san-serif",
      lineHeight: "1.4rem",
    },
  })
);

const NewsCard: FC = () => {
  const classes = useStyles();
  return (
    <div>
      <Card>
        <CardHeader avatar={<FontAwesomeIcon icon={["far", "newspaper"]} />} title="ニュース" subheader="News" />
        <CardContent className={classes.cardContent}>
          Studiousリリース予定！!
          <br />
          いつ完成するかは、わかりません😅
          <br />
          只今、UIホームのページのUIを構築中です❗❗
          <br />
          <a href="https://twitter.com/Patao_program">製作者のTwiiter</a>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsCard;
