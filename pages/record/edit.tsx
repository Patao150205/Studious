import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ImgModal, InputTime, PrimaryText, StudiousLogoVertical } from "../../src/component/UIkit/molecules";
import { NumSelector, PrimaryButton, PrimaryCard } from "../../src/component/UIkit/atoms";
import { useAppDispatch } from "../../src/features/hooks";
import { updateMyRecord, userRecordSelector } from "../../src/features/usersSlice";
import { Divider, List, ListItem } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth, db, FirebaseTimestamp, storage } from "../../firebase/firebaseConfig";
import { UplodedImg } from "../edit";
import { processedTime } from "../../src/component/UIkit/molecules/InputTime";
import UploadPictureButton from "../../src/component/UIkit/atoms/UploadPictureButton";

const useStyles = makeStyles((theme: any) =>
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
    target: {
      color: "red",
    },
    list: {
      paddingTop: 0,
    },
    listItem: {
      marginTop: 15,
      background: theme.palette.primary[100],
      display: "flex",
      flexFlow: "column",
    },
    listItemTitle: {
      color: "red",
      textAlign: "center",
    },
    icons: {
      margin: "0 10px",
      fontSize: 20,
      "&:hover": {
        color: theme.palette.primary[500],
        cursor: "pointer",
        opacity: "0.8",
      },
    },
    pencil: {
      marginRight: 15,
    },
    link: {
      color: "#444",
      textDecoration: "none",
    },
    thumb: {},
  })
);

type Registration =
  | {
      learningContent: string;
      hours: number;
      minutes: number;
      convertedToMinutes: number;
    }[]
  | [];

type FormContents = {
  comment?: string;
  convertedToMinutes: number;
  doneDate?: string;
  hours: number;
  learningContent: string;
  minutes: number;
  index?: number;
};

