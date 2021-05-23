import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { useAppDispatch } from "./features/hooks";
import { fetchMyUserInfo } from "./features/usersSlice";
import firebase from "firebase/app";

const AuthObserver: FC = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notNeedAuthenticated = ["/signin", "/signup", "/reset", "/home"];
  const [user, setUser] = useState<firebase.User | null>(null);
  const url = router.pathname;

  useEffect(() => {
    if (notNeedAuthenticated.includes(url)) {
      return;
    }
    auth.onAuthStateChanged((user) => {
      //ユーザがいないかつ認証が必要なパス
      if (!user && !notNeedAuthenticated.includes(url)) {
        router.push("/signin");
      } else {
        setUser(user);
        dispatch(fetchMyUserInfo(user?.uid));
      }
    });
  }, [url]);

  return notNeedAuthenticated.includes(url) || user ? <>{children}</> : <></>;
};

export default AuthObserver;
