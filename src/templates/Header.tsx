import { AppBar, IconButton, Theme, Toolbar, Typography } from "@material-ui/core";
import React, { Children, FC } from "react";
import { createStyles, makeStyles } from "@material-ui/styles";
import HeaderIcons from "../component/UIkit/organisms/HeaderIcons";
import { useRouter } from "next/router";
import { StudiousLogoParallel } from "../component/UIkit/molecules";

const Header: FC = ({ children }) => {
  return (
    <section>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <StudiousLogoParallel />
          <HeaderIcons />
        </Toolbar>
      </AppBar>
      {children}
    </section>
  );
};

export default Header;
