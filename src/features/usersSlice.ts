import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../../firebase/firebaseConfig";
import { UplodedImg } from "../../pages/edit";
import { RootState } from "../store";

//Thunk
export const updateMyInfo: any = createAsyncThunk("user/updateMyInfo", async (data: PartialUserInfo, thunk) => {
  const uid = data.uid;
  console.log(uid);
  await db.collection("users").doc(uid).set(data, { merge: true });
  //Redux用にキャストする
  data.created_at && (data.created_at = data.created_at.toDate().toLocaleDateString());
  console.log("1");
  return data;
});

export const fetchMyUserInfo: any = createAsyncThunk("user/fetchMyUserInfo", async (uid: string, thunk) => {
  console.log("ぱたお");
  //uidの未定義による新たなドキュメント作成のエラー回避のための条件分岐
  uid && (await db.collection("users").doc(uid).set({ isSignin: true }, { merge: true }));
  const res = await db.collection("users").doc(uid).get();
  const data: any = res.data();
  data.created_at = data.created_at.toDate().toLocaleDateString();
  return data;
});

export const updateMyRecord: any = createAsyncThunk("user/updateMyRecord", async (data: PartialUserRecord, thunk) => {
  console.log(data);
  const recordRef = db.collection("users").doc(data.uid).collection("userRecords").doc();
  data.recordId = recordRef.id;
  await recordRef.set(data, { merge: true });
  data.created_at = data.created_at.toDate().toLocaleString();
  data.updated_at = data.updated_at.toDate().toLocaleString();
  console.log(data.updated_at);
  return data;
});

export const updateIsSignin: any = createAsyncThunk("user/updateIsSignin", async (uid: string, thunk) => {
  uid && (await db.collection("users").doc(uid).set({ isSignin: false }, { merge: true }));
  return;
});

//型の値の型を抽出する。
type ValueOf<T> = T[keyof T];

type UserInfo = {
  created_at: any;
  email: string;
  introduce_myself: string;
  isSignin: boolean;
  role: "User" | "Admin";
  photoURL: string;
  postCount: number;
  sns_path: { twitter: string; GitHub: string };
  target: string;
  uid: string;
  username: string;
};
type UserRecord = {
  recordId: string;
  created_at: any;
  comment: string;
  doneDate: string;
  learning_content: [{ content: string; hours: number; minutes: number; convertedToMinutes: number }];
  images: UplodedImg[];
  sumedTime: number;
  updated_at: any;
  uid: string;
  username: string;
};
export type UserState = {
  myInfo: UserInfo;
  myRecords: UserRecord[];
};

export type PartialUserInfo = Partial<UserInfo>;
export type PartialUserRecord = Partial<UserRecord>;

export const initialState: UserState = {
  myInfo: {
    created_at: null,
    email: "",
    photoURL: "",
    introduce_myself: "",
    isSignin: false,
    postCount: 0,
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
      doneDate: "",
      learning_content: [{ content: "", hours: 0, minutes: 0, convertedToMinutes: 0 }],
      images: [],
      sumedTime: 0,
      updated_at: null,
      uid: "",
      username: "",
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
      // alert("エラーが発生しました");
    },
    [updateMyRecord.fulfilled]: (state, action) => {
      state.myRecords.push(action.payload);
    },
    [updateMyRecord.rejected]: (state, action) => {
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
