import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC, useCallback, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../src/component/UIkit/atoms";
import { PrimaryModal, PrimaryText, StudiousLogoVertical } from "../src/component/UIkit/molecules/index";
import { passwordResetWithEmail } from "../src/Auth";
import { useRouter } from "next/router";

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
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const classes = useStyles();
  const router = useRouter();
  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm({ mode: "onSubmit", reValidateMode: "onBlur", defaultValues: { resetEmail: "" } });

  const onSubmit = (data: any) => {
    const email = data.resetEmail;
    passwordResetWithEmail(email, setTitle, setMessage, setIsOpen, router);
    reset();
  };

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return (
    <>
      <Head>
        <title>STUDIOUS パスワードリセット</title>
      </Head>
      <div className={classes.root}>
        <section className={`c-section-container ${classes.card}`}>
          <div className="module-spacer--medium" />
          <StudiousLogoVertical />
          <div className="module-spacer--very-small" />
          <h2 className="u-text-sub-headline">パスワードのリセット</h2>
          <div className="module-spacer--medium" />
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <div className="module-spacer--very-small" />
            <PrimaryText
              control={control}
              errors={errors}
              errorMessage="正しいメールアドレスを入力してください"
              rules={{
                pattern: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
              }}
              label="e-mail"
              name="resetEmail"
              placeholder="メールアドレス"
              type="email"
            />
            <div className="module-spacer--medium" />
            <div className="p-grid-columns">
              <PrimaryButton onClick={handleSubmit(onSubmit)} submit={true} color="primary" disabled={false}>
                メールを送信
              </PrimaryButton>
            </div>
          </form>
          <div className="module-spacer--small" />
          <Link href="/signin">
            <a className={classes.textButton}>ログインはこちら</a>
          </Link>

          <div className="module-spacer--very-small" />
          <Link href="/signup">
            <a className={classes.textButton}>新規登録はこちら</a>
          </Link>
          <div className="module-spacer--very-small" />
        </section>
      </div>
      <PrimaryModal isOpen={isOpen} title={title} toggleOpen={toggleOpen}>
        {message}
      </PrimaryModal>
    </>
  );
};

export default Reset;
