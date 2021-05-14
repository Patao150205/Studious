import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { useAppDispatch } from "./features/hooks";
import { fetchMyUserInfo, reflectRecordData, UserRecord } from "./features/usersSlice";
import firebase from "firebase/app";
import { Comment } from "./component/UIkit/organisms/commentArea";

const AuthObserver: FC = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notNeedAuthenticated = ["/signin", "/signup", "/reset"];
  const [user, setUser] = useState<firebase.User | null>(null);
  const url = router.pathname;

  useEffect(() => {
    if (notNeedAuthenticated.includes(url)) {
      return;
    }
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/signin");
      } else {
        setUser(user);
        dispatch(fetchMyUserInfo(user.uid));
      }
    });
  }, [url]);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      unsubscribe = db
        .collection("users")
        .doc(user?.uid)
        .collection("userRecords")
        .onSnapshot((snapshot) => {
          const postsData: any = [];
          snapshot.forEach((record) => {
            const data: any = record.data();
            data.created_at = data.created_at?.toDate().toLocaleString();
            data.updated_at = data.updated_at?.toDate().toLocaleString();
            //他の人のコメントの作成日時の変換
            let othersCommentsArr = data.othersComments?.comments;
            const converted = othersCommentsArr?.map((comment: Comment) => {
              if (comment.created_at.seconds) {
                comment.created_at = comment.created_at?.toDate()?.toLocaleString();
              }
            });
            othersCommentsArr = converted;
            postsData.push(data);
          });
          dispatch(reflectRecordData(postsData));
        });
    }
    return unsubscribe;
  }, [user]);

  return notNeedAuthenticated.includes(url) || user ? <>{children}</> : <></>;
};

export default AuthObserver;
