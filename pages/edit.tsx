import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../src/component/UIkit/atoms";
import { EditProfileImg, PrimaryText, StudiousLogoVertical } from "../src/component/UIkit/molecules/index";
import { Theme } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../src/features/hooks";
import { PartialUserInfo, updateMyInfo, userMyInfoSelector } from "../src/features/usersSlice";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundImage: "url(/img/books-1456513080510-7bf3a84b82f8.jpeg)",
      backgroundPosition: "center",
      minHeight: "100vh",
      padding: "50px 0",
      height: "auto",
    },
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      boxShadow: "0px 5px 5px 1px rgba(0, 0, 0, .2)",
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

export type UplodedImg = {
  id: string;
  path: any;
};

const Reset: FC = () => {
  const classes = useStyles();
  const selector = useAppSelector(userMyInfoSelector);
  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      username: selector.username,
      introduce: selector.introduce_myself,
      TwitterURL: selector.sns_path.twitter,
      GitHubURL: selector.sns_path.GitHub,
      target: selector.target,
    },
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [uploadedImg, setUploadedImg] = useState<UplodedImg>({ id: "", path: null });

  const onSubmit = useCallback(
    (data: any) => {
      const newData: PartialUserInfo = {
        uid: selector.uid,
        photoURL: uploadedImg.path ? uploadedImg.path : selector.photoURL,
        introduce_myself: data.introduce ?? "",
        sns_path: { twitter: data.TwitterURL ?? "", GitHub: data.GitHubURL ?? "" },
        target: data.target ?? "",
        username: data.username,
      };
      dispatch(updateMyInfo(newData)).then(() => {
        router.push("/");
      });
    },
    [selector, uploadedImg]
  );

  useEffect(() => {
    setValue("username", selector.username);
    setValue("introduce", selector.introduce_myself);
    setValue("TwitterURL", selector.sns_path.twitter);
    setValue("GitHubURL", selector.sns_path.GitHub);
    setValue("target", selector.target);
  }, [selector]);

  return (
    <>
      <Head>
        <title>STUDIOUS プロフィール編集</title>
      </Head>
      <div className={classes.root}>
        <section className={`c-section-container ${classes.card}`}>
          <div className="module-spacer--medium" />
          <StudiousLogoVertical />
          <div className="module-spacer--very-small" />
          <h2 className="u-text-sub-headline">プロフィールの編集</h2>
          <div className="module-spacer--medium" />
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <EditProfileImg photoURL={selector.photoURL} uploadedImg={uploadedImg} setUploadedImg={setUploadedImg} />
            <div className="module-spacer--small" />
            <PrimaryText
              control={control}
              errors={errors}
              errorMessage="ユーザー名は、５０文字以下で入力してください。"
              required={true}
              rules={{
                maxLength: 50,
              }}
              label="username"
              name="username"
              placeholder="ユーザー名"
              type="text"
            />
            <div className="module-spacer--very-small" />
            <PrimaryText
              control={control}
              multiline={true}
              required={false}
              label="free field(blackboard)"
              name="introduce"
              placeholder="自由記入欄(黒板)"
              rows={3}
              type="text"
            />
            <div className="module-spacer--very-small" />
            <PrimaryText
              control={control}
              errors={errors}
              errorMessage="TwitterのプロフィールページのURLを正しく入力してください。"
              multiline={false}
              required={false}
              rules={{
                pattern: /^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/,
              }}
              label="Twitter URL"
              name="TwitterURL"
              placeholder="Twitter"
              rows={1}
              type="text"
            />
            <div className="module-spacer--very-small" />
            <PrimaryText
              control={control}
              errors={errors}
              errorMessage="GitHubのURLを正しく入力してください。"
              multiline={false}
              required={false}
              rules={{
                pattern: /^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/,
              }}
              label="GitHub URL"
              name="GitHubURL"
              placeholder="GitHub"
              rows={1}
              type="text"
            />
            <div className="module-spacer--very-small" />
            <PrimaryText
              control={control}
              multiline={true}
              required={false}
              label="target"
              name="target"
              placeholder="目標"
              rows={3}
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
