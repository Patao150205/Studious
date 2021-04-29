import { Button } from "@material-ui/core";
import React from "react";

type Props = {
  disabled: boolean;
  onClick: () => void;
  children: string;
  color: "inherit" | "primary" | "secondary" | "default";
};

const PrimaryButton = ({ color, disabled, onClick, children }) => {
  return (
    <Button color={color} disabled={disabled} variant="contained" onClick={onClick}>
      {children}
    </Button>
  );
};

export default PrimaryButton;
