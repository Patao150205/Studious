import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

//Operation

const signUpWithEmail = createAsyncThunk("user/signUpByEmail", async (action, thunk) => {});

//型の値の型を抽出する。
type ValueOf<T> = T[keyof T];
export type UserState = {
  myProfile: {
    created_at: any;
    email: string;
    introduce_myself: string;
    role: "User" | "Admin";
    photoURL: string;
    sns_path: { twitter: string; GitHub: string };
    target: string;
    uid: string;
    updated_at: any;
    username: string;
  };
  myRecords: [
    {
      recordId: "";
      created_at: any;
      comment: "";
      date: "";
      learning_content: [{ content: ""; time: "" }];
      images: [];
      subject: "";
      updated_at: any;
    }
  ];
};

type UserProfile = ValueOf<Pick<UserState, "myProfile">>;
type UserRecords = ValueOf<Pick<UserState, "myRecords">>;

export const initialState: UserState = {
  myProfile: {
    created_at: null,
    email: "",
    photoURL: "",
    introduce_myself: "",
    role: "User",
    sns_path: { twitter: "", GitHub: "" },
    target: "",
    uid: "",
    updated_at: null,
    username: "",
  },
  myRecords: [
    {
      recordId: "",
      created_at: null,
      comment: "",
      date: "",
      learning_content: [{ content: "", time: "" }],
      images: [],
      subject: "",
      updated_at: null,
    },
  ],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateCurrnetUser: (state, action: PayloadAction<UserState>) => action.payload,
    updateUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.myProfile = action.payload;
    },
    updateUserRecords: (state, action: PayloadAction<UserRecords>) => {
      state.myRecords = action.payload;
    },
  },
});

export const userSelector = (state: RootState) => state.users;
export const userProfileSelector = (state: RootState) => state.users.myProfile;
export const userRecordSelector = (state: RootState) => state.users.myRecords;

export const { updateCurrnetUser, updateUserProfile, updateUserRecords } = usersSlice.actions;

export default usersSlice.reducer;
