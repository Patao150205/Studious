import { Badge, createStyles, IconButton, makeStyles, Theme } from "@material-ui/core";
import React, { FC, useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { MenuModal } from "../../../templates";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: "auto",
    },
    icon: {
      [theme.breakpoints.down("sm")]: {
        fontSize: 25,
      },
    },
  })
);

const HeaderIcons: FC = ({ }) => {
  const classes = useStyles();
  const disabledURL = ["/signin", "/signup", "/reset"];
  const router = useRouter();
  const [barIsOpen, setBarIsOpen] = useState(false);
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);

  const toggleBarButton = useCallback(() => {
    setBarIsOpen(!barIsOpen);
  }, [barIsOpen]);

  const toggleBellButton = useCallback(() => {
    setNotificationIsOpen(!notificationIsOpen);
  }, [notificationIsOpen]);

  return disabledURL.includes(router.pathname) ? (
    <></>
  ) : (
    <>
      <div className={classes.root}>
        <IconButton onClick={toggleBarButton} aria-label="open modal">
          <FontAwesomeIcon icon={["fas", "bars"]} className={classes.icon} />
        </IconButton>
      </div>
      <MenuModal open={barIsOpen} handleToggle={toggleBarButton} />
    </>
  );
};

export default HeaderIcons;
