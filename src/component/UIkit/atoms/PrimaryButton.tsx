import { Button } from "@material-ui/core";
import React from "react";

type Props = {
  disabled: boolean;
  onClick?: () => void;
  children: string;
  color: "inherit" | "primary" | "secondary" | "default";
  submit?: boolean;
};

const PrimaryButton = ({ color, disabled, onClick = null, children, submit = false }: Props) => {
  return (
    <Button color={color} disabled={disabled} variant="contained" onClick={onClick} type={submit ? "submit" : "button"}>
      {children}
    </Button>
  );
};

export default PrimaryButton;
