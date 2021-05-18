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
  handleToggle?: () => void;
};

const MainMenu: FC<Props> = ({ forwardRef, handleToggle }) => {
  const classes = useStyles();

  return (
    <div ref={forwardRef}>
      <MenuList handleToggle={handleToggle ?? (() => {})} />
      <div className={classes.root}>
        <PrimaryCard avatar={<FontAwesomeIcon icon={["far", "newspaper"]} />} title="ニュース" subTitle="News">
          開発中💻
          <br />
          いつ完成するかは、わかりません😅
          <br />
          只今、学習記録に登録して頂いたデータを元に、学習状況を割り出して、わかりやすく表示することを試みています。
          <br />
          投稿閲覧ページの、ページネーションにバグを見つけてしまいました。後ほど修正します。
          <br />
          <a href="https://twitter.com/Patao_program">製作者のTwiiter</a>
        </PrimaryCard>
      </div>
    </div>
  );
};

export default MainMenu;
