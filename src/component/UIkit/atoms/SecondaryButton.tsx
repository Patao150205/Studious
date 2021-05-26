import { Button } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import React from "react";
import classNames from "classnames";

type Props = {
  disabled: boolean;
  onClick?: () => void;
  children?: string;
  bgColor: string;
  fColor: string;
  startIcon?: any;
  variant?: "text" | "outlined" | "contained" | undefined;
  className?: string;
};

const SecondButton = ({ disabled, onClick, children, bgColor, fColor, startIcon, variant, className }: Props) => {
  const useStyles = makeStyles(
    createStyles({
      root: {
        backgroundColor: bgColor,
        color: fColor,
        textTransform: "none",
        opacity: 1,
        transition: "opacity 0.3s",
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
      className={classNames(classes.root, className)}
      onClick={onClick}
      startIcon={startIcon}
      variant={variant ?? "contained"}>
      {children}
    </Button>
  );
};

export default SecondButton;
