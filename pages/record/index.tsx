import Head from "next/head";
import React, { useCallback } from "react";
import { useAppDispatch } from "../../src/features/hooks";
import { useSelector } from "react-redux";
import { deleteUserRecord, UserRecord, userRecordSelector } from "../../src/features/usersSlice";
import { PostCard } from "../../src/component/UIkit/organisms/index";
import { createStyles, makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import Link from "next/link";

export type HandleDelete = {
  uid: string;
  recordId: string;
  newPosts: UserRecord[];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noPostRoot: {
      position: "absolute",
      transform: "translate(-50%, -50%)",
      top: "50%",
      left: "50%",
    },
  })
);

const Record = () => {
  const selector = useSelector(userRecordSelector);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const handleEdit = useCallback((uid: string, recordId: string) => {
    // dispatch();
  }, []);
  console.log(selector);
  const handleDelete = useCallback(
    (uid: string, recordId: string) => {
      const isPost = confirm("本当に投稿を削除してよろしいでしょうか？");
      if (isPost) {
        const newPosts = selector.filter((ele: UserRecord) => ele.recordId !== recordId);
        const query = {
          uid,
          recordId,
          newPosts,
        };
        dispatch(deleteUserRecord(query));
      }
    },
    [selector]
  );
  return (
    <>
      <Head>
        <title>STUDIOUS 学習記録</title>
      </Head>
      {selector.length !== 0 ? (
        <>
          <section className={`c-section-wrapping--main`}>
            {selector.map((post) => (
              <PostCard handleEdit={handleEdit} handleDelete={handleDelete} key={post.recordId} post={post} />
            ))}
          </section>
        </>
      ) : (
        <div className={`${classes.noPostRoot} c-section-container`}>
          <h1>投稿がありません。作成してみよう！</h1>
          <div className="module-spacer--medium" />
          <Link href="/record/edit">
            <a>投稿作成ページへ</a>
          </Link>
        </div>
      )}
    </>
  );
};

export default Record;
