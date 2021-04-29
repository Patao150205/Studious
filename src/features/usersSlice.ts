import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type UserState = {
  id: string;
  created_at: string;
  email: string;
  icon_path: string;
  introduce_myself: string;
  role: "User" | "Admin";
  sns_path: { twitter: string; GitHub: string };
  target: string;
  uid: string;
  updated_at: string;
  username: string;
  records: [
    {
      created_at: string;
      comment: string;
      date: string;
      learning_content: [{ content: string; time: string }];
      images: [];
      subject: string;
      updated_at: string;
    }
  ];
};

export const initialState: UserState = {
  id: "",
  created_at: "",
  email: "",
  icon_path: "",
  introduce_myself: "",
  role: "User",
  sns_path: { twitter: "", GitHub: "" },
  target: "",
  uid: "",
  updated_at: "",
  username: "",
  records: [
    {
      created_at: "",
      comment: "",
      date: "",
      learning_content: [{ content: "", time: "" }],
      images: [],
      subject: "",
      updated_at: "",
    },
  ],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export const userIdSelector = (state) => state.id;

export default usersSlice.reducer;
