import { AppBar, IconButton, Theme, Toolbar, Typography } from "@material-ui/core";
import React, { Children, FC } from "react";
import { createStyles, makeStyles } from "@material-ui/styles";
import HeaderIcons from "../component/UIkit/organisms/HeaderIcons";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleLogo: {
      cursor: "pointer",
      marginRight: 10,
    },
  })
);
const Header: FC = ({ children }) => {
  const classes = useStyles();
  const router = useRouter();
  return (
    <section>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <img
            src="/studious-logo.jpg"
            alt="/studious-logo"
            className={`u-logo-img--general ${classes.titleLogo}`}
            width="40px"
            height="40px"
            onClick={() => router.push("/")}
          />
          <h1 className="u-text-headline--variable" onClick={() => router.push("/")}>
            STUDIOUS
          </h1>
          <HeaderIcons />
        </Toolbar>
      </AppBar>
      {children}
    </section>
  );
};

export default Header;
