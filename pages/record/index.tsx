import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  createStyles,
  Divider,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import Head from "next/head";
import React from "react";
import { useAppDispatch } from "../../src/features/hooks";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {},
    card: {
      textAlign: "left",
      margin: "5vh auto",
      lineHeight: "1.6rem",
    },
    cardHeader: {
      fontSize: 30,
      "&:hover": {
        backgroundColor: theme.palette.grey[100],
        cursor: "pointer",
        opacity: "0.8",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: 25,
      },
    },
    cardMedia: {
      width: "100%",
      height: "auto",
    },
    favoriteBtn: {
      fontSize: 30,
      margin: "0 auto",
      cursor: "pointer",
    },
    pencil: {
      margin: "15px 20px 0 0",
      "&:hover": {
        color: theme.palette.primary[500],
        cursor: "pointer",
        opacity: "0.8",
      },
    },
    trash: {
      "&:hover": {
        color: theme.palette.primary[500],
        cursor: "pointer",
        opacity: "0.8",
      },
    },
  })
);

const Record = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>STUDIOUS 学習記録</title>
      </Head>
      <section className={`c-section-wrapping--main ${classes.root}`}>
        <Card className={`c-section-container ${classes.card}`}>
          <CardHeader
            className={classes.cardHeader}
            avatar={<Avatar src="/noUserImage.jpg" />}
            title="ぱたお"
            onClick={() => {}}
            action={
              <>
                <FontAwesomeIcon className={classes.pencil} icon={["fas", "pencil-alt"]} />
                <FontAwesomeIcon className={classes.trash} icon={["fas", "trash"]} />
              </>
            }></CardHeader>
          <CardContent>
            <p>✅ JavaScript 1h 15m</p>
            <p>✅ JavaScript 1h 15m</p>
            <p>✅ JavaScript 1h 15m</p>
          </CardContent>
          <Divider />
          <CardContent>
            まだダミーデータだけど、インデックスページのUIが構築できました！
            iPhoneSE(旧)のサイズを基準にしてるから、どのスマホでも画面崩れが起こらないはず
            コンポーネント分割しっかりやってると使い回しがきいて楽目がハートの笑顔
          </CardContent>

          <CardMedia component="img" className={classes.cardMedia} src="/noUserImage.jpg" title="ゴリラ" />
          <CardActions>
            <IconButton className={classes.favoriteBtn}>
              <FontAwesomeIcon icon={["fas", "comments"]} />
            </IconButton>
            <IconButton className={classes.favoriteBtn}>
              <FontAwesomeIcon icon={["fas", "heart"]} />
            </IconButton>
          </CardActions>
        </Card>
        <Card className={`c-section-container ${classes.card}`}>
          <CardHeader
            className={classes.cardHeader}
            avatar={<Avatar src="/noUserImage.jpg" />}
            title="ぱたお"
            onClick={() => {}}
            action={
              <>
                <FontAwesomeIcon className={classes.pencil} icon={["fas", "pencil-alt"]} />
                <FontAwesomeIcon className={classes.trash} icon={["fas", "trash"]} />
              </>
            }></CardHeader>
          <CardContent>
            <p>✅ JavaScript 1h 15m</p>
            <p>✅ JavaScript 1h 15m</p>
            <p>✅ JavaScript 1h 15m</p>
          </CardContent>
          <Divider />
          <CardContent>
            まだダミーデータだけど、インデックスページのUIが構築できました！
            iPhoneSE(旧)のサイズを基準にしてるから、どのスマホでも画面崩れが起こらないはず
            コンポーネント分割しっかりやってると使い回しがきいて楽目がハートの笑顔
          </CardContent>

          <CardMedia component="img" className={classes.cardMedia} src="/noUserImage.jpg" title="ゴリラ" />
          <CardActions>
            <IconButton className={classes.favoriteBtn}>
              <FontAwesomeIcon icon={["fas", "comments"]} />
            </IconButton>
            <IconButton className={classes.favoriteBtn}>
              <FontAwesomeIcon icon={["fas", "heart"]} />
            </IconButton>
          </CardActions>
        </Card>
        <Card className={`c-section-container ${classes.card}`}>
          <CardHeader
            className={classes.cardHeader}
            avatar={<Avatar src="/noUserImage.jpg" />}
            title="ぱたお"
            onClick={() => {}}
            action={
              <>
                <FontAwesomeIcon className={classes.pencil} icon={["fas", "pencil-alt"]} />
                <FontAwesomeIcon className={classes.trash} icon={["fas", "trash"]} />
              </>
            }></CardHeader>
          <CardContent>
            <p>✅ JavaScript 1h 15m</p>
            <p>✅ JavaScript 1h 15m</p>
            <p>✅ JavaScript 1h 15m</p>
          </CardContent>
          <Divider />
          <CardContent>
            まだダミーデータだけど、インデックスページのUIが構築できました！
            iPhoneSE(旧)のサイズを基準にしてるから、どのスマホでも画面崩れが起こらないはず
            コンポーネント分割しっかりやってると使い回しがきいて楽目がハートの笑顔
          </CardContent>

          <CardMedia component="img" className={classes.cardMedia} src="/noUserImage.jpg" title="ゴリラ" />
          <CardActions>
            <IconButton className={classes.favoriteBtn}>
              <FontAwesomeIcon icon={["fas", "comments"]} />
            </IconButton>
            <IconButton className={classes.favoriteBtn}>
              <FontAwesomeIcon icon={["fas", "heart"]} />
            </IconButton>
          </CardActions>
        </Card>
        <Card className={`c-section-container ${classes.card}`}>
          <CardHeader
            className={classes.cardHeader}
            avatar={<Avatar src="/noUserImage.jpg" />}
            title="ぱたお"
            onClick={() => {}}
            action={
              <>
                <FontAwesomeIcon className={classes.pencil} icon={["fas", "pencil-alt"]} />
                <FontAwesomeIcon className={classes.trash} icon={["fas", "trash"]} />
              </>
            }></CardHeader>
          <CardContent>
            <p>✅ JavaScript 1h 15m</p>
            <p>✅ JavaScript 1h 15m</p>
            <p>✅ JavaScript 1h 15m</p>
          </CardContent>
          <Divider />
          <CardContent>
            まだダミーデータだけど、インデックスページのUIが構築できました！
            iPhoneSE(旧)のサイズを基準にしてるから、どのスマホでも画面崩れが起こらないはず
            コンポーネント分割しっかりやってると使い回しがきいて楽目がハートの笑顔
          </CardContent>

          <CardMedia component="img" className={classes.cardMedia} src="/noUserImage.jpg" title="ゴリラ" />
          <CardActions>
            <IconButton className={classes.favoriteBtn}>
              <FontAwesomeIcon icon={["fas", "comments"]} />
            </IconButton>
            <IconButton className={classes.favoriteBtn}>
              <FontAwesomeIcon icon={["fas", "heart"]} />
            </IconButton>
          </CardActions>
        </Card>
      </section>
    </>
  );
};

export default Record;