const Reset: FC = () => {
  const classes = useStyles();

  const [target, setTarget] = useState<string | null>(null);
  const [registration, setRegistration] = useState<Registration>([]);
  const [sumedTime, setSumedTime] = useState<number>(0);
  const [uploadedImg, setUploadedImg] = useState<UplodedImg[] | null>([]);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [showedImg, setShowedImg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<number>(0);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      learningContent: "",
      comment: "",
      hours: 0,
      minutes: 0,
      doneDate: processedTime,
    },
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onRegister = useCallback(
    (formContent: FormContents) => {
      if (!formContent.learningContent) {
        alert("学習内容を入力してください。");
        return;
      } else if (!(formContent.hours || formContent.minutes)) {
        //hoursとminutesがともに0であった場合にエラー
        alert("時間が０分なので、追加することができません。");
        return;
      }
      //編集の対象が存在し、かつ学習内容一覧がnullでない場合
      if (target && registration) {
        const convertedToMinutes = formContent.hours * 60 + formContent.minutes;
        const data = {
          convertedToMinutes,
          hours: formContent.hours,
          minutes: formContent.minutes,
          learningContent: formContent.learningContent,
        };
        console.log(data);
        registration.find((ele, index) => {
          if (ele.learningContent === target) {
            registration[index] = data;
            return true;
          }
        });
        console.log(registration);
        setTarget(null);
        return;
      }
      const convertedToMinutes = formContent.hours * 60 + formContent.minutes;
      const data = {
        learningContent: formContent.learningContent,
        hours: formContent.hours,
        minutes: formContent.minutes,
        convertedToMinutes,
      };
      setRegistration((prev: any) => [...prev, data]);
      setSumedTime((prev: number) => prev + convertedToMinutes);
      reset();
    },
    [registration, setRegistration, target, setTarget]
  );

  const onSubmit = useCallback(
    (data: FormContents) => {
      if (sumedTime >= 1440) {
        alert("一日２４時間以上勉強しています！！正しく入力してください。");
        return;
      }

      const sendData = {
        created_at: FirebaseTimestamp.now(),
        comment: data.comment,
        doneDate: data.doneDate,
        learning_content: registration,
        sumedTime: sumedTime,
        images: uploadedImg,
        updated_at: FirebaseTimestamp.now(),
        uid: auth.currentUser?.uid,
        username: auth.currentUser?.displayName,
      };
      console.log(sendData);

      dispatch(updateMyRecord(sendData)).then(() => {
        router.push("/record");
      });
      setIsSubmit(true);
    },
    [sumedTime, registration, uploadedImg]
  );

  const editLearnedEle = useCallback(
    (learningContent: string) => {
      const newTarget = registration?.find((ele) => {
        return ele.learningContent === learningContent;
      });
      if (newTarget) {
        setTarget(learningContent);
        setValue("learningContent", newTarget.learningContent, { shouldValidate: true });
        setValue("hours", newTarget.hours);
        setValue("minutes", newTarget.minutes);
      }
    },
    [registration, setTarget, target]
  );

  const deleteLearnedEle = useCallback(
    (learningContent: string) => {
      if (target === learningContent) {
        setTarget(null);
        setValue("learningContent", "", { shouldValidate: true });
        setValue("hours", 0);
        setValue("minutes", 0);
      }
      const newList = registration.filter((ele) => {
        if (ele.learningContent === learningContent) {
          setSumedTime((prev) => prev - ele.convertedToMinutes);
        }
        return ele.learningContent !== learningContent;
      });
      setRegistration(newList);
    },
    [registration, target]
  );

  const showImg = useCallback((path: string) => {
    setShowedImg(path);
    setIsOpen(true);
  }, []);

  const postImgRef = storage.ref("postImg");
  // useEffect(() => {
  //   return () => {
  //     console.log(isSubmit);
  //     console.log(uploadedImg);
  //     isSubmit ||
  //       uploadedImg?.forEach((ele) => {
  //         postImgRef.child(ele.id).delete();
  //       });
  //     console.log("ごララマちょお");
  //   };
  // }, [isSubmit, uploadedImg]);

  console.log(uploadedImg);
  return (
    <>
      <Head>
        <title>STUDIOUS 学習記録の作成</title>
      </Head>
      <div className={classes.root}>
        <section className={`c-section-container ${classes.card}`}>
          <div className="module-spacer--medium" />
          <StudiousLogoVertical />
          <div className="module-spacer--very-small" />
          <h2 className="u-text-sub-headline">学習記録の作成</h2>
          <div className="module-spacer--medium" />
          <form className={classes.form} onSubmit={handleSubmit(onRegister)}>
            {target && <p className={classes.target}>{`${target} を編集中`}</p>}
            <div className="module-spacer--small" />
            <PrimaryText
              control={control}
              errors={errors}
              errorMessage="学習内容は、５０文字以下で入力してください。"
              required={false}
              rules={{
                maxLength: 50,
              }}
              label="learningContent"
              name="learningContent"
              placeholder="学習内容"
              type="text"
            />
            <div className="module-spacer--small" />
            <div className="p-grid-rows--evenly">
              <label>
                <NumSelector control={control} name="hours" label={"時間(h)"} count={24} />
                <p>時間(h)</p>
              </label>
              <label>
                <NumSelector control={control} name="minutes" label={"分(m)"} count={60} />
                <p>分(m)</p>
              </label>
            </div>
            <div className="module-spacer--small" />
            <PrimaryButton submit={true} onClick={() => {}} color="primary" disabled={false}>
              学習内容を追加
            </PrimaryButton>
          </form>
          <div className="module-spacer--small" />
          <div className={`${classes.form}`}>
            <PrimaryCard title="学習内容一覧" subTitle="learning list">
              <List className={classes.list}>
                {registration.map((ele: FormContents) => {
                  return (
                    <ListItem key={ele.learningContent} className={classes.listItem}>
                      <p className={classes.listItemTitle}>{ele.learningContent}</p>
                      <div className="module-spacer--very-small" />
                      <p>{`${ele.hours} h ${ele.minutes} m`}</p>
                      <div className="module-spacer--very-small" />
                      <div>
                        <FontAwesomeIcon
                          className={`classes.pencil ${classes.icons}`}
                          icon={["fas", "pencil-alt"]}
                          onClick={() => editLearnedEle(ele.learningContent)}
                        />
                        <FontAwesomeIcon
                          className={classes.icons}
                          icon={["fas", "trash"]}
                          onClick={() => deleteLearnedEle(ele.learningContent)}
                        />
                      </div>
                    </ListItem>
                  );
                })}
              </List>
            </PrimaryCard>
          </div>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <div className="module-spacer--medium" />
            <Divider />
            <div className="module-spacer--small" />
            <InputTime name="doneDate" control={control} />
            <div className="module-spacer--small" />
            <PrimaryText
              control={control}
              multiline={true}
              required={false}
              label="comment"
              name="comment"
              placeholder="コメント"
              rows={3}
              type="text"
            />

            <div className="module-spacer--small" />
            <UploadPictureButton uploadedImg={uploadedImg} setUploadedImg={setUploadedImg} />
            <div className="module-spacer--small" />
            {uploadedImg?.[0] && <h1>プレビュー</h1> &&
              uploadedImg.map((ele, index) => (
                <div key={ele.id}>
                  <div
                    className={`p-media-thumb ${classes.thumb}`}
                    onClick={() => {
                      showImg(ele.path);
                      setClickedIndex(index);
                    }}>
                    <img src={ele.path} alt="投稿画像" />
                  </div>
                  <div className="module-spacer--very-small" />
                </div>
              ))}
            <div className="module-spacer--small" />
            <div className="p-grid-columns">
              <PrimaryButton submit={true} color="primary" disabled={false}>
                学習記録を作成する
              </PrimaryButton>
            </div>
          </form>
          <div className="module-spacer--medium" />
          <Link href="/">
            <a className={classes.link}>学習記録投稿一覧に戻る</a>
          </Link>
          <div className="module-spacer--small" />
        </section>
        <ImgModal
          initialSlide={clickedIndex}
          path={showedImg}
          uploadedImg={uploadedImg}
          isOpen={isOpen}
          handleOpen={setIsOpen}
        />
      </div>
    </>
  );
};

export default Reset;
