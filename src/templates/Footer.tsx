import { Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import React, { FC } from "react";

type Props = {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  })
);

const Footer: FC<Props> = ({}) => {
  return <div></div>;
};

export default Footer;
