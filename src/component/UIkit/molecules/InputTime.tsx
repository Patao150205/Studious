import { TextField } from "@material-ui/core";
import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { FirebaseTimestamp } from "../../../../firebase/firebaseConfig";

type Props = {
  name: string;
  control: any;
};

const time = new Date(FirebaseTimestamp.now().toDate().getTime());
const year = time.getFullYear();
const month = ("0" + (time.getMonth() + 1)).slice(-2);
const date = ("0" + time.getDate()).slice(-2);
export const processedTime = `${year}-${month}-${date}`;

const InputTime: FC<Props> = ({ name, control }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
          {...field}
          label="DATE"
          type="date"
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
    />
  );
};

export default InputTime;
