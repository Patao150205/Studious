import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC, useCallback, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../src/component/UIkit/atoms";
import { PrimaryText } from "../src/component/UIkit/molecules/index";

const useStyles = makeStyles(
  createStyles({
    root: {
      backgroundImage: "url(img/books-1456513080510-7bf3a84b82f8.jpeg)",
      backgroundPosition: "center",
      height: "100vh",
      position: "relative",
    },
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      boxShadow: "0px 5px 5px 1px rgba(0, 0, 0, .2)",
      position: "absolute",
      left: "50%",
      transform: "translate(-50%, -50%)",
      top: "50%",
    },
    form: {
      margin: "0 auto",
      maxWidth: 400,
    },
    textButton: {
      color: "#444",
      "&:hover": {
        cursor: "pointer",
        textDecoration: "underline",
      },
      textDecoration: "none",
    },
    errorMessage: {
      color: "red",
    },
  })
);

const Reset: FC = () => {
  const classes = useStyles();
  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm({ mode: "onSubmit", reValidateMode: "onBlur", defaultValues: { username: "", freeField: "" } });

  const onSubmit = (data: any) => {
    reset();
  };

  return (
    <>
      <Head>
        <title>STUDIOUS プロフィール編集</title>
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
          <div className="module-spacer--very-small" />
          <h2 className="u-text-sub-headline">プロフィールの編集</h2>
          <div className="module-spacer--medium" />
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <div className="module-spacer--very-small" />
            <PrimaryText
              control={control}
              errors={errors}
              errorMessage="ユーザー名は１０文字以内で入力してください。"
              rules={{}}
              label="username"
              name="Username"
              placeholder="ユーザー名"
              type="text"
            />
            <div className="module-spacer--very-small" />
            <PrimaryText
              control={control}
              multiline={true}
              required={false}
              label="free field(blackboard)"
              name="freeField"
              placeholder="自由記入欄(黒板)"
              rows={5}
              type="text"
            />
            <div className="module-spacer--medium" />
            <div className="p-grid-columns">
              <PrimaryButton submit={true} onClick={() => {}} color="primary" disabled={false}>
                プロフィールを更新
              </PrimaryButton>
            </div>
          </form>
          <div className="module-spacer--small" />
          <Link href="/">
            <a className={classes.textButton}>プロフィールに戻る</a>
          </Link>
          <div className="module-spacer--small" />
        </section>
      </div>
    </>
  );
};

export default Reset;
