import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import { UplodedImg } from "../../pages/edit";
import { HandleDelete } from "../../pages/record";
import { RootState } from "../store";

//Thunk
export const updateMyInfo: any = createAsyncThunk("user/updateMyInfo", async (data: PartialUserInfo, thunk) => {
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
  data.created_at = data.created_at?.toDate().toLocaleDateString();
  return data;
});

export const updateMyRecord: any = createAsyncThunk("user/updateMyRecord", async (data: PartialUserRecord, thunk) => {
  //編集か新規作成化を判別
  if (!data.recordId) {
    const recordRef = db.collection("users").doc(data.uid).collection("userRecords").doc();
    data.recordId = recordRef.id;
    await recordRef.set(data, { merge: true });
  } else {
    //編集されたので、isNewをfalseに
    data.isNew = false;
    await db.collection("users").doc(data.uid).collection("userRecords").doc(data.recordId).set(data, { merge: true });
  }
});

export const deleteUserRecord: any = createAsyncThunk(
  "user/deleteUserRecord",
  async ({ uid, recordId, newPosts, total_time, posts_count }: HandleDelete, thunk) => {
    await db.collection("users").doc(uid).collection("userRecords").doc(recordId).delete();
    await db.collection("users").doc(uid).set({ statisticalData: { total_time, posts_count } }, { merge: true });
    return newPosts;
  }
);

//型の値の型を抽出する。
type ValueOf<T> = T[keyof T];

type UserInfo = {
  created_at: any;
  email: string;
  introduce_myself: string;
  role: "User" | "Admin";
  photoURL: string;
  sns_path: { twitter: string; GitHub: string };
  statisticalData: { total_time: number; posts_count: number };
  target: string;
  uid: string;
  username: string;
};
export type UserRecord = {
  created_at: any;
  doneDate?: any;
  goodHeart: [{ uid: string; username: string; userIcon: string }] | [];
  recordId: string;
  learning_content?: [{ learningContent: string; hours: number; minutes: number; convertedToMinutes: number }];
  ownComment: string;
  images: UplodedImg[];
  isNew: boolean;
  isLearningRecord: boolean;
  sumedTime: number;
  updated_at: any;
  uid: string;
  username: string;
  userIcon: string;
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
    role: "User",
    sns_path: { twitter: "", GitHub: "" },
    statisticalData: { total_time: 0, posts_count: 0 },
    target: "",
    uid: "",
    username: "",
  },
  myRecords: [
    {
      recordId: "",
      created_at: null,
      doneDate: null,
      goodHeart: [],
      learning_content: [{ learningContent: "", hours: 0, minutes: 0, convertedToMinutes: 0 }],
      ownComment: "",
      images: [],
      isNew: true,
      isLearningRecord: false,
      sumedTime: 0,
      updated_at: null,
      uid: "",
      username: "",
      userIcon: "",
    },
  ],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reflectRecordData: (state, action) => {
      state.myRecords = action.payload;
    },
    reflectHeart: (state, action) => {
      state.myRecords.map((post) => {
        if (post.recordId === action.payload.recordId) {
          post.goodHeart = action.payload;
        }
      });
    },
  },
  extraReducers: {
    [updateMyInfo.fulfilled]: (state, action) => {
      state.myInfo = {
        ...action.payload,
      };
    },
    [updateMyInfo.rejected]: () => {
      alert("ユーザ情報の更新に失敗しました。");
    },
    [fetchMyUserInfo.fulfilled]: (state, action) => {
      state.myInfo = action.payload;
    },
    [fetchMyUserInfo.rejected]: () => {
      alert("ユーザー情報の取得に失敗しました。");
    },
    [updateMyRecord.rejected]: (state, action) => {
      alert("投稿データの作成に失敗しました。");
    },
    [deleteUserRecord.fulfilled]: (state, action) => {
      state.myRecords = action.payload;
    },
    [deleteUserRecord.rejected]: (state, action) => {
      alert("投稿の削除に失敗しました");
    },
  },
});

export const userSelector = (state: RootState) => state.users;
export const userMyInfoSelector = (state: RootState) => state.users.myInfo;
export const userRecordSelector = (state: RootState) => state.users.myRecords;
export const userStatisticalDataSelector = (state: RootState) => state.users.myInfo.statisticalData;
export const { reflectRecordData, reflectHeart } = usersSlice.actions;

export default usersSlice.reducer;
