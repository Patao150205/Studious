import { MenuItem, Select } from "@material-ui/core";
import React, { FC, useState } from "react";
import { Control, Controller } from "react-hook-form";

type Props = { count: number; label: string; control: any; name: string };

const NumSelector: FC<Props> = ({ count, label, control, name }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select {...field} defaultValue={0} labelWidth={90} label={label}>
          {[...Array(count)].map((_, index) => (
            <MenuItem dense key={index} value={index}>
              {index}
            </MenuItem>
          ))}
        </Select>
      )}
    />
  );
};

export default NumSelector;
