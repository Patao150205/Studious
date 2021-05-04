import { createStyles, Drawer, Hidden, makeStyles } from "@material-ui/core";
import React, { FC } from "react";
import { MainMenu } from "../component/UIkit/organisms/index";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    drawer: {
      width: 300,
      backgroundColor: theme.palette.primary[100],
      boxShadow: "5px 0 10px rgba(0, 0, 0, 0.2)",
    },
  })
);

const Sidebar: FC = () => {
  const classes = useStyles();
  return (
    <Hidden mdDown>
      <Drawer classes={{ paper: classes.drawer }} anchor="left" open variant="persistent">
        <MainMenu />
      </Drawer>
    </Hidden>
  );
};

export default Sidebar;
