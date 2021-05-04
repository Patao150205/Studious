import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { FC } from "react";
import { MenuList, NewsCard } from "../molecules";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const MainMenu: FC = () => {
  const classes = useStyles();

  return (
    <div>
      <MenuList />
      <NewsCard />
    </div>
  );
};

export default MainMenu;
