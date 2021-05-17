import { TextField } from "@material-ui/core";
import React, { FC } from "react";

type Props = {
  doneDate: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
};

export function parseTime(time: Date) {
  const year = time.getFullYear();
  const month = ("0" + (time.getMonth() + 1)).slice(-2);
  const date = ("0" + time.getDate()).slice(-2);
  const converted = `${year}-${month}-${date}`;
  return converted;
}

const InputTime: FC<Props> = ({ onChange, doneDate }) => {
  return (
    <TextField
      value={doneDate && parseTime(new Date(doneDate))}
      label="DATE"
      type="date"
      required
      onChange={(e) => onChange(e)}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};

export default InputTime;
