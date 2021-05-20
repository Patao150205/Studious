import { Button, SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { createStyles, makeStyles } from "@material-ui/styles";
import React from "react";

type Props = {
  disabled: boolean;
  onClick?: () => void;
  children?: string;
  bgColor: string;
  fColor: string;
  startIcon: any;
  variant?: "text" | "outlined" | "contained" | undefined;
};

const SecondButton = ({ disabled, onClick, children, bgColor, fColor, startIcon, variant }: Props) => {
  const useStyles = makeStyles(
    createStyles({
      root: {
        backgroundColor: bgColor,
        color: fColor,
        textTransform: "none",
        "&:hover": {
          backgroundColor: bgColor,
          opacity: "0.8",
        },
      },
    })
  );
  const classes = useStyles();

  return (
    <Button
      disabled={disabled}
      className={classes.root}
      onClick={onClick}
      startIcon={startIcon}
      variant={variant ?? "contained"}>
      {children}
    </Button>
  );
};

export default SecondButton;
