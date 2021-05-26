import { Badge, createStyles, IconButton, makeStyles, Theme, useTheme } from "@material-ui/core";
import React, { FC, useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { MenuModal } from "../../../templates";
import { SecondaryButton } from "../atoms";
import classNames from "classnames";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: "auto",
    },
    icon: {
      [theme.breakpoints.down("xs")]: {
        fontSize: 25,
      },
    },
    primaryBtn: {
      fontSize: 20,
      [theme.breakpoints.down("xs")]: {
        fontSize: 10,
      },
    },
    loginName: {
      marginLeft: 10,
    },
  })
);

const HeaderIcons: FC = ({}) => {
  const classes = useStyles();
  const disabledURL = ["/signin", "/signup", "/reset", "/home"];
  const router = useRouter();
  const [barIsOpen, setBarIsOpen] = useState(false);
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);
  const theme = useTheme();

  const toggleBarButton = useCallback(() => {
    setBarIsOpen(!barIsOpen);
  }, [barIsOpen]);

  const toggleBellButton = useCallback(() => {
    setNotificationIsOpen(!notificationIsOpen);
  }, [notificationIsOpen]);

  return disabledURL.includes(router.pathname) ? (
    <>
      <div className={classes.root}>
        <SecondaryButton
          onClick={() => {
            router.push("/signup");
          }}
          className={classNames(classes.primaryBtn)}
          disabled={false}
          bgColor="#C651D4"
          fColor="white">
          新規登録
        </SecondaryButton>
        <SecondaryButton
          onClick={() => {
            router.push("/signin");
          }}
          className={classNames(classes.primaryBtn, classes.loginName)}
          disabled={false}
          bgColor="#C651D4"
          fColor="white">
          ログイン
        </SecondaryButton>
      </div>
    </>
  ) : (
    <>
      <div className={classes.root}>
        <IconButton onClick={toggleBellButton} aria-label="Notification bell">
          <Badge badgeContent={4} color="error">
            <FontAwesomeIcon icon={["far", "bell"]} className={classes.icon} />
          </Badge>
        </IconButton>
        <IconButton onClick={toggleBarButton} aria-label="open modal">
          <FontAwesomeIcon icon={["fas", "bars"]} className={classes.icon} />
        </IconButton>
      </div>
      <MenuModal open={barIsOpen} handleToggle={toggleBarButton} />
    </>
  );
};

export default HeaderIcons;
