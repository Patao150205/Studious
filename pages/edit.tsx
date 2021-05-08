import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../src/component/UIkit/atoms";
import { PrimaryText, StudiousLogoVertical } from "../src/component/UIkit/molecules/index";
import { Avatar, Badge, Theme } from "@material-ui/core";
import { useAppDispatch } from "../src/features/hooks";
import { PartialUserInfo, updateMyInfo, userMyInfoSelector } from "../src/features/usersSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { storage } from "../firebase/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundImage: "url(img/books-1456513080510-7bf3a84b82f8.jpeg)",
      backgroundPosition: "center",
      height: "140vh",
      overflowY: "scroll",
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
    filebtn: {
      display: "none",
      "& > label": {
        position: "relative",
      },
    },
    editIcon: {
      position: "absolute",
      background: theme.palette.primary.light,
      borderRadius: "50%",
      width: 50,
      height: 50,
      top: 130,
      right: 30,
      fontSize: 30,
      cursor: "pointer",
    },
    profileLogo: {
      margin: "0 auto",
      width: 150,
      height: 150,
      objectFit: "cover",
      objectPosition: "center",
      cursor: "pointer",
      "&:hover": {
        opacity: "0.8",
      },
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

type UplodedImg = {
  id: string;
  path: any;
};

const Reset: FC = () => {
  const classes = useStyles();
  const selector = useSelector(userMyInfoSelector);

  const [uploadedImg, setUploadedImg] = useState<UplodedImg>({ id: "", path: null });

  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
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

  const onSubmit = (data: any) => {
    console.log(uploadedImg.path);
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
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    // ランダムな１６桁の文字列の生成
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const filename =
      file?.name +
      Array.from(crypto.getRandomValues(new Uint8Array(N)))
        .map((n) => S[n % S.length])
        .join("");
    const uploadRef = storage.ref("usersIcon").child(filename);
    const uploadedTask = uploadRef.put(file as File);
    uploadedTask
      .then(() => {
        uploadedTask.snapshot.ref.getDownloadURL().then((DownloadURL) => {
          const uploadedFile = { id: filename, path: DownloadURL };
          setUploadedImg(uploadedFile);
        });
      })
      .catch((e) => {
        alert(`ファイルの読み込みに失敗しました。\n ${e.message}`);
      });
  };

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
            <label>
              <input
                className={classes.filebtn}
                type="file"
                onChange={(e) => {
                  uploadImage(e);
                }}
              />
              <Badge classes={{ badge: classes.editIcon }} badgeContent={<FontAwesomeIcon icon={["fas", "marker"]} />}>
                <Avatar
                  src={uploadedImg.path || selector.photoURL || "/img/noUserImage.jpg"}
                  alt="プロフィール画像"
                  className={classes.profileLogo}
                />
              </Badge>
            </label>
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
