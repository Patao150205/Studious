import { createStyles, makeStyles } from "@material-ui/styles";
import React, { Dispatch, FC, SetStateAction, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { PrimaryText } from "../molecules";
import { PrimaryButton } from "../atoms";
import { Avatar, CardHeader, CardContent, Divider } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch } from "../../../features/hooks";
import { sendPostComment } from "../../../features/usersSlice";
import { auth, FirebaseTimestamp } from "../../../../firebase/firebaseConfig";
import HTMLReactParser from "html-react-parser";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {
      background: "#eee",
    },
    commentsField: {
      maxHeight: 500,
      overflowY: "scroll",
    },
    form: {
      margin: "0 auto",
      maxWidth: 400,
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
  })
);

export type Comment = {
  content: string;
  commentId: string;
  created_at: any;
  uid: string;
  username: string;
  userIcon: string;
};

export type SendCommentsData = {
  comments: Comment[];
  recordAuthorUid: string;
  recordId: string;
};

const CommentArea: FC<SendCommentsData> = ({ comments, recordAuthorUid, recordId }) => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { control, handleSubmit, reset } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: { commentField: "" },
  });

  const handleDelete = useCallback(
    (commentId: string) => {
      const newComments = comments.filter((comment) => comment.commentId !== commentId);
      const sendData: SendCommentsData = {
        recordId,
        recordAuthorUid,
        comments: newComments,
      };
      dispatch(sendPostComment(sendData));
    },
    [comments]
  );

  const onSubmit = (inputValue: any) => {
    // ランダムな１６桁の文字列の生成
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const commentId = Array.from(crypto.getRandomValues(new Uint8Array(N)))
      .map((n) => S[n % S.length])
      .join("");

    const convertedContent = HTMLReactParser(inputValue.commentField.replace(/\n/g, "<br />"));

    const data: Comment = {
      content: convertedContent as string,
      commentId,
      created_at: FirebaseTimestamp.now(),
      uid: auth.currentUser?.uid ?? "エラー",
      username: auth.currentUser?.displayName ?? "エラー",
      userIcon: auth.currentUser?.photoURL ?? "エラー",
    };
    const newComments = [...comments, data];
    const sendData: SendCommentsData = {
      recordId,
      recordAuthorUid,
      comments: newComments,
    };
    dispatch(sendPostComment(sendData));
    reset();
  };

  return (
    <div className={classes.root}>
      <div className={classes.commentsField}>
        {comments?.map((comment) => (
          <div key={comment.commentId}>
            <CardHeader
              className={classes.cardHeader}
              avatar={
                <Avatar
                  onClick={() => router.push("/")}
                  className={classes.userIcon}
                  src={comment.userIcon ? comment.userIcon : "/noUserImage.jpg"}
                />
              }
              title={
                <>
                  <p onClick={() => router.push("/")} className={classes.username}>
                    {comment.username}
                  </p>
                  <p>{comment.created_at}</p>
                </>
              }
              action={
                <>
                  <FontAwesomeIcon
                    onClick={() => handleDelete(comment.commentId)}
                    className={classes.trash}
                    icon={["fas", "trash"]}
                  />
                </>
              }
            />
            <CardContent>
              <p>{comment.content}</p>
            </CardContent>
          </div>
        ))}
      </div>
      <Divider />
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <div className="module-spacer--very-small" />
        <PrimaryText
          control={control}
          required
          multiline
          rows={2}
          label="comment"
          name="commentField"
          placeholder="コメント"
          type="text"
        />
        <div className="module-spacer--small" />
        <div className="p-grid-rows--center">
          <PrimaryButton submit={true} color="primary" disabled={false}>
            コメントを送信
          </PrimaryButton>
        </div>
        <div className="module-spacer--very-small" />
      </form>
    </div>
  );
};

export default CommentArea;
