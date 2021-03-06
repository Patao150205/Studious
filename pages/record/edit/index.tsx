import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC, useCallback, useState } from "react";
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
import { updateMyRecord, userStatisticalDataSelector } from "../../../src/features/usersSlice";
import { Divider, Switch, Theme } from "@material-ui/core";
import { auth, db, FirebaseTimestamp, storage } from "../../../firebase/firebaseConfig";
import { UplodedImg } from "../../edit";
import UploadPictureButton from "../../../src/component/UIkit/atoms/UploadPictureButton";
import { LearningList } from "../../../src/component/UIkit/organisms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

export type Registration = {
  learningContent: string;
  hours: number;
  minutes: number;
  convertedToMinutes: number;
};

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
const Reset: FC = () => {
  const classes = useStyles();

  const {
    control,
    formState: { errors },
    handleSubmit,
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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const statisticalData = useAppSelector(userStatisticalDataSelector);

  //???????????????
  const [target, setTarget] = useState<string | null>(null);
  //?????????????????????
  const [registration, setRegistration] = useState<Registration[] | []>([]);
  const [sumedTime, setSumedTime] = useState<number>(0);
  const [uploadedImg, setUploadedImg] = useState<UplodedImg[] | null>([]);
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [clickedIndex, setClickedIndex] = useState<number>(0);
  const [doneDate, setDoneDate] = useState<string>(timeNow);

  //??????????????????????????????
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  //?????????????????????
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const toggleModalOpen = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);
  //?????????????????????
  const [isSubmited, setIsSubmited] = useState(false);

  const handleModeChange = useCallback(() => {
    setIsChecked(!isChecked);
  }, [isChecked]);

  const onRegisterDoneDate = useCallback((event) => {
    setDoneDate(event.target.value);
  }, []);

  const onRegister = useCallback(
    (formContent: FormContents) => {
      if (!formContent.learningContent) {
        setModalTitle("??????????????????????????????");
        setModalContent("??????????????????????????????????????????");
        toggleModalOpen();
        return;
      }

      if (!(formContent.hours || formContent.minutes)) {
        //hours???minutes????????????0??????????????????????????????
        setModalTitle("??????????????????????????????");
        setModalContent("??????????????????????????????????????????????????????????????????");
        toggleModalOpen();
        return;
      }

      //?????????????????????????????????????????????????????????null???????????????
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
        setValue("learningContent", "", { shouldValidate: true });
        setValue("hours", 0);
        setValue("minutes", 0);
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
      setValue("learningContent", "", { shouldValidate: true });
      setValue("hours", 0);
      setValue("minutes", 0);
    },
    [registration, setRegistration, target, setTarget]
  );

  const onSubmit = useCallback(
    async (data: FormContents) => {
      setIsSubmited(true);
      const convertedDoneDate = new Date(doneDate).setHours(0, 0, 0, 0);
      if (isChecked) {
        //???????????????????????????????????????
        //2020/1/1??????????????????
        const begin = new Date(2020, 0, 1).getTime();
        const [year, month, date] = timeNow.split("/").map((ele) => Number(ele));
        const end = new Date(year, month - 1, date + 1).getTime();
        if (!(begin <= convertedDoneDate && convertedDoneDate < end)) {
          setModalTitle("??????????????????????????????");
          setModalContent("???????????????????????????????????????2020/1/1?????????????????????????????????????????????");
          toggleModalOpen();
          setIsSubmited(false);
          return;
        }

        const taskNameArr = registration.map((ele: Registration) => ele.learningContent);
        const s = new Set(taskNameArr);
        if (s.size !== taskNameArr.length) {
          setModalTitle("??????????????????????????????");
          setModalContent("??????????????????????????????????????????????????????????????????????????????????????????");
          toggleModalOpen();
          setIsSubmited(false);
          return;
        }

        if (sumedTime >= 1440) {
          setModalTitle("??????????????????????????????");
          setModalContent("?????????????????????????????????????????????????????????????????????????????????????????????");
          toggleModalOpen();
          setIsSubmited(false);
          return;
        }
        const uid = auth.currentUser?.uid;
        const doneDate = FirebaseTimestamp.fromMillis(convertedDoneDate);
        //?????????????????????????????????????????????????????????????????????
        const hasData = await db
          .collection("users")
          .doc(uid)
          .collection("userRecords")
          .where("doneDate", "==", doneDate)
          .get();
        //??????????????????????????????????????????????????????
        if (!hasData.empty) {
          setModalTitle("?????????????????????");
          setModalContent(
            `????????????????????????????????????????????????????????????????????????????????????${new Date(
              convertedDoneDate
            ).toLocaleDateString()}????????????????????????????????????`
          );
          toggleModalOpen();
          setIsSubmited(false);
          return;
        }

        const sendData = {
          created_at: FirebaseTimestamp.now(),
          ownComment: data.ownComment,
          doneDate,
          learning_content: registration,
          sumedTime: sumedTime,
          images: uploadedImg,
          isLearningRecord: true,
          isNew: true,
          updated_at: FirebaseTimestamp.now(),
          uid,
          username: auth.currentUser?.displayName,
          userIcon: auth.currentUser?.photoURL,
        };
        dispatch(updateMyRecord(sendData)).then(() => {
          //?????????????????????????????????
          let { total_time, posts_count } = statisticalData;
          total_time += sumedTime;
          posts_count += 1;
          db.collection("users").doc(uid).set({ statisticalData: { total_time, posts_count } }, { merge: true });
          router.push("/record");
        });
      } else {
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
          router.push("/record/allpost");
        });
      }
    },
    [doneDate, sumedTime, registration, uploadedImg, toggleModalOpen, isChecked, auth.currentUser]
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
          setSumedTime((prev) => {
            return prev - ele.convertedToMinutes;
          });
        }
        return ele.learningContent !== learningContent;
      });
      setRegistration(newList);
    },
    [registration, target, setSumedTime]
  );

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
        <title>STUDIOUS ??????????????????????????????</title>
      </Head>
      <div className={classes.root}>
        <section className={`c-section-container ${classes.card}`}>
          <div className="module-spacer--medium" />
          <StudiousLogoVertical />
          <div className="module-spacer--very-small" />
          <h2 className="u-text-sub-headline">{isChecked ? "?????????????????????" : "???????????????"}</h2>
          <div className="module-spacer--medium" />
          <label>
            <Switch checked={isChecked} value={isChecked} onChange={handleModeChange} name="mode_change" />
            <p>???????????????????????????????????????????????????</p>
            <div className="module-spacer--very-small" />
            <p>
              ??????????????????<span className="u-text--red">????????????</span>??????????????????????????????
            </p>
          </label>
          <div className="module-spacer--very-small" />
          {isChecked && (
            <>
              <InputTime onChange={onRegisterDoneDate} doneDate={doneDate} />
              <form className={classes.form} onSubmit={handleSubmit(onRegister)}>
                {target && <p className={classes.target}>{`${target} ????????????`}</p>}
                <div className="module-spacer--small" />
                <PrimaryText
                  control={control}
                  errors={errors}
                  errorMessage="??????????????????????????????????????????????????????????????????"
                  required={false}
                  rules={{
                    maxLength: 50,
                  }}
                  label="learningContent"
                  name="learningContent"
                  placeholder="????????????"
                  type="text"
                />
                <div className="module-spacer--small" />
                <div className="p-grid-rows--evenly">
                  <label>
                    <NumSelector control={control} name="hours" label={"??????(h)"} count={24} />
                    <p>??????(h)</p>
                  </label>
                  <label>
                    <NumSelector control={control} name="minutes" label={"???(m)"} count={60} />
                    <p>???(m)</p>
                  </label>
                </div>
                <div className="module-spacer--small" />
                <PrimaryButton submit={true} onClick={() => {}} color="primary" disabled={false}>
                  ?????????????????????
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
              placeholder="????????????"
              rows={3}
              type="text"
            />
            <div className="module-spacer--small" />
            <UploadPictureButton uploadedImg={uploadedImg} setUploadedImg={setUploadedImg} />
            <div className="module-spacer--small" />
            <p>?????????????????????????????????????????????????????????????????????????????????????????????</p>
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
                      <img src={ele.path} alt="????????????" />
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
            {isChecked ? (
              <>
                <div className="p-grid-columns">
                  <PrimaryButton submit={true} color="primary" disabled={isSubmited}>
                    ???????????????????????????
                  </PrimaryButton>
                </div>
                <div className="module-spacer--medium" />
                <Link href="/record">
                  <a className={classes.link}>?????????????????????????????????</a>
                </Link>
              </>
            ) : (
              <>
                <div className="p-grid-columns">
                  <PrimaryButton submit={true} color="primary" disabled={isSubmited}>
                    ?????????????????????
                  </PrimaryButton>
                </div>
                <div className="module-spacer--medium" />
                <Link href="/record/allpost">
                  <a className={classes.link}>????????????????????????</a>
                </Link>
              </>
            )}
          </form>
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
