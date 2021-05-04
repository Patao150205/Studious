import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC, useCallback, useState } from "react";
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { PrimaryButton, SecondaryButton } from "../src/component/UIkit/atoms";
import { PrimaryModal, TextValidation } from "../src/component/UIkit/molecules";
import { signInWithEmailPassword, SignInWithGitHub, SignInWithTwitter } from "../src/Auth";
import { useAppDispatch } from "../src/features/hooks";
import { useRouter } from "next/router";

const useStyles = makeStyles(
  createStyles({
    root: {
      position: "relative",
      backgroundImage: "url(img/books-1456513080510-7bf3a84b82f8.jpeg)",
      backgroundPosition: "center",
      height: "100vh",
    },
    card: {
      boxShadow: "0px 5px 5px 1px rgba(0, 0, 0, .2)",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    form: {
      margin: "0 auto",
      maxWidth: 400,
    },
    textButton: {
      textDecoration: "none",
      color: "#444",
      "&:hover": {
        textDecoration: "underline",
        cursor: "pointer",
      },
    },
    errorMessage: {
      color: "red",
    },
  })
);

const Register: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: { signinEmail: "", signinPassword: "" },
  });

  const onSubmit = useCallback(async (data) => {
    const email: string = data.signinEmail;
    const password: string = data.signinPassword;
    await signInWithEmailPassword(email, dispatch, password, setTitle, setMessage, toggleOpen);
    router.push("/");
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <>
      <Head>
        <title>STUDIOUS ログイン</title>
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
          <h2 className="u-text-sub-headline">ログイン</h2>
          <div className="module-spacer--medium" />
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <TextValidation
              control={control}
              errors={errors}
              errorMessage="正しいメールアドレスを入力してください"
              rules={{
                pattern: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
              }}
              label="e-mail"
              name="signinEmail"
              placeholder="メールアドレス"
              type="email"
            />
            <div className="module-spacer--very-small" />
            <TextValidation
              control={control}
              errors={errors}
              errorMessage="パスワードは半角英数字で入力してください"
              rules={{
                pattern: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
              }}
              label="password"
              name="signinPassword"
              placeholder="パスワード"
              type="password"
            />
            <div className="module-spacer--medium" />
            <div className="p-grid-columns">
              <PrimaryButton submit={true} color="primary" disabled={false}>
                ログインする
              </PrimaryButton>
              <div className="module-spacer--small" />
              <SecondaryButton
                startIcon={<TwitterIcon />}
                disabled={false}
                onClick={async () => {
                  await SignInWithTwitter(setTitle, setMessage, toggleOpen, dispatch);
                  router.push("/");
                }}
                bgColor="#2a80e3"
                fColor="#fff">
                Twitterでログイン
              </SecondaryButton>
              <div className="module-spacer--very-small" />
              <SecondaryButton
                startIcon={<GitHubIcon />}
                disabled={false}
                onClick={async () => {
                  await SignInWithGitHub(dispatch, setTitle, setMessage, toggleOpen);
                  router.push("/");
                }}
                bgColor="#000"
                fColor="#fff">
                GitHubでログイン
              </SecondaryButton>
            </div>
            <div className="module-spacer--medium" />
          </form>
          <Link href="/signup">
            <a className={classes.textButton}>新規登録はこちら</a>
          </Link>
          <div className="module-spacer--very-small" />
          <Link href="/reset">
            <a className={classes.textButton}>パスワードを忘れた方はこちら</a>
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

export default Register;
