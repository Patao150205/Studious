import { AppBar, Toolbar } from "@material-ui/core";
import React, { FC } from "react";
import HeaderIcons from "../component/UIkit/organisms/HeaderIcons";
import { StudiousLogoHorizontal } from "../component/UIkit/molecules";

const Header: FC = ({ children }) => {
  return (
    <section>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <StudiousLogoHorizontal />
          <HeaderIcons />
        </Toolbar>
      </AppBar>
      {children}
    </section>
  );
};

export default Header;
