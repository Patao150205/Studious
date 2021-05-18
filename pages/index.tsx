import { createStyles, makeStyles, Paper, Theme } from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Blackboard,
  CalendarChart,
  ColumnChart,
  GoalBoard,
  PieChart,
  PrimaryCard,
  SecondaryButton,
} from "../src/component/UIkit/atoms/index";
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconWithName } from "../src/component/UIkit/molecules";
import { userMyInfoSelector, UserRecord } from "../src/features/usersSlice";
import HTMLReactParser from "html-react-parser";
import { useAppSelector } from "../src/features/hooks";
import { useEffect, useState } from "react";
import { auth, db, FirebaseTimestamp } from "../firebase/firebaseConfig";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "calc(100% - 2rem)",
      borderRadius: "10px",
      boxShadow: "0 10px 10px 5px rgba(0, 0, 0, 0.2)",
      padding: "0.5rem 0.5rem",
    },
    paper: {
      background: "#dadbe0",
      maxWidth: 900,
      margin: "0 auto",
    },
    profile: {
      minWidth: "calc(320px - 2rem)",
      maxWidth: 900,
      display: "flex",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
      "@media (max-width: 800px)": {
        flexFlow: "column",
        alignItems: "center",
      },
    },
    boardsWrapper: {
      display: "flex",
      justifyContent: "space-evenly",
      width: "100%",
      maxWidth: "calc(100% - 2rem)",
      margin: "0 auto",
      borderRadius: "10px",
      padding: "0.5rem 0.5rem",
      "@media (max-width: 750px)": {
        flexFlow: "column",
        alignItems: "center",
      },
    },
    userStatusCard: {
      width: 300,
      height: "100%",
      "@media (max-width: 750px)": {
        marginTop: 40,
      },
    },
    charts: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);

export default function Home() {
  const router = useRouter();
  const classes = useStyles();
  const selector = useAppSelector(userMyInfoSelector);

  const [recordsForWeek, setRecordsForWeek] = useState<UserRecord[]>([]);
  console.log(recordsForWeek, "これ");
  const introduce_myself = HTMLReactParser(selector.introduce_myself.replace(/\n/g, "<br />"));
  const target = HTMLReactParser(selector.target.replace(/\n/g, "<br />"));
  const status = selector.statisticalData;
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const TimeNow = new Date(FirebaseTimestamp.now().toDate());
    const dateNow = TimeNow.setHours(0, 0, 0, 0);
    const y = TimeNow.getFullYear();
    const m = TimeNow.getMonth();
    const d = TimeNow.getDate() - 7;
    const lastWeekDate = FirebaseTimestamp.fromDate(new Date(y, m, d));
    const convertedNowDate = FirebaseTimestamp.fromMillis(dateNow);

    //一週間前から今日までの学習記録を取得する。
    db.collection("users")
      .doc(uid)
      .collection("userRecords")
      .orderBy("doneDate", "desc")
      .where("doneDate", "<=", convertedNowDate)
      .where("doneDate", ">=", lastWeekDate)
      .get()
      .then((snapshot) => {
        const gettedRecords: UserRecord[] = [];
        snapshot.forEach((ele) => {
          const record = ele.data() as UserRecord;
          gettedRecords.push(record);
        });
        setRecordsForWeek(gettedRecords);
      });
  }, [uid]);

  const totalTimeForWeek = recordsForWeek.reduce((totalTime, recordTime) => {
    return totalTime + recordTime.sumedTime;
  }, 0);

  return (
    <>
      <Head>
        <title>STUDIOUS 学習記録</title>
      </Head>
      <div className="c-section-wrapping--main ">
        <div className="module-spacer--medium" />
        <Paper className={classes.paper}>
          <div className="module-spacer--small" />
          <div className={classes.profile}>
            <div className="u-text--center">
              <IconWithName
                src={selector.photoURL}
                alt="プロフィール画像"
                name={selector.username}
                onClick={() => router.push("/")}
              />
              <div className="module-spacer--small" />
              <div className="p-grid-rows--center">
                <SecondaryButton
                  startIcon={<TwitterIcon />}
                  disabled={selector.sns_path.twitter ? false : true}
                  onClick={() => {
                    window.location.href = selector.sns_path.twitter;
                  }}
                  bgColor="#2a80e3"
                  fColor="#fff">
                  Twitter
                </SecondaryButton>
                <div className="module-spacer--very-small" />
                <SecondaryButton
                  startIcon={<GitHubIcon />}
                  disabled={selector.sns_path.GitHub ? false : true}
                  onClick={() => {
                    window.location.href = selector.sns_path.GitHub;
                  }}
                  bgColor="#000"
                  fColor="#fff">
                  GitHub
                </SecondaryButton>
              </div>
            </div>
            <div className="module-spacer--small" />
            <Blackboard content={introduce_myself} />
          </div>
          <div className="module-spacer--small" />
          <div className={classes.boardsWrapper}>
            <div className={classes.userStatusCard}>
              <PrimaryCard
                avatar={<FontAwesomeIcon icon={["fas", "flag"]} />}
                title="ユーザー情報"
                subTitle="User status">
                <>
                  <p>初回ログイン日: {selector.created_at}</p>
                  <br />
                  <p>学習記録投稿日数 : {status.posts_count} 日</p>
                  <br />
                  <p>総学習時間 : {(status.total_time / 60).toFixed(1)} 時間</p>
                  <br />
                  <p>一周間の学習時間: {(totalTimeForWeek / 60).toFixed(1)} 時間</p>
                  <br />
                  <p>平均学習時間 : {(totalTimeForWeek / 60 / 7).toFixed(1)} 時間 (日/週間)</p>
                  <br />
                </>
              </PrimaryCard>
            </div>
            <GoalBoard
              content={
                <>
                  <h1>目標</h1>
                  <div className="module-spacer--very-small" />
                  <p>{target}</p>
                </>
              }
            />
          </div>
          <div className="module-spacer--very-small" />
        </Paper>
        <div className={classes.charts}>
          <ColumnChart />
          <PieChart />
        </div>
        <CalendarChart />
        <div className="module-spacer--small" />
      </div>
    </>
  );
}
