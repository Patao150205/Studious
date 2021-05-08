import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { useAppDispatch } from "./features/hooks";
import { fetchMyUserInfo } from "./features/usersSlice";
import firebase from "firebase/app";

const AuthObserver: FC = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notNeedAuthenticated = ["/signin", "/signup", "/reset"];
  const user = useState<firebase.User | null>(null);
  const url = router.pathname;

  useEffect(() => {
    if (notNeedAuthenticated.includes(url)) {
      return;
    }
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(fetchMyUserInfo(user.uid));
      } else {
        router.push("/signin");
      }
    });
  }, [url]);
  return !user ? <></> : <>{children}</>;
};

export default AuthObserver;
