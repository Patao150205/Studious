import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC, useCallback, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../src/component/UIkit/atoms";
import { PrimaryModal, PrimaryText, StudiousLogoVertical } from "../src/component/UIkit/molecules/index";
import { signUpWithEmailPassword } from "../src/Auth";
import { useAppDispatch } from "../src/features/hooks";
import { useRouter } from "next/router";

const useStyles = makeStyles(
  createStyles({
    root: {
      backgroundImage: "url(/img/books-1456513080510-7bf3a84b82f8.jpeg)",
      backgroundPosition: "center",
      minHeight: "100vh",
      padding: "50px 0",
      height: "auto",
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
  })
);

type FormData = {
  registerConfirmPassword: string;
  registerEmail: string;
  registerPassword: string;
  registerUsername: string;
};

const Register: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      registerUsername: "",
      registerEmail: "",
      registerPassword: "",
      registerConfirmPassword: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const password: string = data.registerPassword;
    const confirmPassword: string = data.registerConfirmPassword;
    const email: string = data.registerEmail;

    if (password !== confirmPassword) {
      setTitle("パスワードエラー");
      setMessage("パスワードとパスワード(再確認)が一致しません。もう一度お試しください。");
      toggleOpen();
      return;
    }
    signUpWithEmailPassword(email, dispatch, password, setTitle, setMessage, toggleOpen, router);
  };

  return (
    <>
      <Head>
        <title>STUDIOUS 新規登録</title>
      </Head>
      <div className={classes.root}>
        <section className={`c-section-container ${classes.card}`}>
          <div className="module-spacer--medium" />
          <StudiousLogoVertical />
          <div className="module-spacer--very-small" />
          <h2 className="u-text-sub-headline">新規登録</h2>
          <div className="module-spacer--medium" />
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <PrimaryText
              control={control}
              errors={errors}
              label="username"
              name="registerUsername"
              placeholder="ユーザー名"
              rules={{}}
              type="text"
            />
            <div className="module-spacer--very-small" />
            <PrimaryText
              control={control}
              errors={errors}
              errorMessage="正しいメールアドレスを入力してください"
              rules={{
                pattern: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
              }}
              label="e-mail"
              name="registerEmail"
              placeholder="メールアドレス"
              type="email"
            />
            <div className="module-spacer--very-small" />
            <PrimaryText
              control={control}
              errors={errors}
              errorMessage="パスワードは半角英数字で入力してください"
              rules={{
                pattern: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
              }}
              label="password"
              name="registerPassword"
              placeholder="パスワード"
              type="password"
            />
            <div className="module-spacer--very-small" />
            <PrimaryText
              control={control}
              errors={errors}
              errorMessage="パスワードは半角英数字で入力してください"
              rules={{
                pattern: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
              }}
              label="password(reconfirmation)"
              name="registerConfirmPassword"
              placeholder="パスワード(再確認)"
              type="password"
            />
            <div className="module-spacer--medium" />
            <div className="p-grid-columns">
              <PrimaryButton submit={true} color="primary" disabled={false}>
                新規登録
              </PrimaryButton>
            </div>
            <div className="module-spacer--medium" />
          </form>
          <Link href="/signin">
            <a className={classes.textButton}>ログインはこちら</a>
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
