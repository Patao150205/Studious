import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../src/features/hooks";
import {
  deleteUserRecord,
  reflectRecordData,
  UserRecord,
  userRecordSelector,
  userStatisticalDataSelector,
} from "../../src/features/usersSlice";
import { PostCard } from "../../src/component/UIkit/organisms/index";
import { createStyles, makeStyles } from "@material-ui/styles";
import { IconButton, Theme } from "@material-ui/core";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth, db, FirebaseTimestamp } from "../../firebase/firebaseConfig";

export type HandleDelete = {
  uid: string;
  recordId: string;
  newPosts: UserRecord[];
  total_time: number;
  posts_count: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noPostRoot: {
      position: "absolute",
      transform: "translate(-50%, -50%)",
      top: "50%",
      left: "50%",
    },
    togglePageBtn: {
      fontSize: 30,
      display: "flex",
      justifyContent: "center",
    },
  })
);

function parseDataToDate(data: UserRecord) {
  if (data.created_at.seconds) {
    data.created_at = data.created_at.toDate().toLocaleString();
    data.updated_at = data.updated_at.toDate().toLocaleString();
  }
  if (data?.doneDate?.seconds) {
    data.doneDate = data.doneDate.toDate().toLocaleString();
  }
  if (data.othersComments?.comments) {
    data.othersComments.comments.map((comment) => {
      if (comment.created_at.seconds) {
        comment.created_at = comment.created_at.toDate().toLocaleString();
      }
    });
  }
}

const Record = () => {
  const user = auth.currentUser;
  const dispatch = useAppDispatch();
  const selector = useAppSelector(userRecordSelector);
  const classes = useStyles();
  const statisticalData = useAppSelector(userStatisticalDataSelector);

  //前後のレコードを保持
  const [currentFirstRecord, setCurrentFirstRecord] = useState<any>(null);
  const [currentLastRecord, setCurrentLastRecord] = useState<any>(null);
  //一番最初と最後のレコードを保持
  const [firstRecord, setFirstRecord] = useState<any>();
  const [lastRecord, setLastRecord] = useState<any>();
  const [hasPrevPage, setHasPrevPage] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);

  const limitCount = 10;
  useEffect(() => {
    const unsubscribes: any = [];
    if (user) {
      //初期データ取得
      db.collection("users")
        .doc(user.uid)
        .collection("userRecords")
        .orderBy("created_at", "desc")
        .limit(limitCount)
        .get()
        .then((snapshot) => {
          const postsData: UserRecord[] = [];
          snapshot.forEach((doc: any) => {
            const data = doc.data();
            parseDataToDate(data);
            postsData.push(data);
          });
          dispatch(reflectRecordData(postsData));
        });
      //最初のレコード
      unsubscribes.push(
        db
          .collection("users")
          .doc(user.uid)
          .collection("userRecords")
          .orderBy("created_at", "desc")
          .limit(1)
          .onSnapshot((snapshot) => {
            if (snapshot.docs[0]) {
              const data: any = snapshot.docs[0].data();
              parseDataToDate(data);
              setFirstRecord(data);
            }
          })
      );
      //最後のレコード
      unsubscribes.push(
        db
          .collection("users")
          .doc(user.uid)
          .collection("userRecords")
          .orderBy("created_at", "desc")
          .limitToLast(1)
          .onSnapshot((snapshot) => {
            if (snapshot.docs[0]) {
              const data: any = snapshot.docs[0].data();
              parseDataToDate(data);
              setLastRecord(data);
            }
          })
      );
    }
    return () =>
      unsubscribes.forEach((unsub: any) => {
        unsub();
      });
  }, []);

  useEffect(() => {
    if (lastRecord && selector) {
      if (selector.length > 0) {
        setHasNextPage(true);
        selector.forEach((item) => {
          if (item.recordId === lastRecord.recordId) {
            setHasNextPage(false);
          }
        });
        setCurrentLastRecord(selector.slice(-1)[0]);
      }
    }
    if (firstRecord && selector) {
      if (selector.length > 0) {
        setHasPrevPage(true);
        selector.forEach((item) => {
          if (item.recordId === firstRecord.recordId) {
            setHasPrevPage(false);
          }
        });
        setCurrentFirstRecord(selector[0]);
      }
    }
  }, [firstRecord, lastRecord, selector]);

  // console.log(firstRecord);
  // console.log(lastRecord);
  // console.log(currentFirstRecord);
  // console.log(currentLastRecord);
  // console.log(hasNextPage);
  // console.log(hasPrevPage);

  const handleNext = () => {
    db.collection("users")
      .doc(user?.uid)
      .collection("userRecords")
      .orderBy("created_at", "desc")
      .startAfter(FirebaseTimestamp.fromDate(new Date(currentLastRecord.created_at)))
      .limit(limitCount)
      .get()
      .then((snapshot) => {
        const postsData: UserRecord[] = [];
        snapshot.forEach((doc: any) => {
          const data = doc.data();
          parseDataToDate(data);
          postsData.push(data);
        });
        dispatch(reflectRecordData(postsData));
      });
  };
  const handlePrev = () => {
    db.collection("users")
      .doc(user?.uid)
      .collection("userRecords")
      .orderBy("created_at", "desc")
      .endBefore(FirebaseTimestamp.fromDate(new Date(currentFirstRecord.created_at)))
      .limitToLast(limitCount)
      .get()
      .then((snapshot) => {
        const postsData: UserRecord[] = [];
        snapshot.forEach((doc: any) => {
          const data = doc.data();
          parseDataToDate(data);
          postsData.push(data);
        });
        dispatch(reflectRecordData(postsData));
      });
  };

  const handleDelete = useCallback(
    (uid: string, recordId: string) => {
      const isPost = confirm("本当に投稿を削除してよろしいでしょうか？");
      if (isPost) {
        const targetRecord = selector.find((ele) => ele.recordId === recordId);
        let { total_time, posts_count } = statisticalData;
        if (targetRecord?.isLearningRecord) {
          total_time = statisticalData.total_time - (targetRecord?.sumedTime ?? 0);
          posts_count -= 1;
        }
        const newPosts = selector.filter((ele: UserRecord) => ele.recordId !== recordId);
        const query = {
          uid,
          recordId,
          newPosts,
          total_time,
          posts_count,
        };
        dispatch(deleteUserRecord(query));
      }
    },
    [selector, statisticalData]
  );

  return (
    <>
      <Head>
        <title>STUDIOS 全投稿</title>
      </Head>
      {selector?.length !== 0 || firstRecord || lastRecord ? (
        <section className={`c-section-wrapping--main`}>
          {selector?.map((post) => (
            <PostCard handleDelete={handleDelete} key={post.recordId} post={post} />
          ))}
          <div className={classes.togglePageBtn}>
            <IconButton disabled={!hasPrevPage} onClick={handlePrev}>
              <FontAwesomeIcon icon={["fas", "chevron-left"]} />
            </IconButton>
            <IconButton disabled={!hasNextPage} onClick={handleNext}>
              <FontAwesomeIcon icon={["fas", "chevron-right"]} />
            </IconButton>
          </div>
          <div className="module-spacer--very-small" />
        </section>
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
