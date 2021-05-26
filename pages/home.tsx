import { makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC, useState } from "react";
import { createStyles, Theme } from "@material-ui/core";
import classNames from "classnames";
import { SecondaryButton } from "../src/component/UIkit/atoms";
import { useRouter } from "next/router";
import { Footer } from "../src/templates";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: "white",
    },
    imgWrapper: {
      background: "url('/img/books-1456513080510-7bf3a84b82f8.jpeg')",
      backgroundPositionY: "50%",
      backgroundPositionX: "center",
      "& > main": {
        minWidth: "calc(320px - 2rem)",
        margin: "0 auto",
        width: "100%",
        maxWidth: 1280,
        display: "flex",
      },
      [theme.breakpoints.down("md")]: {
        "& > main": {
          flexDirection: "column",
          alignItems: "center",
          justifyitems: "center",
          maxWidth: 565,
        },
      },
    },
    studiousWrapper: {
      margin: "0 auto",
      [theme.breakpoints.down("md")]: {
        width: 500,
      },
      [theme.breakpoints.down("xs")]: {
        width: 280,
      },
    },
    headingWrapper: {
      padding: "100px 0 0 5%",
      width: 600,
      "& > p": {
        fontSize: "1.5rem",
      },
      "& > h2": {
        fontSize: "1.8rem",
      },
      transform: "translate(-130%, 0)",
      transition: "all 0.2s",
      "&.visible": {
        transform: "translate(0, 0)",
      },
      [theme.breakpoints.down("md")]: {
        paddingLeft: 0,
        width: "100%",
        margin: "0 auto",
        textAlign: "center",
        "& > h2": {
          margin: "0 auto",
        },
      },
      [theme.breakpoints.down("xs")]: {
        width: 280,
        "& > p": {
          fontSize: "1.3rem",
        },
        "& > h2": {
          fontSize: "1.0rem",
        },
      },
    },
    studious: {
      display: "flex",
      fontSize: "5.3rem",
      color: "red",
      overflow: "hidden",
      "& > span": {
        transform: "translate(0, 100%)",
        transition: "transform cubic-bezier(0.215, 0.61, 0.355, 1) 0.5s",
      },
      "&.visible span": {
        transform: "translate(0, 0)",
      },

      "& > span:nth-child(2)": {
        transitionDelay: "0.06s",
      },
      "& > span:nth-child(3)": {
        transitionDelay: "0.12s",
      },
      "& > span:nth-child(4)": {
        transitionDelay: "0.18s",
      },
      "& > span:nth-child(5)": {
        transitionDelay: "0.24s",
      },
      "& > span:nth-child(6)": {
        transitionDelay: "0.30s",
      },
      "& > span:nth-child(7)": {
        transitionDelay: "0.36s",
      },
      "& > span:nth-child(8)": {
        transitionDelay: "0.42s",
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: "3.0rem",
      },
    },
    subTitle: {
      position: "relative",
      "& > span": {
        opacity: "0",
        transition: "opacity 0.8s",
      },
      "& > span::after": {
        content: "''",
        display: "block",
        position: "absolute",
        bottom: "-8px",
        left: 0,
        width: 0,
        height: 4,
        backgroundColor: "red",
        transition: "width 0.8s",
      },
      "&.visible span": {
        opacity: "1",
      },
      "&.visible span::after": {
        width: "100%",
      },
      [theme.breakpoints.down("md")]: {
        "&.visible span::after": {},
      },
    },
    btnWrapper: {
      textAlign: "center",
    },
    startBtn: {
      display: "inline-block",
      borderRadius: "30px",
      padding: "15px 40px 15px 40px",
      fontSize: "2.5rem",
      margin: "0 auto",
      fontWeight: 800,
      [theme.breakpoints.down("xs")]: {
        fontSize: "1.0rem",
      },
    },
    macImg: {
      display: "block",
      marginTop: "-50px",
      maxWidth: 650,
      transform: "translate(100vw,0)",
      transition: "all 0.2s",
      "&.visible": {
        transform: "translate(0, 0)",
      },
      [theme.breakpoints.down("md")]: {
        margin: 0,
      },
      [theme.breakpoints.down("xs")]: {
        maxWidth: 300,
      },
    },
    introduce: {
      margin: "0 auto",
      width: "calc(100% - 2rem)",
      maxWidth: 1200,
      textAlign: "center",
      fontSize: "1.8rem",
      lineHeight: "3.0rem",
      "& > h2": {
        fontSize: "2.5rem",
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: "1.0rem",
        lineHeight: "2.0rem",
        "& > h2": {
          fontSize: "1.8rem",
        },
      },
    },
    cardWrapper: {
      display: "flex",
      justifyContent: "space-evenly",
      [theme.breakpoints.down("md")]: {
        maxWidth: "70%",
        minWidth: "calc(320px - 2rem)",
        margin: "0 auto",
        flexDirection: "column",
      },
    },
  })
);

const Home: FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const [titleIsVisible, setTititleIsVisible] = useState(false);

  setTimeout(() => {
    setTititleIsVisible(true);
  }, 500);

  return (
    <>
      <Head>
        <title>Studious ホーム</title>
      </Head>
      <div className={`${classes.root} c-section-wrapping--main`}>
        <div className={classes.imgWrapper}>
          <main>
            <div className={classNames(classes.headingWrapper, { visible: titleIsVisible })}>
              <p>学習管理アプリ</p>
              <div className="module-spacer--very-small" />
              <div className={classes.studiousWrapper}>
                <h1 className={classNames(classes.studious, { visible: titleIsVisible })}>
                  <span>S</span>
                  <span>T</span>
                  <span>U</span>
                  <span>D</span>
                  <span>I</span>
                  <span>O</span>
                  <span>U</span>
                  <span>S</span>
                </h1>
              </div>
              <div className="module-spacer--medium" />
              <h2 className={classNames(classes.subTitle, { visible: titleIsVisible })}>
                <span>一人で戦っているあなたへ</span>
              </h2>
              <div className="module-spacer--medium" />
              <h2 className={classNames(classes.subTitle, { visible: titleIsVisible })}>
                <span>モチベーションが続かないあなたへ</span>
              </h2>
              <div className="module-spacer--medium" />
              <div className="module-spacer--small" />
              <div className={classes.btnWrapper}>
                <SecondaryButton
                  onClick={() => {
                    router.push("/signin");
                  }}
                  className={classes.startBtn}
                  disabled={false}
                  fColor={"white"}
                  bgColor={"#7be0ad"}>
                  ログインページへ
                </SecondaryButton>
              </div>
            </div>
            <img
              className={classNames(classes.macImg, { visible: titleIsVisible })}
              src="/stats-bro.svg"
              alt="Studiousイメージ図"
            />
          </main>
        </div>
        <section className={classes.introduce}>
          <div className="module-spacer--medium" />
          <h2>Studiousとは？</h2>
          <div className="module-spacer--medium" />
          <p>独学で勉強している方のモチベーションを高めるもしくは、継続することを目的にした学習管理アプリです！</p>
          <br />
          <p>
            一人で勉強していて、やる気が出ないという方、自分の頑張りを記録として残していくことで、確実に少しずつ成長しているという実感を得てくださいね。
          </p>
          <div className="module-spacer--medium" />
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Home;
