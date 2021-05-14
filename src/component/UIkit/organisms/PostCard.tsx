import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Badge,
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
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { CommentArea } from ".";
import { UplodedImg } from "../../../../pages/edit";
import { UserRecord } from "../../../features/usersSlice";
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
  })
);

type Props = {
  post: UserRecord;
  handleDelete: (uid: string, recordId: string) => void;
};

const PostCard: FC<Props> = ({ post, handleDelete }) => {
  const classes = useStyles();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenComments, setIsOpenComments] = useState(false);
  const [uploadedImg] = useState<UplodedImg[] | null>(post.images);
  const [clickedIndex, setClickIndex] = useState(0);

  const toggleCommentsOpen = useCallback(() => {
    setIsOpenComments(!isOpenComments);
  }, [isOpenComments]);

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
          {post.learning_content.map((ele, index) => {
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
        <CardActions>
          <IconButton className={classes.favoriteBtn} onClick={toggleCommentsOpen}>
            <Badge max={999} badgeContent={post.othersComments?.comments.length} color="primary">
              <FontAwesomeIcon icon={["fas", "comments"]} />
            </Badge>
          </IconButton>
          <IconButton className={classes.favoriteBtn}>
            <Badge max={999} badgeContent={4} color="primary">
              <FontAwesomeIcon icon={["fas", "heart"]} />
            </Badge>
          </IconButton>
        </CardActions>
        {isOpenComments && (
          <>
            <CommentArea
              comments={post.othersComments?.comments ?? []}
              recordId={post.recordId}
              recordAuthorUid={post.uid}
            />
            <div className="module-spacer--very-small" />
          </>
        )}
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
