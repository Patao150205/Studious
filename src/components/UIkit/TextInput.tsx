import React from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles } from "@material-ui/styles";

// const useStyles = makeStyles((theme) => createStyles({}));

type Props = {
  label: string;
  fullWidth: boolean;
  multiline: boolean;
  onChange: () => void;
  placeholder: string;
  required: boolean;
  rows: number;
  type: string;
  value: string;
};

const TextInput = ({ label, fullWidth, multiline, onChange, placeholder, required, rows, type, value }: Props) => {
  // const classes = useStyles();
  return (
    <TextField
      InputLabelProps={{ shrink: true }}
      label={label}
      fullWidth={fullWidth}
      multiline={multiline}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      type={type}
      value={value}
      variant="standard"
    />
  );
};

export default TextInput;
