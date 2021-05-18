import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  ImgModal,
  InputTime,
  PrimaryModal,
  PrimaryText,
  StudiousLogoVertical,
} from "../../../src/component/UIkit/molecules";
import { NumSelector, PrimaryButton } from "../../../src/component/UIkit/atoms";
import { useAppDispatch, useAppSelector } from "../../../src/features/hooks";
import { updateMyRecord, UserRecord, userStatisticalDataSelector } from "../../../src/features/usersSlice";
import { Divider, Switch } from "@material-ui/core";
import { auth, db, FirebaseTimestamp, storage } from "../../../firebase/firebaseConfig";
import { UplodedImg } from "../../edit";
import UploadPictureButton from "../../../src/component/UIkit/atoms/UploadPictureButton";
import { LearningList } from "../../../src/component/UIkit/organisms";
import { Registration } from "./index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    imgDelete: {
      padding: 5,
      borderRadius: 8,
      background: "#ccc",
      fontSize: 25,
      width: "50%",
      margin: "0 auto",
      "&:hover": {
        opacity: "0.8",
        cursor: "pointer",
      },
    },
    link: {
      color: "#444",
      textDecoration: "none",
    },
  })
);

export type FormContents = {
  ownComment?: string;
  convertedToMinutes: number;
  doneDate?: string;
  hours: number;
  learningContent: string;
  minutes: number;
  index?: number;
};
const timeNow = FirebaseTimestamp.now().toDate().toLocaleDateString();
const uid = auth.currentUser?.uid;

