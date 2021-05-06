import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import { RootState } from "../store";

//Thunk
export const updateProfile: any = createAsyncThunk("user/updateProfile", async (data: UserProfile, thunk) => {
  const uid = data.uid;
  await db.collection("users").doc(uid).set(data, { merge: true });
  //Redux用にキャストする
  data.created_at = data.created_at.toDate().toLocaleString();
  return data;
});

export const fetchUserInfo: any = createAsyncThunk("user/fetchUserInfo", async (uid: string, thunk) => {
  const res = await db.collection("users").doc(uid).get();
  const data: any = res.data();
  data.created_at = data.created_at.toDate().toLocaleString();
  return data;
});

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
  reducers: {},
  extraReducers: {
    [updateProfile.fulfilled]: (state, action) => {
      state = action.payload;
    },
    [updateProfile.rejected]: () => {
      alert("エラーが発生しました。");
    },
    [fetchUserInfo.fulfilled]: (state, action) => {
      state = action.payload;
    },
    [fetchUserInfo.rejected]: () => {
      alert("エラーが発生しました");
    },
  },
});

export const userSelector = (state: RootState) => state.users;
export const userProfileSelector = (state: RootState) => state.users.myProfile;
export const userRecordSelector = (state: RootState) => state.users.myRecords;

export const {} = usersSlice.actions;

export default usersSlice.reducer;
