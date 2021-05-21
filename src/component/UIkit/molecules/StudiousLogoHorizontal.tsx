import { createStyles, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { auth } from "../../../../firebase/firebaseConfig";
import { useAppSelector } from "../../../features/hooks";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      marginRight: 10,
      "& > img": {
        marginRight: 10,
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
        className={`u-logo-img--general`}
        width="40px"
        height="40px"
        onClick={!isSignin ? () => {} : () => router.push("/")}
      />
      <h1 className="u-text-headline--variable" onClick={() => router.push("/")}>
        STUDIOUS
      </h1>
    </div>
  );
};

export default StudiousLogoHorizontal;
