import React from "react";
import TextField from "@material-ui/core/TextField";

type Props = {
  label: string;
  fullWidth: boolean;
  multiline: boolean;
  placeholder: string;
  required: boolean;
  rows: number;
  type: string;
  field: any;
};

/**
 * React-hook-form使用するため、PrimaryTextの方を実際に使用すること！
 */
const TextInput = ({ field, label, fullWidth, multiline, placeholder, required, rows, type }: Props) => {
  return (
    <TextField
      {...field}
      InputLabelProps={{ shrink: true }}
      label={label}
      fullWidth={fullWidth}
      multiline={multiline}
      placeholder={placeholder}
      required={required}
      rows={rows}
      type={type}
      variant="standard"
    />
  );
};

export default TextInput;
