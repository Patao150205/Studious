import { createStyles, IconButton, makeStyles, Paper, Theme } from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Blackboard,
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
    pagination: {
      display: 'flex',
      justifyContent: 'space-between',
      width: "calc(100% - 2rem)",
      maxWidth: '50%',
      margin: "15px auto 0 auto",
    },
    paginationBtn: {
      fontSize: "2rem",
      color: theme.palette.primary[500],
      fontWeight: "bold",
      cursor: 'pointer',
    },
    charts: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    notFoundField: {
      margin: 100,
      textAlign: "center",
      lineHeight: "1.3",
      width: "calc(100% - 2rem)",
      maxWidth: 800,
      "& > a": {
        color: "red",
      },
    },
  })
);

export default function Profile() {
  const router = useRouter();
  const classes = useStyles();
  const selector = useAppSelector(userMyInfoSelector);


  const [columnChartDatas, setColumnChartDatas] = useState<string[][]>([]);
  const [pieChartDatas, setPieChartDatas] = useState<(string | number)[]>([]);
  const [totalTimeForWeek, setTotalTimeForWeek] = useState<number>(0);
  const pagination = isNaN(Number(router.query.pagination)) ? 0 : Number(router.query.pagination);

  const introduce_myself = HTMLReactParser(selector.introduce_myself.replace(/\n/g, "<br />"));
  const target = HTMLReactParser(selector.target.replace(/\n/g, "<br />"));
  const status = selector.statisticalData;
  const uid = auth.currentUser?.uid;

  console.log(columnChartDatas);
  console.log(new Date(FirebaseTimestamp.now().toDate()));
  useEffect(() => {
    if (pagination < 0) {
      router.push('/');
    }
    (async () => {
      const NowTime = new Date(FirebaseTimestamp.now().toDate());
      const latestTime = new Date(NowTime.setDate(NowTime.getDate() - pagination * 7));

      const dateNow = latestTime.setHours(0, 0, 0, 0);
      //一週間前の日付を求める
      const y = latestTime.getFullYear();
      const m = latestTime.getMonth();
      const d = latestTime.getDate() - 6;
      const lastWeekDate = FirebaseTimestamp.fromDate(new Date(y, m, d));
      const convertedNowDate = FirebaseTimestamp.fromMillis(dateNow);

      /**
       * ColumnChart
       */

      //一週間前から今日までの学習記録を取得する。
      const snapshots = await db
        .collection("users")
        .doc(uid)
        .collection("userRecords")
        .orderBy("doneDate")
        .where("doneDate", "<=", convertedNowDate)
        .where("doneDate", ">=", lastWeekDate)
        .get();

      //取得したデータ
      const gettedRecords: UserRecord[] = [];
      snapshots.forEach((doc: any) => {
        gettedRecords.push(doc.data());
      });

      //一週間の学習記録に存在する学習内容の名前だけを取得する
      const learningContentsName: Set<string> = new Set();
      gettedRecords.map((record) => {
        record.learning_content?.map((content) => {
          learningContentsName.add(content.learningContent);
        });
      });

      const totalTimeForWeek = gettedRecords.reduce((totalTime, recordTime) => {
        return totalTime + recordTime.sumedTime;
      }, 0);

      setTotalTimeForWeek(totalTimeForWeek);

      //カラムチャート用のデータを作成
      let columnChart: any[] = Array([], [], [], [], [], [], []);
      columnChart = columnChart.map((data, index) => {
        //データが存在した場合、抽出する
        const targetData = gettedRecords.find((record) => {
          return record.doneDate.seconds === FirebaseTimestamp.fromDate(new Date(y, m, d + index)).seconds;
        });
        //時間を設定する
        const date_Date = FirebaseTimestamp.fromDate(new Date(y, m, d + index)).toDate();
        let date = date_Date.toLocaleDateString().slice(5);
        const dayOfWeek = date_Date.getDay();
        const dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"][dayOfWeek];
        date = `${date}
        ${dayOfWeekStr}`;
        if (index === 6) {
          date = `${date}
          今日`;
        }
        data.push(date);
        //taskの時間を入れ込む
        const tasks: any[] = [];
        let data_: any[] = [];
        if (targetData) {
          tasks;
          Array.from(learningContentsName).forEach((name) => {
            if (targetData.learning_content) {
              let isFind: true | undefined;
              targetData.learning_content.map((task) => {
                if (task.learningContent === name) {
                  tasks.push(Number((task.convertedToMinutes / 60).toFixed(1)));
                  isFind = true;
                }
              });
              if (!isFind) {
                tasks.push(0);
              }
            }
          });
          data_ = data.concat(tasks);
          if (index !== 6) {
            //styleの設定
            //平均時間の設定
            data_.push("");
            data_.push(Number((totalTimeForWeek / 60 / 7).toFixed(1)));
          } else {
            data_.push("");
            data_.push(Number((totalTimeForWeek / 60 / 7).toFixed(1)));
          }
        } else {
          data_ = data;
          learningContentsName.forEach((_) => {
            data_.push(0);
          });
          data_.push("");
          data_.push(Number((totalTimeForWeek / 60 / 7).toFixed(1)));
        }
        return data_;
      });

      //データとして渡す配列の[0](Header要素)作成
      const dataName: (
        | string
        | {
            role: string;
          }
      )[] = ["日付"];
      learningContentsName.forEach((name) => {
        dataName.push(name);
      });
      dataName.push({ role: "style" });
      dataName.push("平均学習時間(This week)");
      columnChart.unshift(dataName);
      setColumnChartDatas(columnChart);

      /**
       * PieChart
       */

      //名前を元に時間を取得する
      const respectiveTimeForWeek: { contentName: string; time: number }[] = [];
      learningContentsName.forEach((name) => {
        const respectiveTimeInContents = gettedRecords.reduce((total, record) => {
          const target = record.learning_content?.find((content) => content.learningContent === name);
          return total + (target?.convertedToMinutes ?? 0);
        }, 0);
        respectiveTimeForWeek.push({ contentName: name, time: respectiveTimeInContents });
      });
      //パイチャート用のデータを作成
      const pieChart = Array(respectiveTimeForWeek.length);
      respectiveTimeForWeek.map((ele, index) => {
        pieChart[index] = [`${ele.contentName}`, Number((ele.time / 60).toFixed(1))];
      });
      pieChart.unshift(["学習内容(h)", "(割合)"]);
      setPieChartDatas(pieChart);
    })();
  }, [uid, router.query.pagination]);

  const handlePagination = (controlNum: number) => {
    // controlNumが、0 一週間前に、1 一週間後に
    // 何週間前かを表す
    console.log(pagination)
    let paginationNum = pagination;
      if (controlNum === 0) {
        paginationNum += 1; 
      }
      if (controlNum === 1) {
        paginationNum -=1;
      }
    // マイナスは許さない
    paginationNum < 0 && (paginationNum = 0);
    
    router.push({pathname: '/', query: {pagination: paginationNum}}, undefined, {scroll: false});
  }

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
                  <p>学習記録投稿日数 : {status?.posts_count}日</p>
                  <br />
                  <p>総学習時間 : {(status?.total_time / 60).toFixed(1)}時間</p>
                  <br />
                  <p>一周間の学習時間: {(totalTimeForWeek / 60).toFixed(1)}時間</p>
                  <br />
                  <p>一周間の平均学習時間 : {(totalTimeForWeek / 60 / 7).toFixed(1)}時間(日)</p>
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
        <div className={classes.pagination}>
          <IconButton onClick={() => handlePagination(0)}>
        <FontAwesomeIcon className={classes.paginationBtn}  icon={["fas", "chevron-left"]} />
          </IconButton>
          <IconButton disabled={pagination == 0} onClick={() => handlePagination(1)}>
        <FontAwesomeIcon className={classes.paginationBtn}  icon={["fas", "chevron-right"]} />
          </IconButton>
        </div>
        <div className={classes.charts}>
          {
              <>
                <ColumnChart title="一周間の学習時間(h)" data={columnChartDatas} isStacked={true} />
                <PieChart title="一週間の学習内容内訳(h)" data={pieChartDatas} />
              </>
          }
        </div>
        <div className="module-spacer--small" />
      </div>
    </>
  );
}
