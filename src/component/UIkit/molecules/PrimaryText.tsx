import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { Controller } from "react-hook-form";
import { TextInput } from "../atoms";

type Props = {
  control: any;
  errors?: any;
  errorMessage?: string;
  defaultValue?: string;
  fullWidth?: boolean;
  required?: boolean;
  rows?: number;
  rules?: any;
  label: string;
  multiline?: boolean;
  name: string;
  placeholder: string;
  type: "email" | "password" | "number" | "text";
};

const TextValidation = ({
  control,
  errors,
  errorMessage,
  fullWidth = true,
  required = true,
  rows = 1,
  rules,
  label,
  multiline = false,
  name,
  placeholder,
  type,
}: Props) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TextInput
            field={field}
            label={label}
            fullWidth={fullWidth}
            multiline={multiline}
            placeholder={placeholder}
            required={required}
            rows={rows}
            type={type}
          />
        )}
        rules={rules}
      />
      {errors && (
        <ErrorMessage
          errors={errors}
          name={name}
          render={() => <span style={{ color: "red" }}>{errorMessage ? errorMessage : "エラー"}</span>}
        />
      )}
    </>
  );
};

export default TextValidation;
