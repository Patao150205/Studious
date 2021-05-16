import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { ImgModal, InputTime, PrimaryText, StudiousLogoVertical } from "../../../src/component/UIkit/molecules";
import { NumSelector, PrimaryButton } from "../../../src/component/UIkit/atoms";
import { useAppDispatch } from "../../../src/features/hooks";
import { updateMyRecord, userRecordSelector } from "../../../src/features/usersSlice";
import { Divider } from "@material-ui/core";
import { FirebaseTimestamp } from "../../../firebase/firebaseConfig";
import { UplodedImg } from "../../edit";
import { processedTime } from "../../../src/component/UIkit/molecules/InputTime";
import UploadPictureButton from "../../../src/component/UIkit/atoms/UploadPictureButton";
import { LearningList } from "../../../src/component/UIkit/organisms";
import { useSelector } from "react-redux";

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
    target: {
      color: "red",
    },
    form: {
      margin: "0 auto",
      maxWidth: 400,
    },
    imgGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(calc(50% - 5px), 1fr))",
      gap: 10,
      [theme.breakpoints.up("sm")]: {
        gridTemplateColumns: "repeat(auto-fit, minmax(calc(33% - 10px), 1fr))",
      },
    },
    link: {
      color: "#444",
      textDecoration: "none",
    },
  })
);

export type Registration =
  | {
      learningContent: string;
      hours: number;
      minutes: number;
      convertedToMinutes: number;
    }[]
  | [];

export type FormContents = {
  ownComment?: string;
  convertedToMinutes: number;
  doneDate?: string;
  hours: number;
  learningContent: string;
  minutes: number;
  index?: number;
};

const Reset: FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { recordId } = router.query;
  const selector = useSelector(userRecordSelector);
  const editTargetPost = selector.find((post) => post.recordId === recordId);
  const [target, setTarget] = useState<string | null>(null);
  const [registration, setRegistration] = useState<Registration>([]);
  const [sumedTime, setSumedTime] = useState<number>(0);
  const [uploadedImg, setUploadedImg] = useState<UplodedImg[] | null>([]);
  // const [isSubmit, setIsSubmit] = useState<boolean>(false);
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
      ownComment: "",
      hours: 0,
      minutes: 0,
      doneDate: processedTime,
    },
  });

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
        registration.find((ele, index) => {
          if (ele.learningContent === target) {
            registration[index] = data;
            return true;
          }
        });
        setTarget(null);
        reset();
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
        created_at: FirebaseTimestamp.fromDate(new Date(editTargetPost?.created_at)),
        ownComment: data.ownComment,
        doneDate: data.doneDate,
        learning_content: registration,
        sumedTime: sumedTime,
        images: uploadedImg,
        isNew: false,
        updated_at: FirebaseTimestamp.now(),
        uid: editTargetPost?.uid,
        username: editTargetPost?.username,
        userIcon: editTargetPost?.userIcon,
        recordId: editTargetPost?.recordId,
      };

      dispatch(updateMyRecord(sendData)).then(() => {
        router.push("/record");
      });
      // setIsSubmit(true);
      reset();
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

  useEffect(() => {
    setRegistration(editTargetPost?.learning_content ?? []);
    setUploadedImg(editTargetPost?.images ?? []);
    setValue("ownComment", editTargetPost?.ownComment ?? "");
    setValue("doneDate", editTargetPost?.doneDate ?? processedTime);
  }, [editTargetPost]);

  return (
    <>
      <Head>
        <title>STUDIOUS 学習記録の編集</title>
      </Head>
      <div className={classes.root}>
        <section className={`c-section-container ${classes.card}`}>
          <div className="module-spacer--medium" />
          <StudiousLogoVertical />
          <div className="module-spacer--very-small" />
          <h2 className="u-text-sub-headline">学習記録の編集</h2>
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
            <LearningList
              registration={registration}
              editLearnedEle={editLearnedEle}
              deleteLearnedEle={deleteLearnedEle}
            />
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
              name="ownComment"
              placeholder="コメント"
              rows={3}
              type="text"
            />
            <div className="module-spacer--small" />
            <UploadPictureButton uploadedImg={uploadedImg} setUploadedImg={setUploadedImg} />
            <div className="module-spacer--small" />
            <div className={classes.imgGrid}>
              {uploadedImg?.[0] &&
                uploadedImg.map((ele, index) => (
                  <div key={ele.id}>
                    <div
                      className={`p-media-thumb`}
                      onClick={() => {
                        setIsOpen(true);
                        setClickedIndex(index);
                      }}>
                      <img src={ele.path} alt="投稿画像" />
                    </div>
                    <div className="module-spacer--very-small" />
                  </div>
                ))}
            </div>
            <div className="module-spacer--small" />
            <div className="p-grid-columns">
              <PrimaryButton submit={true} color="primary" disabled={false}>
                学習記録を更新する
              </PrimaryButton>
            </div>
          </form>
          <div className="module-spacer--medium" />
          <Link href="/record">
            <a className={classes.link}>学習記録投稿一覧に戻る</a>
          </Link>
          <div className="module-spacer--small" />
        </section>
        <ImgModal initialSlide={clickedIndex} uploadedImg={uploadedImg} isOpen={isOpen} handleOpen={setIsOpen} />
      </div>
    </>
  );
};

export default Reset;
