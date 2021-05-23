import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { auth } from "../../../../firebase/firebaseConfig";
import firebase from "firebase/app";
import classNames from "classnames";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      marginRight: 5,
      fontSize: 10,
      "@media (max-width: 360px)": {
        "& > h1": {
          fontSize: 16,
        },
      },
    },
    logoImg: {
      width: 40,
      height: 40,
      marginRight: 5,
      [theme.breakpoints.down("xs")]: {
        width: 35,
        height: 35,
      },
      "@media (max-width: 360px)": {
        width: 30,
        height: 30,
      },
    },
    enable: {
      cursor: "pointer",
    },
  })
);

const StudiousLogoHorizontal: FC = () => {
  const router = useRouter();
  const classes = useStyles();
  const isSignin = auth.currentUser;

  return (
    <div className={`${classes.root} ${classes.enable}`}>
      <img
        src="/studious-logo.jpg"
        alt="/studious-logo"
        className={classNames("u-logo-img--general", classes.logoImg)}
        onClick={() => router.push("/home")}
      />
      <h1
        className="u-text-headline--variable"
        onClick={isSignin ? () => router.push("/") : () => router.push("/home")}>
        STUDIOUS
      </h1>
    </div>
  );
};

export default StudiousLogoHorizontal;