const Reset: FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const statisticalData = useAppSelector(userStatisticalDataSelector);

  //編集の対象のデータ
  const [editTargetPost, setEditTargetPost] = useState<UserRecord>();
  //編集の対象
  const [target, setTarget] = useState<string | null>(null);
  //学習記録の登録
  const [registration, setRegistration] = useState<Registration[] | []>([]);
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [sumedTime, setSumedTime] = useState<number>(0);
  const [uploadedImg, setUploadedImg] = useState<UplodedImg[] | null>([]);
  const [clickedIndex, setClickedIndex] = useState<number>(0);
  const [doneDate, setDoneDate] = useState<string>("");
  //画像のスライドショー
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  //確認のモーダル
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const toggleModalOpen = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);
  //ボタン連打対策
  const [isSubmited, setIsSubmited] = useState(false);

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
    },
  });

  const handleModeChange = useCallback(() => {
    setIsChecked(!isChecked);
  }, [isChecked]);

  const onRegisterDoneDate = useCallback((event) => {
    setDoneDate(event.target.value);
  }, []);

  const onRegister = useCallback(
    (formContent: FormContents) => {
      if (!formContent.learningContent) {
        setModalTitle("学習記録の登録エラー");
        setModalContent("学習内容を入力してください。");
        toggleModalOpen();
        return;
      }

      if (!(formContent.hours || formContent.minutes)) {
        //hoursとminutesがともに0であった場合にエラー
        setModalTitle("学習記録の登録エラー");
        setModalContent("時間が０分なので、追加することができません。");
        toggleModalOpen();
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
      setSumedTime((prev) => prev + convertedToMinutes);
      setValue("learningContent", "", { shouldValidate: true });
      setValue("hours", 0);
      setValue("minutes", 0);
    },
    [registration, setRegistration, target, setTarget]
  );
  //投稿の送信
  const onSubmit = useCallback(
    async (data: FormContents) => {
      setIsSubmited(true);
      const convertedDoneDate = new Date(doneDate).setHours(0, 0, 0, 0);
      if (isChecked) {
        if (editTargetPost?.isLearningRecord === false) {
          setModalTitle("学習記録の登録エラー");
          setModalContent(
            "一般投稿であったものを学習記録として登録することはできません。新たに学習記録を作成してください。"
          );
          toggleModalOpen();
          setIsSubmited(false);
          return;
        }

        const taskNameArr = registration.map((ele: Registration) => ele.learningContent);
        const s = new Set(taskNameArr);
        if (s.size !== taskNameArr.length) {
          setModalTitle("学習記録の登録エラー");
          setModalContent("学習内容が重複しています。重複しないように登録してください。");
          toggleModalOpen();
          setIsSubmited(false);
          return;
        }

        if (sumedTime >= 1440) {
          setModalTitle("学習記録の登録エラー");
          setModalContent("一日２４時間以上勉強しています！正しい時間を入力してください！");
          toggleModalOpen();
          setIsSubmited(false);
          return;
        }

        //投稿できる日付の範囲を絞る
        //2020/1/1〜次の日未満
        const begin = new Date(2020, 0, 1).getTime();
        const [year, month, date] = timeNow.split("/").map((ele) => Number(ele));
        const end = new Date(year, month - 1, date + 1).getTime();
        if (!(begin <= convertedDoneDate && convertedDoneDate < end)) {
          setModalTitle("学習記録の登録エラー");
          setModalContent("学習記録に登録できるのは、2020/1/1から、今日までの日付のみです。");
          toggleModalOpen();
          setIsSubmited(false);
          return;
        }

        const doneDate = FirebaseTimestamp.fromMillis(convertedDoneDate);
        //学習記録を同じ日付に重複して、登録するのを防ぐ
        //編集の対象が同じだったら、重複と見なされない。
        if (!(editTargetPost?.doneDate?.toDate().getTime() === convertedDoneDate)) {
          const hasData = await db
            .collection("users")
            .doc(uid)
            .collection("userRecords")
            .where("doneDate", "==", doneDate)
            .get();
          //データが空出なかったらアラートを表示
          if (!hasData.empty) {
            setModalTitle("学習記録の重複");
            setModalContent(
              `学習記録は一日一回だけしか投稿することができません。既に${new Date(
                convertedDoneDate
              ).toLocaleDateString()}の投稿は存在しています！`
            );
            toggleModalOpen();
            setIsSubmited(false);
            return;
          }
        }

        const sendData = {
          created_at: editTargetPost?.created_at,
          ownComment: data.ownComment,
          doneDate,
          learning_content: registration,
          sumedTime,
          images: uploadedImg,
          isNew: false,
          updated_at: FirebaseTimestamp.now(),
          uid: editTargetPost?.uid,
          username: editTargetPost?.username,
          userIcon: editTargetPost?.userIcon,
          recordId: editTargetPost?.recordId,
        };

        //ユーザの統計を更新する
        const prevSumedTime = editTargetPost?.sumedTime;
        if (prevSumedTime) {
          let { total_time, posts_count } = statisticalData;
          total_time += sumedTime - prevSumedTime;
          db.collection("users").doc(uid).set({ statisticalData: { total_time, posts_count } }, { merge: true });
        }

        dispatch(updateMyRecord(sendData)).then(() => {
          router.push("/record");
        });
        reset();
      } else {
        if (editTargetPost?.isLearningRecord === true) {
          setModalTitle("学習記録の登録エラー");
          setModalContent(
            "学習記録であったものを一般投稿として登録することはできません。新たに一般投稿を作成してください。"
          );
          toggleModalOpen();
          setIsSubmited(false);
          return;
        }
        const sendData = {
          created_at: FirebaseTimestamp.now(),
          ownComment: data.ownComment,
          images: uploadedImg,
          isLearningRecord: false,
          isNew: true,
          updated_at: FirebaseTimestamp.now(),
          uid: auth.currentUser?.uid,
          username: auth.currentUser?.displayName,
          userIcon: auth.currentUser?.photoURL,
        };
        dispatch(updateMyRecord(sendData)).then(() => {
          router.push("/record");
        });
      }
    },
    [doneDate, sumedTime, registration, uploadedImg, toggleModalOpen, isChecked, editTargetPost?.sumedTime]
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
          setSumedTime((prev: number) => prev - ele.convertedToMinutes);
        }
        return ele.learningContent !== learningContent;
      });
      setRegistration(newList);
    },
    [registration, target, setSumedTime]
  );

  //編集対象のデータの取得
  useEffect(() => {
    try {
      const uid = auth.currentUser?.uid;
      const { recordId } = router.query as any;
      db.collection("users")
        .doc(uid)
        .collection("userRecords")
        .doc(recordId)
        .get()
        .then((doc) => {
          const data = doc.data();
          setIsChecked(data?.isLearningRecord);
          setEditTargetPost(data as UserRecord);
          setValue("ownComment", data?.ownComment ?? "");
          //レンダリングをなるべく減らす
          if (data?.images[0]) {
            setUploadedImg(data.images ?? []);
          }
          if (data?.isLearningRecord === true || undefined) {
            setSumedTime(data?.sumedTime);
            setRegistration(data?.learning_content ?? []);
            setSumedTime(data?.sumedTime);
            setDoneDate(data?.doneDate?.toDate().toLocaleDateString() ?? timeNow);
          }
        });
    } catch (err) {
      alert(err.message);
    }
  }, [router.query]);

  const deleteImg = (id: string) => {
    if (uploadedImg) {
      storage.ref("postImg").child(id).delete();
      const newArr = uploadedImg.filter((ele: UplodedImg) => ele.id !== id);
      setUploadedImg(newArr);
    }
  };

  return (
    <>
      <Head>
        <title>STUDIOUS 学習記録・投稿の編集</title>
      </Head>
      <div className={classes.root}>
        <section className={`c-section-container ${classes.card}`}>
          <div className="module-spacer--medium" />
          <StudiousLogoVertical />
          <div className="module-spacer--very-small" />
          <h2 className="u-text-sub-headline">学習記録・投稿の編集</h2>
          <div className="module-spacer--medium" />
          <label>
            <Switch checked={isChecked} onChange={handleModeChange} name="mode_change" />
            <p>学習記録と一般の投稿を切り替えます</p>
            <div className="module-spacer--very-small" />
            <p>
              ※学習記録は<span className="u-text--red">１日１回</span>の投稿制限があります
            </p>
          </label>
          <div className="module-spacer--very-small" />
          {isChecked && (
            <>
              <InputTime onChange={onRegisterDoneDate} doneDate={doneDate} />
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
            </>
          )}
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <div className="module-spacer--medium" />
            <Divider />
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
                        setIsSlideOpen(true);
                        setClickedIndex(index);
                      }}>
                      <img src={ele.path} alt="投稿画像" />
                    </div>
                    <div className="module-spacer--very-small" />
                    <div className={classes.imgDelete} onClick={() => deleteImg(ele.id)}>
                      <FontAwesomeIcon icon={["fas", "trash"]} />
                    </div>
                    <div className="module-spacer--very-small" />
                  </div>
                ))}
            </div>
            <div className="module-spacer--small" />
            <div className="p-grid-columns">
              <PrimaryButton submit={true} color="primary" disabled={isSubmited}>
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
        <ImgModal
          initialSlide={clickedIndex}
          uploadedImg={uploadedImg}
          isOpen={isSlideOpen}
          handleOpen={setIsSlideOpen}
        />
        <PrimaryModal title={modalTitle} isOpen={isModalOpen} toggleOpen={toggleModalOpen}>
          {modalContent}
        </PrimaryModal>
      </div>
    </>
  );
};

export default Reset;
