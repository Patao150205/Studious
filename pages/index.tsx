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
      "@media (max-width: 750px)": {
        flexFlow: "column",
        alignItems: "center",
      },
    },
    charts: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
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
  })
);

export default function Home() {
  const router = useRouter();
  const classes = useStyles();

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
                src="/studious-logo.jpg"
                alt="studious-logo"
                name="ぱたお"
                onClick={() => router.push("/")}
              />
              <div className="module-spacer--small" />
              <div className="p-grid-rows--evenly">
                <SecondaryButton
                  startIcon={<TwitterIcon />}
                  disabled={false}
                  onClick={() => {
                    router.push("/");
                  }}
                  bgColor="#2a80e3"
                  fColor="#fff">
                  Twitter
                </SecondaryButton>
                <div className="module-spacer--very-small" />
                <SecondaryButton
                  startIcon={<GitHubIcon />}
                  disabled={false}
                  onClick={() => {
                    router.push("/");
                  }}
                  bgColor="#000"
                  fColor="#fff">
                  GitHub
                </SecondaryButton>
              </div>
            </div>
            <div className="module-spacer--small" />
            <Blackboard
              content={
                <>
                  <h1>＜自己紹介＞</h1>
                  <p>こんにちは！</p>
                  <p>まいねいむ いず ぱたお</p>
                  <h1>＜コメント＞</h1>
                  <p>
                    プログラミングをべんきょうしてるよプログラミングをべんきょうしてるよプログラミングをべんきょうしてるよ
                  </p>
                  <p>プログラミングをべんきょうしてるよ</p>
                  <p>プログラミングをべんきょうしてるよ</p>
                  <p>プログラミングをべんきょうしてるよ</p>
                  <p>プログラミングをべんきょうしてるよ</p>
                </>
              }
            />
          </div>
          <div className="module-spacer--small" />
          <div className={classes.boardsWrapper}>
            <div className={classes.userStatusCard}>
              <PrimaryCard
                avatar={<FontAwesomeIcon icon={["fas", "flag"]} />}
                title="ユーザー情報"
                subTitle="User status">
                <>
                  <p>初回ログイン日: 2017/02/09</p>
                  <br />
                  <p>投稿日数 : 323 (日)</p>
                  <br />
                  <p>総学習時間 : 889 (時間)</p>
                  <br />
                  <p>平均学習時間 : 82 (時間/週間)</p>
                  <br />
                  <p>平均学習時間 : 5 (時間/日)</p>
                  <br />
                </>
              </PrimaryCard>
            </div>
            <GoalBoard
              content={
                <>
                  <h1>目標</h1>
                  <div className="module-spacer--very-small" />
                  <p>
                    絶対にドキンちゃんになる！絶対にドキンちゃんになる！絶対にドキンちゃんになる！絶対にドキンちゃんになる！絶対
                  </p>
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
