import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { useAppDispatch } from "./features/hooks";
import { fetchUserInfo } from "./features/usersSlice";

const AuthObserver: FC = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const unauthenticated = ["/signin", "/signup", "/reset"];

  useEffect(() => {
    const url = window.location.pathname;
    if (unauthenticated.includes(url)) {
      return;
    }
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(fetchUserInfo(user.uid));
      } else {
        router.push("/signin");
      }
    });
  }, []);
  return <>{children}</>;
};

export default AuthObserver;
