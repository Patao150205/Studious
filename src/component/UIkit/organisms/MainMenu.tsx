import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { FC } from "react";
import { PrimaryCard } from "../atoms";
import { MenuList } from "../molecules";

const useStyles = makeStyles(
  createStyles({
    root: {
      fontFamily: "Hannotate SC, TsukuARdGothic-Regular,ヒラギノ丸ゴ Pro , HanziPen SC, Wawati SC, san-serif",
      lineHeight: "1.4rem",
    },
  })
);

type Props = {
  forwardRef?: React.Ref<any>;
};

const MainMenu: FC<Props> = ({ forwardRef }) => {
  const classes = useStyles();

  return (
    <div ref={forwardRef}>
      <MenuList />
      <div className={classes.root}>
        <PrimaryCard avatar={<FontAwesomeIcon icon={["far", "newspaper"]} />} title="ニュース" subTitle="News">
          Studiousリリース予定！!
          <br />
          いつ完成するかは、わかりません😅
          <br />
          只今、UIホームのページのUIを構築中です❗❗
          <br />
          <a href="https://twitter.com/Patao_program">製作者のTwiiter</a>
        </PrimaryCard>
      </div>
    </div>
  );
};

export default MainMenu;
