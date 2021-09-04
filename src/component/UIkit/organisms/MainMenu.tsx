import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createStyles, makeStyles } from "@material-ui/core";
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
      <MenuList handleToggle={handleToggle ?? (() => { })} />
      <div className={classes.root}>
        <PrimaryCard avatar={<FontAwesomeIcon icon={["far", "newspaper"]} />} title="ニュース" subTitle="News">
          <strong>バージョン2.0.0リリース❗️</strong>
          <br />
          <br />
          <p>余計な機能を削ぎ落とし、</p>
          <p>シンプルにしました。</p>
          <br />
          <p>↓メインのアップデート</p>
          <p><span style={{color: 'red'}}>今週以前の分析</span>が可能になりました！</p>
          <a href="https://twitter.com/Patao_program">製作者のTwiiter</a>
        </PrimaryCard>
      </div>
    </div>
  );
};

export default MainMenu;
