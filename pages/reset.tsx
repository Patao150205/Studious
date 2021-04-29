import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC } from "react";
import { PrimaryButton, SecondaryButton, TextInput } from "../src/components/UIkit";
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles(
  createStyles({
    root: {
      position: "relative",
      backgroundImage: "url(img/books-1456513080510-7bf3a84b82f8.jpeg)",
      backgroundPosition: "center",
      height: "100vh",
    },
    card: {
      minWidth: "calc(320px - 2rem)",
      width: "100%",
      boxShadow: "0px 5px 5px 1px rgba(0, 0, 0, .2)",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    form: {
      margin: "0 auto",
      maxWidth: 400,
    },
    textButton: {
      "&:hover": {
        textDecoration: "underline",
        cursor: "pointer",
      },
    },
  })
);

const Login: FC = () => {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>STUDIOUS パスワードリセット</title>
      </Head>
      <div className={classes.root}>
        <section className={`c-section-container ${classes.card}`}>
          <div className="module-spacer--medium" />
          <img
            src="/studious-logo.jpg"
            alt="/studious-logo"
            className="u-logo-img--general"
            width="40px"
            height="40px"
          />
          <h1 className="u-text-headline">STUDIOUS</h1>
          <h2 className="u-text-sub-headline">パスワードのリセット</h2>
          <div className="module-spacer--medium" />
          <form className={classes.form}>
            <div className="module-spacer--very-small" />
            <TextInput
              label="password"
              fullWidth={true}
              multiline={false}
              onChange={() => {}}
              placeholder="メールアドレス"
              required={true}
              rows={1}
              type="text"
              value=""
            />
            <div className="module-spacer--medium" />
            <div className="p-grid-columns">
              <PrimaryButton color="primary" disabled={false} onClick={() => {}}>
                メールを送信
              </PrimaryButton>
            </div>
          </form>
          <div className="module-spacer--small" />
          <p className={classes.textButton} onClick={() => {}}>
            ログインはこちら
          </p>
          <div className="module-spacer--very-small" />
          <p className={classes.textButton} onClick={() => {}}>
            新規登録はこちら
          </p>
          <div className="module-spacer--very-small" />
        </section>
      </div>
    </>
  );
};

export default Login;
