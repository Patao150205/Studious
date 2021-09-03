import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  createStyles,
  Divider,
  makeStyles,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useState } from "react";
import { auth, db } from "../../../../firebase/firebaseConfig";
import { UplodedImg } from "../../../../pages/edit";
import { useAppDispatch } from "../../../features/hooks";
import { reflectHeart, UserRecord } from "../../../features/usersSlice";
import { ImgModal } from "../molecules";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    card: {
      textAlign: "left",
      margin: "5vh auto",
      lineHeight: "1.6rem",
    },
    cardHeader: {
      fontSize: 30,
      paddingBottom: 0,
      [theme.breakpoints.down("sm")]: {
        fontSize: 25,
      },
    },
    username: {
      cursor: "pointer",
      display: "inline",
      "&:hover": {
        color: theme.palette.primary[500],
        textDecoration: "underline",
      },
    },
    userIcon: {
      cursor: "pointer",
      "&:hover": {
        backgroundColor: theme.palette.grey[100],
        opacity: "0.8",
      },
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
    learningContents: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    thumbSingle: {
      width: "50%",
      margin: "0 auto",
    },
    thumb: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(calc(50% - 5px), 1fr))",
      gap: 10,
      [theme.breakpoints.up("sm")]: {
        gridTemplateColumns: "repeat(auto-fit, minmax(calc(33% - 10px), 1fr))",
      },
    },
    favoriteBtn: {
      fontSize: 30,
      margin: "0 auto",
      cursor: "pointer",
    },
    good: {
      color: "red",
    },
  })
);

type Props = {
  post: UserRecord;
  handleDelete: (uid: string, recordId: string) => void;
};

const PostCard: FC<Props> = ({ post, handleDelete }) => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenComments, setIsOpenComments] = useState(false);
  const [uploadedImg, setUploadImg] = useState<UplodedImg[] | null>(null);
  const [clickedIndex, setClickIndex] = useState(0);
  const [isGood, setIsGood] = useState(false);

  const toggleCommentsOpen = useCallback(() => {
    setIsOpenComments(!isOpenComments);
  }, [isOpenComments]);

  const toggleIsGood = () => {
    if (auth.currentUser) {
      const uid = auth.currentUser?.uid;
      if (isGood) {
        const data = post.goodHeart.filter((ele) => ele.uid !== uid);
        db.collection("users")
          .doc(post.uid)
          .collection("userRecords")
          .doc(post.recordId)
          .set({ goodHeart: data }, { merge: true });
        setIsGood(false);
        dispatch(reflectHeart(data));
      } else {
        const username = auth.currentUser.displayName ?? "取得できませんでした";
        const userIcon = auth.currentUser.photoURL ?? "取得できませんでした";
        const data = { uid, username, userIcon };
        const sendData = post.goodHeart?.[0] ? [...post.goodHeart, data] : [data];
        db.collection("users")
          .doc(post.uid)
          .collection("userRecords")
          .doc(post.recordId)
          .set({ goodHeart: sendData }, { merge: true });
        dispatch(reflectHeart(data));
        setIsGood(true);
      }
    }
  };

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    const isFound = post.goodHeart?.some((ele) => ele.uid === uid);
    setIsGood(isFound);
    setUploadImg(post.images);
  }, [post.goodHeart, post.images]);

  return (
    <div>
      <Card className={`c-section-container ${classes.card}`}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar
              onClick={() => router.push("/")}
              className={classes.userIcon}
              src={post.userIcon ? post.userIcon : "/noUserImage.jpg"}
            />
          }
          title={
            <>
              <p onClick={() => router.push("/")} className={classes.username}>
                {post.username}
              </p>
              <p>{post.created_at}</p>
            </>
          }
          action={
            <>
              <FontAwesomeIcon
                onClick={() => {
                  router.push(`/record/edit/${post.recordId}`);
                }}
                className={classes.pencil}
                icon={["fas", "pencil-alt"]}
              />
              <FontAwesomeIcon
                onClick={() => handleDelete(post.uid, post.recordId)}
                className={classes.trash}
                icon={["fas", "trash"]}
              />
            </>
          }
        />
        <CardContent>
          {post.doneDate && (
            <>
              <h1>{`学習日時: ${new Date(post.doneDate).toLocaleDateString()}`}</h1>
              <div className="module-spacer--very-small" />
            </>
          )}
          {post.learning_content?.map((ele, index) => {
            const minutes = ("00" + ele.minutes).slice(-2);
            return (
              <div className={classes.learningContents} key={index}>
                <p>✅ {`${ele.learningContent}`}</p>
                <p>{`${ele.hours}h ${minutes}m`}</p>
              </div>
            );
          })}
          <div className="module-spacer--very-small" />
          <Divider />
          <div className="module-spacer--very-small" />
          <p>{post.ownComment}</p>
        </CardContent>
        <div className={classes.thumb}>
          {post.images.map((img, index) => (
            <div key={img.id}>
              <div className="p-media-thumb">
                <CardMedia
                  component="img"
                  onClick={() => {
                    setClickIndex(index);
                    setIsModalOpen(true);
                  }}
                  src={img.path ? img.path : "/noImg.png"}
                  title="投稿画像"
                />
              </div>
              <div className="module-spacer--very-small" />
            </div>
          ))}
        </div>
      </Card>
      <ImgModal
        initialSlide={clickedIndex}
        uploadedImg={uploadedImg}
        isOpen={isModalOpen}
        handleOpen={setIsModalOpen}
      />
    </div>
  );
};

export default PostCard;
