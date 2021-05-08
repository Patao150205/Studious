import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import { RootState } from "../store";

//Thunk
export const updateMyInfo: any = createAsyncThunk("user/updateMyInfo", async (data: PartialUserInfo, thunk) => {
  console.log(data.photoURL);
  const uid = data.uid;
  await db.collection("users").doc(uid).set(data, { merge: true });
  //Redux用にキャストする
  data.created_at && (data.created_at = data.created_at.toDate().toLocaleDateString());
  return data;
});

export const fetchMyUserInfo: any = createAsyncThunk("user/fetchMyUserInfo", async (uid: string, thunk) => {
  //uidの未定義による新たなドキュメント作成のエラー回避のための条件分岐
  uid && (await db.collection("users").doc(uid).set({ isSignin: true }, { merge: true }));
  const res = await db.collection("users").doc(uid).get();
  const data: any = res.data();
  data.created_at = data.created_at.toDate().toLocaleString();
  return data;
});

export const updateIsSignin: any = createAsyncThunk("user/updateIsSignin", async (uid: string, thunk) => {
  uid && (await db.collection("users").doc(uid).set({ isSignin: false }, { merge: true }));
  return;
});

//型の値の型を抽出する。
type ValueOf<T> = T[keyof T];
export type UserState = {
  myInfo: {
    created_at: any;
    email: string;
    introduce_myself: string;
    isSignin: boolean;
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

export type PartialUserState = Partial<UserState>;
export type PartialUserInfo = Partial<UserInfo>;
export type PartialUserRecords = Partial<UserRecords>;

type UserInfo = ValueOf<Pick<UserState, "myInfo">>;
type UserRecords = ValueOf<Pick<UserState, "myRecords">>;

export const initialState: UserState = {
  myInfo: {
    created_at: null,
    email: "",
    photoURL: "",
    introduce_myself: "",
    isSignin: false,
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
    [updateMyInfo.fulfilled]: (state, action) => {
      state.myInfo = {
        ...action.payload,
      };
      console.log(state.myInfo);
    },
    [updateMyInfo.rejected]: () => {
      alert("エラーが発生しました。");
    },
    [fetchMyUserInfo.fulfilled]: (state, action) => {
      state.myInfo = action.payload;
    },
    [fetchMyUserInfo.rejected]: () => {
      alert("エラーが発生しました");
    },
    [updateIsSignin.fulfilled]: (state, action) => {
      state.myInfo.isSignin = false;
    },
  },
});

export const userSelector = (state: RootState) => state.users;
export const userMyInfoSelector = (state: RootState) => state.users.myInfo;
export const userRecordSelector = (state: RootState) => state.users.myRecords;
export const userIsSinginSelector = (state: RootState) => state.users.myInfo.isSignin;

export const {} = usersSlice.actions;

export default usersSlice.reducer;
